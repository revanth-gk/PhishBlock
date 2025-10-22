import React from 'react';

export default function Dashboard({ stats }) {
  if (!stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl text-gray-400">Loading dashboard...</div>
      </div>
    );
  }

  // Extract topReporters and remove it from stats for the general stats display
  const { topReporters, ...generalStats } = stats;

  return (
    <div>
      <h2 className="text-3xl font-bold mb-2">Dashboard</h2>
      <p className="text-gray-400 mb-8">Real-time community threat intelligence metrics</p>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {Object.entries(generalStats).map(([key, value]) => (
          <div
            key={key}
            className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-6 border border-gray-700 shadow-xl"
          >
            <div className="text-4xl mb-3">📊</div>
            <div className="text-4xl font-bold text-white mb-1">{value}</div>
            <div className="text-gray-400 font-medium">{key}</div>
          </div>
        ))}
      </div>

      {/* Top Reporters */}
      <div className="bg-gray-800 rounded-lg p-8 border border-gray-700 shadow-xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="text-3xl">🏆</div>
          <div>
            <h3 className="text-2xl font-bold">Top Contributors</h3>
            <p className="text-gray-400">Community members with highest reputation scores</p>
          </div>
        </div>

        <div className="space-y-3">
          {topReporters && topReporters.length > 0 ? (
            topReporters.map((reporter, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition"
              >
                <div className="flex items-center gap-4">
                  <span className="text-3xl">
                    {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : '👤'}
                  </span>
                  <div>
                    <div className="font-bold text-lg">{reporter.username}</div>
                    <div className="text-sm text-gray-400">Rank #{idx + 1}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-blue-400">{reporter.reputation}</span>
                    <span className="text-gray-400 text-sm">rep</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-400">
              No reporters yet. Be the first to contribute!
            </div>
          )}
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="bg-blue-900 bg-opacity-20 border border-blue-800 rounded-lg p-6">
          <h4 className="font-bold text-lg mb-2 text-blue-300">📈 How Reputation Works</h4>
          <ul className="text-sm text-gray-300 space-y-1">
            <li>• +5 points when your report gets upvoted</li>
            <li>• -3 points when your report gets downvoted</li>
            <li>• Higher reputation = more trusted reporter</li>
          </ul>
        </div>

        <div className="bg-purple-900 bg-opacity-20 border border-purple-800 rounded-lg p-6">
          <h4 className="font-bold text-lg mb-2 text-purple-300">🛡️ Community Guidelines</h4>
          <ul className="text-sm text-gray-300 space-y-1">
            <li>• Only report verified threats</li>
            <li>• Provide evidence when possible</li>
            <li>• Vote responsibly and fairly</li>
          </ul>
        </div>
      </div>
    </div>
  );
}