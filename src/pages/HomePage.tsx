import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/AuthStores';
import { authService } from '../services/AuthServices';
import { roomService } from '../services/RoomServices';
import { gameService } from '../services/GameServices';
import { AchievmentService } from '../services/AchievementService';
import Navbar from '../components/Navbar';

import {
  Zap,
  Trophy,
  Target,
  TrendingUp,
  Users,
  Clock,
  Sparkles,
  ArrowRight,
  Play,
  Hash,
  Loader2,
  Medal,
  Star,
  Crown,
  Shield,
} from 'lucide-react';


interface PublicRoom {
  _id: string;
  roomCode: string;
  hostId: string;
  players: any[];
  settings: any;
  status: string;
}

interface RecentGame {
  _id: string;
  winner: string;
  players: any[];
  finishedAt: string;
  settings: any;
}

interface Achievement {
  _id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: string;
}

const HomePage = () => {
  const navigate = useNavigate();
  const { user,  } = useAuthStore();
  const [roomCode, setRoomCode] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const [publicRooms, setPublicRooms] = useState<PublicRoom[]>([]);
  const [recentGames, setRecentGames] = useState<RecentGame[]>([]);
  const [recentAchievements, setRecentAchievements] = useState<Achievement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
fetchAchievements();

  }, []);

  const fetchAchievements = async () => {
    try {
      const achievements = await AchievmentService.getUserAchievements();
      console.log(achievements); // should log an array of achievements
      setRecentAchievements(achievements);
    } catch (error) {
      console.error('Error fetching achievements:', error);
    }
  };

  const fetchData = async () => {
    try {
      setIsLoading(true);

      // Fetch stats first
    const statsData = await authService.getStats();
    console.log(statsData);
          
      // Fetch public rooms
      const roomsData = await roomService.getPublicRooms({ status: 'waiting' });
      setPublicRooms(roomsData.rooms.slice(0, 5));

      // Fetch recent games
      const gamesData = await gameService.getGameHistory(5);
      setRecentGames(gamesData.games);
      
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickPlay = () => {
    navigate('/lobby');
  };

  const handleJoinRoom = async () => {
    if (!roomCode.trim()) return;

    try {
      setIsJoining(true);
      await roomService.joinRoom(roomCode.toUpperCase());
      navigate(`/room/${roomCode.toUpperCase()}`);
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to join room');
    } finally {
      setIsJoining(false);
    }
  };

  const getResultColor = (game: RecentGame) => {
    const isWinner = game.winner === user?.id;
    return isWinner ? 'text-green-400' : 'text-red-400';
  };
  const handleJoinPublicRoom = async (roomCode:string)=>{
    try{
        await roomService.joinRoom(roomCode);
        navigate(`/room/${roomCode}`);
    }catch(err:any){
      alert(`Error joining room ${err.message}`)
    }
  }

  const getResultText = (game: RecentGame) => {
    const isWinner = game.winner === user?.id;
    return isWinner ? 'Victory' : 'Defeat';
  };

  const difficultyColors = {
    easy: 'text-green-400 bg-green-500/20 border-green-500/30',
    medium: 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30',
    hard: 'text-red-400 bg-red-500/20 border-red-500/30',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Hero Section */}
        <div className="mb-12 animate-fade-in">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-black mb-3">
              <span className="text-white">Welcome back, </span>
              <span className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
                {user?.username}
              </span>
              <span className="text-white">! 🔥</span>
            </h1>
            <p className="text-white/70 text-lg">
              Ready to dominate the arena?
            </p>
          </div>
{/* Quick Actions */}
<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-4xl mx-auto px-4 sm:px-0">
  {/* Quick Play Button */}
  <button
    onClick={handleQuickPlay}
    className="group relative p-6 sm:p-8 glass rounded-2xl border border-white/20 hover:border-primary-500/50 transition-all duration-300 hover:scale-105 overflow-hidden"
  >
    <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
    <div className="relative z-10 flex flex-col items-center text-center">
      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform shadow-2xl">
        <Zap className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
      </div>
      <h3 className="text-xl sm:text-2xl font-black text-white mb-1 sm:mb-2">Quick Play</h3>
      <p className="text-white/60 text-sm mb-3 sm:mb-4">Jump into a random battle</p>
      <div className="flex items-center gap-2 text-primary-400 font-semibold">
        <span>Let's Go</span>
        <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-2 transition-transform" />
      </div>
    </div>
  </button>

  {/* Join with Code */}
  <div className="p-6 sm:p-8 glass rounded-2xl border border-white/20 flex flex-col items-center text-center">
    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center mb-3 sm:mb-4 shadow-2xl">
      <Hash className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
    </div>
    <h3 className="text-xl sm:text-2xl font-black text-white mb-1 sm:mb-2">Join with Code</h3>
    <p className="text-white/60 text-sm mb-3 sm:mb-4">Enter a room code</p>
    
    <div className="w-full flex flex-col sm:flex-row gap-2">
      <input
        type="text"
        placeholder="ROOM CODE"
        value={roomCode}
        onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
        maxLength={6}
        className="flex-1 px-4 py-3 bg-slate-800/50 border border-white/20 rounded-lg text-white text-center text-lg font-bold uppercase placeholder-white/30 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
      />
      <button
        onClick={handleJoinRoom}
        disabled={!roomCode.trim() || isJoining}
        className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-600 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-orange-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {isJoining ? <Loader2 className="w-6 h-6 animate-spin" /> : <Play className="w-6 h-6" />}
      </button>
    </div>
  </div>
</div>

          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="glass rounded-xl p-6 border border-white/20 hover:border-blue-500/50 transition-all hover:scale-105">
            <div className="flex items-center justify-between mb-3">
              <Target className="w-8 h-8 text-blue-400" />
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>
            <div className="text-3xl font-black bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              {user?.stats.gamesPlayed }
            </div>
            <div className="text-sm text-white/60 font-semibold">Games Played</div>
          </div>

          <div className="glass rounded-xl p-6 border border-white/20 hover:border-yellow-500/50 transition-all hover:scale-105">
            <div className="flex items-center justify-between mb-3">
              <Trophy className="w-8 h-8 text-yellow-400" />
              <Crown className="w-5 h-5 text-orange-400" />
            </div>
            <div className="text-3xl font-black bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              {user?.stats.wins }
            </div>
            <div className="text-sm text-white/60 font-semibold">Victories</div>
          </div>

          <div className="glass rounded-xl p-6 border border-white/20 hover:border-purple-500/50 transition-all hover:scale-105">
            <div className="flex items-center justify-between mb-3">
              <Star className="w-8 h-8 text-purple-400" />
              <Sparkles className="w-5 h-5 text-pink-400" />
            </div>
            <div className="text-3xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              {user?.stats.winRate?.toFixed(1)}%
            </div>
            <div className="text-sm text-white/60 font-semibold">Win Rate</div>
          </div>

          <div className="glass rounded-xl p-6 border border-white/20 hover:border-green-500/50 transition-all hover:scale-105">
            <div className="flex items-center justify-between mb-3">
              <Medal className="w-8 h-8 text-green-400" />
              <Shield className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="text-3xl font-black bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              {user?.stats.totalPoints?.toLocaleString()}
            </div>
            <div className="text-sm text-white/60 font-semibold">Total Points</div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          
          {/* Left Column - 2/3 width */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Recent Games */}
            <div className="glass rounded-2xl p-6 border border-white/20 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black text-white flex items-center gap-2">
                  <Clock className="w-6 h-6 text-blue-400" />
                  Recent Battles
                </h2>
                <button className="text-primary-400 hover:text-primary-300 text-sm font-semibold">
                  View All →
                </button>
              </div>

              {isLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
                </div>
              ) : recentGames.length === 0 ? (
                <div className="text-center py-12 text-white/50">
                  <Trophy className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>No battles yet. Start your journey!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentGames.map((game) => {
                    const myStats = game.players.find((p: any) => p.userId === user?.id);
                    return (
                      <div
                        key={game._id}
                        className="p-4 bg-slate-800/50 rounded-xl border border-white/10 hover:border-white/20 transition-all cursor-pointer"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <span className={`font-bold ${getResultColor(game)}`}>
                                {getResultText(game)}
                              </span>
                              <span className={`badge ${difficultyColors[game.settings.difficulty as keyof typeof difficultyColors]}`}>
                                {game.settings.difficulty}
                              </span>
                              <span className="text-white/50 text-sm">
                                {new Date(game.finishedAt).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="flex items-center gap-4 text-sm">
                              <span className="text-white/70">
                                <Users className="w-4 h-4 inline mr-1" />
                                {game.players.length} players
                              </span>
                              <span className="text-white/70">
                                <Target className="w-4 h-4 inline mr-1" />
                                {game.settings.numberOfQuestions} questions
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-black bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                              {myStats?.finalScore || 0}
                            </div>
                            <div className="text-sm text-white/50">points</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Public Rooms */}
            <div className="glass rounded-2xl p-6 border border-white/20 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black text-white flex items-center gap-2">
                  <Users className="w-6 h-6 text-purple-400" />
                  Open Arenas
                </h2>
                <button
                  onClick={fetchData}
                  className="text-purple-400 hover:text-purple-300 text-sm font-semibold"
                >
                  Refresh
                </button>
              </div>

              {isLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
                </div>
              ) : publicRooms.length === 0 ? (
                <div className="text-center py-12 text-white/50">
                  <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>No open rooms. Create one!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {publicRooms.map((room) => (
                    <div
                      key={room._id}
                      className="p-4 bg-slate-800/50 rounded-xl border border-white/10 hover:border-purple-500/50 transition-all group cursor-pointer"
                      onClick={() => handleJoinPublicRoom(room.roomCode)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="font-mono font-bold text-white text-lg">
                              {room.roomCode}
                            </span>
                            <span className={`badge ${difficultyColors[room.settings.difficulty as keyof typeof difficultyColors]}`}>
                              {room.settings.difficulty}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-white/70">
                            <span>
                              <Users className="w-4 h-4 inline mr-1" />
                              {room.players.length}/10
                            </span>
                            <span>
                              <Target className="w-4 h-4 inline mr-1" />
                              {room.settings.numberOfQuestions} questions
                            </span>
                          </div>
                        </div>
                        <button className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg transition-all group-hover:scale-105">
                          Join
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - 1/3 width */}
          <div className="space-y-6">
            
            {/* Recent Achievements */}
            <div className="glass rounded-2xl p-6 border border-white/20 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-black text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-yellow-400" />
                  Achievements
                </h2>
                <button className="text-yellow-400 hover:text-yellow-300 text-sm font-semibold">
                  View All →
                </button>
              </div>

              {recentAchievements.length === 0 ? (
                <div className="text-center py-8 text-white/50">
                  <Trophy className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">Play games to unlock achievements!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentAchievements.map((achievement) => (
                    <div
                      key={achievement._id}
                      className="p-4 bg-slate-800/50 rounded-xl border border-white/10 hover:scale-105 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-3xl">{achievement.icon}</div>
                        <div className="flex-1">
                          <div className="font-bold text-white text-sm">
                            {achievement.title}
                          </div>
                          <div className="text-xs text-white/50">
                            {achievement.description}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            Activity Feed
            <div className="glass rounded-2xl p-6 border border-white/20 animate-fade-in" style={{ animationDelay: '0.5s' }}>
              <h2 className="text-xl font-black text-white mb-6 flex items-center gap-2">
                <Zap className="w-5 h-5 text-green-400" />
                Live Feed
              </h2>
              
              <div className="space-y-3 text-sm">
                <div className="p-3 bg-slate-800/50 rounded-lg">
                  <p className="text-white/70">
                    <span className="font-semibold text-blue-400">Player123</span> won a battle with 850 points
                  </p>
                  <span className="text-xs text-white/40">2 minutes ago</span>
                </div>
                
                <div className="p-3 bg-slate-800/50 rounded-lg">
                  <p className="text-white/70">
                    <span className="font-semibold text-purple-400">QuizMaster</span> unlocked the Champion badge 🏆
                  </p>
                  <span className="text-xs text-white/40">5 minutes ago</span>
                </div>
                
                <div className="p-3 bg-slate-800/50 rounded-lg">
                <p className="text-white/70">
                <span className="font-semibold text-yellow-400">BrainWarrior</span> achieved a perfect score! 💯
                  </p>
                  <span className="text-xs text-white/40">8 minutes ago</span>
                  </div>
                </div>

                <div className="text-center pt-3">
                  <button className="text-green-400 hover:text-green-300 text-xs font-semibold">
                    Load More →
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Stats Card */}
            <div className="glass rounded-2xl p-6 border border-white/20 animate-fade-in" style={{ animationDelay: '0.6s' }}>
              <h2 className="text-xl font-black text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-orange-400" />
                Your Rank
              </h2>
              
              <div className="text-center py-6">
                <div className="text-5xl font-black bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent mb-2">
                  #42
                </div>
                <div className="text-white/60 text-sm mb-4">Global Ranking</div>
                
                <div className="flex items-center justify-center gap-2 text-green-400 text-sm font-semibold">
                  <TrendingUp className="w-4 h-4" />
                  <span>+12 this week</span>
                </div>
              </div>

              <div className="space-y-2 pt-4 border-t border-white/10">
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Top 1%</span>
                  <span className="text-white font-semibold">985 players</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Next Rank</span>
                  <span className="text-white font-semibold">Top 0.5%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
  );
};
export default HomePage;