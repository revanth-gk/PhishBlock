require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'PhishBlock API is running' });
});

// Submit phishing report
app.post('/api/submit', async (req, res) => {
  try {
    const { type, content, notes, reporterId } = req.body;

    // Validate input
    if (!type || !content || !reporterId) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    if (!['url', 'wallet'].includes(type)) {
      return res.status(400).json({ success: false, error: 'Invalid type' });
    }

    const { data, error } = await supabase
      .from('reports')
      .insert([
        { 
          type, 
          content, 
          notes: notes || null,
          reporter_id: reporterId, 
          upvotes: 0, 
          downvotes: 0, 
          status: 'pending' 
        }
      ])
      .select();

    if (error) throw error;
    res.status(201).json({ success: true, report: data[0] });
  } catch (error) {
    console.error('Submit error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get all reports with pagination and filtering
app.get('/api/reports', async (req, res) => {
  try {
    const { page = 1, limit = 20, status, type } = req.query;
    const from = (page - 1) * limit;
    const to = from + parseInt(limit) - 1;

    let query = supabase
      .from('reports')
      .select('*, users!reporter_id(username)', { count: 'exact' });

    if (status) query = query.eq('status', status);
    if (type) query = query.eq('type', type);

    const { data, error, count } = await query
      .range(from, to)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({ 
      success: true, 
      reports: data, 
      total: count, 
      page: parseInt(page), 
      limit: parseInt(limit),
      pages: Math.ceil(count / limit)
    });
  } catch (error) {
    console.error('Fetch reports error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Vote on a report
app.post('/api/vote', async (req, res) => {
  try {
    const { reportId, userId, voteType } = req.body;

    // Validate input
    if (!reportId || !userId || !voteType) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    if (!['up', 'down'].includes(voteType)) {
      return res.status(400).json({ success: false, error: 'Invalid vote type' });
    }

    // Check if user already voted
    const { data: existing } = await supabase
      .from('votes')
      .select('*')
      .eq('report_id', reportId)
      .eq('user_id', userId)
      .single();

    if (existing) {
      return res.status(400).json({ success: false, error: 'Already voted on this report' });
    }

    // Record vote
    await supabase
      .from('votes')
      .insert([{ report_id: reportId, user_id: userId, vote_type: voteType }]);

    // Update report vote count
    const field = voteType === 'up' ? 'upvotes' : 'downvotes';
    const { data: report } = await supabase
      .from('reports')
      .select(`${field}, reporter_id`)
      .eq('id', reportId)
      .single();

    await supabase
      .from('reports')
      .update({ [field]: report[field] + 1 })
      .eq('id', reportId);

    // Update reporter reputation (+5 for upvote, -3 for downvote)
    const repChange = voteType === 'up' ? 5 : -3;
    await supabase.rpc('increment_reputation', { 
      user_id: report.reporter_id, 
      amount: repChange 
    });

    res.json({ success: true, message: 'Vote recorded successfully' });
  } catch (error) {
    console.error('Vote error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Flag report as disputed
app.post('/api/flag', async (req, res) => {
  try {
    const { reportId, reason, userId } = req.body;

    if (!reportId || !reason || !userId) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    await supabase
      .from('reports')
      .update({ 
        status: 'disputed', 
        flag_reason: reason 
      })
      .eq('id', reportId);

    res.json({ success: true, message: 'Report flagged successfully' });
  } catch (error) {
    console.error('Flag error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get dashboard statistics
app.get('/api/stats', async (req, res) => {
  try {
    // Get all reports
    const { data: reports, error: reportsError } = await supabase
      .from('reports')
      .select('status');

    if (reportsError) throw reportsError;

    // Get top reporters
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('username, reputation')
      .order('reputation', { ascending: false })
      .limit(10);

    if (usersError) throw usersError;

    // Calculate stats
    const stats = {
      totalReports: reports.length,
      verified: reports.filter(r => r.status === 'verified').length,
      pending: reports.filter(r => r.status === 'pending').length,
      disputed: reports.filter(r => r.status === 'disputed').length,
      topReporters: users
    };

    res.json({ success: true, stats });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🛡️  PhishBlock API running on port ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/api/health`);
});
