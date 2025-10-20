import { useState } from 'react';

export default function ReportForm({ onSubmit }) {
  const [type, setType] = useState('url');
  const [content, setContent] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch('${API_BASE}/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          type, 
          content, 
          notes: notes || null,
          reporterId: 1 // Mock user ID - replace with auth
        })
      });

      const data = await response.json();
      if (data.success) {
        alert('✅ Report submitted successfully!');
        setContent('');
        setNotes('');
        onSubmit();
      } else {
        alert('❌ Error: ' + data.error);
      }
    } catch (error) {
      alert('❌ Network error: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-gray-800 rounded-lg p-8 shadow-xl border border-gray-700">
        <h2 className="text-3xl font-bold mb-2">Submit Threat Report</h2>
        <p className="text-gray-400 mb-6">Help protect the community by reporting phishing sites and scam wallets</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Report Type */}
          <div>
            <label className="block mb-3 font-medium text-lg">Report Type</label>
            <div className="grid grid-cols-2 gap-4">
              <button 
                type="button" 
                onClick={() => setType('url')}
                className={`px-6 py-4 rounded-lg transition border-2 ${
                  type === 'url' 
                    ? 'bg-blue-600 border-blue-500 text-white' 
                    : 'bg-gray-700 border-gray-600 text-gray-300 hover:border-gray-500'
                }`}
              >
                <div className="text-2xl mb-1">🔗</div>
                <div className="font-medium">Phishing URL</div>
              </button>
              <button 
                type="button" 
                onClick={() => setType('wallet')}
                className={`px-6 py-4 rounded-lg transition border-2 ${
                  type === 'wallet' 
                    ? 'bg-blue-600 border-blue-500 text-white' 
                    : 'bg-gray-700 border-gray-600 text-gray-300 hover:border-gray-500'
                }`}
              >
                <div className="text-2xl mb-1">💰</div>
                <div className="font-medium">Scam Wallet</div>
              </button>
            </div>
          </div>

          {/* Content Input */}
          <div>
            <label className="block mb-2 font-medium">
              {type === 'url' ? '🔗 Phishing URL' : '💰 Wallet Address'}
            </label>
            <input
              type="text"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none transition"
              placeholder={type === 'url' ? 'hxxps://phishing-site.com' : '0x1234...abcd'}
              required
            />
            <p className="text-sm text-gray-400 mt-2">
              {type === 'url' 
                ? 'Tip: Replace http with hxxp to defang the URL' 
                : 'Provide the full wallet address'}
            </p>
          </div>

          {/* Notes */}
          <div>
            <label className="block mb-2 font-medium">📝 Additional Notes (Optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none transition h-32 resize-none"
              placeholder="Describe how you encountered this threat, any red flags, evidence of scam activity, etc."
            />
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={submitting}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-600 py-4 rounded-lg font-bold text-lg transition shadow-lg"
          >
            {submitting ? '⏳ Submitting...' : '🚀 Submit Report'}
          </button>
        </form>
      </div>
    </div>
  );
}
