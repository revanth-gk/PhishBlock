import { useState } from 'react';

export default function ReportList({ reports, onVote }) {
  const [filter, setFilter] = useState('all');
  const [voting, setVoting] = useState(null);

  const handleVote = async (reportId, voteType) => {
    setVoting(reportId);

    try {
      const response = await fetch('http://localhost:3001/api/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          reportId, 
          userId: 1, // Mock user ID - replace with auth
          voteType 
        })
      });

      const data = await response.json();
      if (data.success) {
        onVote();
      } else {
        alert('⚠️ ' + data.error);
      }
    } catch (error) {
      alert('❌ Network error: ' + error.message);
    } finally {
      setVoting(null);
    }
  };

  const filteredReports = filter === 'all' 
    ? reports 
    : reports.filter(r => r.status === filter);

  const getStatusBadge = (status) => {
    const styles = {
      verified: 'bg-green-900 text-green-200 border-green-700',
      pending: 'bg-yellow-900 text-yellow-200 border-yellow-700',
      disputed: 'bg-red-900 text-red-200 border-red-700'
    };

    const icons = {
      verified: '✅',
      pending: '⏳',
      disputed: '⚠️'
    };

    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${styles[status]}`}>
        {icons[status]} {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <div>
          <h2 className="text-3xl font-bold">Community Reports</h2>
          <p className="text-gray-400 mt-1">{filteredReports.length} reports found</p>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2 flex-wrap">
          {['all', 'verified', 'pending', 'disputed'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg capitalize font-medium transition ${
                filter === status 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Reports List */}
      <div className="space-y-4">
        {filteredReports.length === 0 ? (
          <div className="bg-gray-800 rounded-lg p-12 text-center border border-gray-700">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-xl text-gray-400">No reports found</p>
          </div>
        ) : (
          filteredReports.map(report => (
            <div 
              key={report.id} 
              className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition shadow-lg"
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-4 flex-wrap gap-3">
                <div className="flex gap-3 flex-wrap">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${
                    report.type === 'url' 
                      ? 'bg-red-900 text-red-200 border-red-700' 
                      : 'bg-yellow-900 text-yellow-200 border-yellow-700'
                  }`}>
                    {report.type === 'url' ? '🔗 Phishing URL' : '💰 Scam Wallet'}
                  </span>
                  {getStatusBadge(report.status)}
                </div>
                <span className="text-sm text-gray-400">
                  👤 by <span className="text-blue-400 font-medium">{report.reporter_username || 'Anonymous'}</span>
                </span>
              </div>

              {/* Content */}
              <div className="mb-4">
                <code className="text-blue-300 bg-gray-900 px-4 py-2 rounded block overflow-x-auto text-sm border border-gray-700">
                  {report.content}
                </code>
              </div>

              {/* Notes */}
              {report.notes && (
                <div className="mb-4 p-3 bg-gray-700 rounded border-l-4 border-blue-500">
                  <p className="text-gray-300 text-sm">{report.notes}</p>
                </div>
              )}

              {/* Voting */}
              <div className="flex items-center gap-4 flex-wrap">
                <button
                  onClick={() => handleVote(report.id, 'up')}
                  disabled={voting === report.id}
                  className="flex items-center gap-2 px-4 py-2 bg-green-900 hover:bg-green-800 disabled:bg-gray-700 rounded-lg transition font-medium"
                >
                  👍 <span className="font-bold">{report.upvotes}</span>
                </button>
                <button
                  onClick={() => handleVote(report.id, 'down')}
                  disabled={voting === report.id}
                  className="flex items-center gap-2 px-4 py-2 bg-red-900 hover:bg-red-800 disabled:bg-gray-700 rounded-lg transition font-medium"
                >
                  👎 <span className="font-bold">{report.downvotes}</span>
                </button>

                <div className="ml-auto flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-sm text-gray-400">Confidence Score</div>
                    <div className={`text-xl font-bold ${
                      (report.upvotes - report.downvotes) > 10 ? 'text-green-400' : 
                      (report.upvotes - report.downvotes) > 0 ? 'text-yellow-400' : 
                      'text-red-400'
                    }`}>
                      +{report.upvotes - report.downvotes}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
