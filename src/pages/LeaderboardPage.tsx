import { useState, useEffect } from 'react';
import { gameService } from '../services/GameServices';
import Navbar from '../components/Navbar';
import {
  Trophy,
  Medal,
  Crown,
  TrendingUp,
  Users,
  Target,
  Zap,
  Loader2,
  Award,
  Flame
} from 'lucide-react';

interface LeaderboardEntry {
  userId: string;
  username: string;
  totalGames: number;
  totalWins: number;
  totalScore: number;
  winRate: number;
  avgAccuracy: number;
  avgTimeToAnswer: number;
}

const LeaderboardPage = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'week' | 'month'>('all');

  useEffect(() => {
    fetchLeaderboard();
  }, [filter]);

  const fetchLeaderboard = async () => {
    try {
      setIsLoading(true);
      const data = await gameService.getLeaderboard(100);
      setLeaderboard(data.leaderboard);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const medals = ['🥇', '🥈', '🥉'];

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'from-yellow-400 to-orange-500';
    if (rank === 2) return 'from-gray-300 to-gray-400';
    if (rank === 3) return 'from-amber-600 to-amber-700';
    return 'from-blue-400 to-purple-500';
  };

  const getRankBadge = (rank: number) => {
    if (rank <= 3) return medals[rank - 1];
    if (rank <= 10) return <Award className="w-6 h-6 text-purple-400" />;
    if (rank <= 50) return <Medal className="w-6 h-6 text-blue-400" />;
    return <Target className="w-6 h-6 text-gray-400" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 flex items-center justify-center shadow-2xl">
                <Trophy className="w-12 h-12 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center animate-pulse">
                <Crown className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>

          <h1 className="text-5xl md:text-6xl font-black mb-4">
            <span className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
              Hall of Fame
            </span>
          </h1>
          <p className="text-xl text-white/70">
            The greatest warriors in QuizArena
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex justify-center gap-4 mb-8 animate-slide-up">
          <button
            onClick={() => setFilter('all')}
            className={`px-6 py-3 rounded-xl font-bold transition-all ${
              filter === 'all'
                ? 'bg-gradient-to-r from-primary-500 to-purple-600 text-white scale-105'
                : 'glass border border-white/20 text-white/70 hover:text-white'
            }`}
          >
            All Time
          </button>
          <button
            onClick={() => setFilter('week')}
            className={`px-6 py-3 rounded-xl font-bold transition-all ${
              filter === 'week'
                ? 'bg-gradient-to-r from-primary-500 to-purple-600 text-white scale-105'
                : 'glass border border-white/20 text-white/70 hover:text-white'
            }`}
          >
            This Week
          </button>
          <button
            onClick={() => setFilter('month')}
            className={`px-6 py-3 rounded-xl font-bold transition-all ${
              filter === 'month'
                ? 'bg-gradient-to-r from-primary-500 to-purple-600 text-white scale-105'
                : 'glass border border-white/20 text-white/70 hover:text-white'
            }`}
          >
            This Month
          </button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="glass rounded-xl p-6 border border-white/20 text-center hover:scale-105 transition-transform">
            <Users className="w-8 h-8 mx-auto mb-3 text-blue-400" />
            <div className="text-3xl font-black bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-1">
              {leaderboard.length}
            </div>
            <div className="text-sm text-white/60">Warriors</div>
          </div>

          <div className="glass rounded-xl p-6 border border-white/20 text-center hover:scale-105 transition-transform">
            <Trophy className="w-8 h-8 mx-auto mb-3 text-yellow-400" />
            <div className="text-3xl font-black bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent mb-1">
              {leaderboard.reduce((sum, p) => sum + p.totalGames, 0).toLocaleString()}
            </div>
            <div className="text-sm text-white/60">Total Games</div>
          </div>

          <div className="glass rounded-xl p-6 border border-white/20 text-center hover:scale-105 transition-transform">
            <Flame className="w-8 h-8 mx-auto mb-3 text-red-400" />
            <div className="text-3xl font-black bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent mb-1">
              {leaderboard[0]?.totalScore.toLocaleString() || 0}
            </div>
            <div className="text-sm text-white/60">Top Score</div>
          </div>

          <div className="glass rounded-xl p-6 border border-white/20 text-center hover:scale-105 transition-transform">
            <Zap className="w-8 h-8 mx-auto mb-3 text-purple-400" />
            <div className="text-3xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-1">
              {leaderboard[0]?.winRate.toFixed(0) || 0}%
            </div>
            <div className="text-sm text-white/60">Best Win Rate</div>
          </div>
        </div>

        {/* Top 3 Podium */}
        {!isLoading && leaderboard.length >= 3 && (
          <div className="flex items-end justify-center gap-4 mb-12 animate-bounce-in">
            {/* 2nd Place */}
            <div className="flex flex-col items-center">
              <div className="text-6xl mb-2">🥈</div>
              <div className="glass rounded-2xl p-6 border-2 border-gray-400/50 bg-gray-400/10 text-center w-48">
                <img
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${leaderboard[1].username}`}
                  alt={leaderboard[1].username}
                  className="w-16 h-16 rounded-full mx-auto mb-3 border-4 border-gray-400"
                />
                <div className="font-black text-white text-lg mb-1">{leaderboard[1].username}</div>
                <div className="text-2xl font-black bg-gradient-to-r from-gray-300 to-gray-400 bg-clip-text text-transparent">
                  {leaderboard[1].totalScore.toLocaleString()}
                </div>
                <div className="text-xs text-white/50">points</div>
              </div>
            </div>

            {/* 1st Place */}
            <div className="flex flex-col items-center -mt-8">
              <div className="text-8xl mb-2 animate-bounce">🥇</div>
              <div className="glass rounded-2xl p-8 border-2 border-yellow-400/50 bg-yellow-400/10 text-center w-56 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 animate-pulse" />
                <div className="relative z-10">
                  <img
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${leaderboard[0].username}`}
                    alt={leaderboard[0].username}
                    className="w-20 h-20 rounded-full mx-auto mb-3 border-4 border-yellow-400 shadow-xl"
                  />
                  <Crown className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                  <div className="font-black text-white text-xl mb-2">{leaderboard[0].username}</div>
                  <div className="text-3xl font-black bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                    {leaderboard[0].totalScore.toLocaleString()}
                  </div>
                  <div className="text-xs text-white/50">points</div>
                </div>
              </div>
            </div>

            {/* 3rd Place */}
            <div className="flex flex-col items-center">
              <div className="text-6xl mb-2">🥉</div>
              <div className="glass rounded-2xl p-6 border-2 border-amber-600/50 bg-amber-600/10 text-center w-48">
                <img
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${leaderboard[2].username}`}
                  alt={leaderboard[2].username}
                  className="w-16 h-16 rounded-full mx-auto mb-3 border-4 border-amber-600"
                />
                <div className="font-black text-white text-lg mb-1">{leaderboard[2].username}</div>
                <div className="text-2xl font-black bg-gradient-to-r from-amber-600 to-amber-700 bg-clip-text text-transparent">
                  {leaderboard[2].totalScore.toLocaleString()}
                </div>
                <div className="text-xs text-white/50">points</div>
              </div>
            </div>
          </div>
        )}

        {/* Full Leaderboard */}
        <div className="glass rounded-2xl p-8 border border-white/20 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
            <TrendingUp className="w-6 h-6 text-green-400" />
            Complete Rankings
          </h2>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-12 h-12 animate-spin text-primary-500" />
            </div>
          ) : leaderboard.length === 0 ? (
            <div className="text-center py-12 text-white/50">
              <Trophy className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p>No data yet. Be the first champion!</p>
            </div>
          ) : (
            <div className="space-y-2">
              {/* Table Header */}
              <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-3 text-sm text-white/50 font-semibold border-b border-white/10">
                <div className="col-span-1">Rank</div>
                <div className="col-span-3">Player</div>
                <div className="col-span-2 text-center">Games</div>
                <div className="col-span-2 text-center">Wins</div>
                <div className="col-span-2 text-center">Win Rate</div>
                <div className="col-span-2 text-right">Total Points</div>
              </div>

              {/* Leaderboard Entries */}
              {leaderboard.map((entry, index) => (
                <div
                  key={entry.userId}
                  className={`grid grid-cols-12 gap-4 items-center p-4 rounded-xl transition-all hover:scale-[1.02] ${
                    index < 3
                      ? 'bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30'
                      : index < 10
                      ? 'bg-purple-500/5 border border-purple-500/20'
                      : 'bg-slate-800/30 border border-white/10'
                  }`}
                >
                  {/* Rank */}
                  <div className="col-span-1 text-center">
                    <div className="text-2xl font-black">
                      {typeof getRankBadge(index + 1) === 'string' 
                        ? getRankBadge(index + 1)
                        : <div className="flex justify-center">{getRankBadge(index + 1)}</div>
                      }
                    </div>
                  </div>

                  {/* Player */}
                  <div className="col-span-3 flex items-center gap-3">
                    <img
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${entry.username}`}
                      alt={entry.username}
                      className="w-12 h-12 rounded-full border-2 border-primary-500"
                    />
                    <div>
                      <div className="font-bold text-white">{entry.username}</div>
                      <div className="text-xs text-white/50">
                        {entry.avgAccuracy.toFixed(1)}% accuracy
                      </div>
                    </div>
                  </div>

                  {/* Games */}
                  <div className="col-span-2 text-center">
                    <div className="font-bold text-white">{entry.totalGames}</div>
                    <div className="text-xs text-white/50">games</div>
                  </div>

                  {/* Wins */}
                  <div className="col-span-2 text-center">
                    <div className="font-bold text-green-400">{entry.totalWins}</div>
                    <div className="text-xs text-white/50">wins</div>
                  </div>

                  {/* Win Rate */}
                  <div className="col-span-2 text-center">
                    <div className={`font-bold ${
                      entry.winRate >= 75 ? 'text-green-400' :
                      entry.winRate >= 50 ? 'text-yellow-400' : 'text-white'
                    }`}>
                      {entry.winRate.toFixed(1)}%
                    </div>
                    <div className="text-xs text-white/50">rate</div>
                  </div>

                  {/* Total Points */}
                  <div className="col-span-2 text-right">
                    <div className={`text-xl font-black bg-gradient-to-r ${getRankColor(index + 1)} bg-clip-text text-transparent`}>
                      {entry.totalScore.toLocaleString()}
                    </div>
                    <div className="text-xs text-white/50">points</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;