import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/AuthStores';
import { authService } from '../services/AuthServices';
import { gameService } from '../services/GameServices';
import Navbar from '../components/Navbar';
import {
  Trophy,
  Target,
  Clock,
  TrendingUp,
  Medal,
  Star,
  Crown,
  Shield,
  Flame,
  Award,
  Calendar,
  Activity,
  Loader2,
  Edit,
  Check,
  X,
  Camera,
  Settings as SettingsIcon,
  LogOut,
  Upload
} from 'lucide-react';

interface UserProfile {
  user: {
    id: string;
    username: string;
    avatar: string;
    createdAt: string;
  };
  stats: {
    gamesPlayed: number;
    wins: number;
    losses: number;
    totalPoints: number;
    winRate: number;
    avgPointsPerGame: number;
    highestScore: number;
    longestStreak: number;
    perfectGames: number;
    rank: string;
  } ;
  recentGames: any[];
  achievements: {
    recent: any[];
    total: number;
  };
}

const ProfilePage = () => {
  const { userId } = useParams<{ userId?: string }>();
  const navigate = useNavigate();
  const { user: currentUser, logout } = useAuthStore();
  
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUsername, setEditedUsername] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isOwnProfile = !userId || userId === currentUser?.id;
  const profileUserId = userId || currentUser?.id;

  // Avatar styles
  const avatarStyles = [
    { id: 'avataaars', name: 'Avataaars', emoji: '😊' },
    { id: 'bottts', name: 'Robots', emoji: '🤖' },
    { id: 'adventurer', name: 'Adventurer', emoji: '🧑‍🚀' },
    { id: 'lorelei', name: 'Lorelei', emoji: '👩' },
    { id: 'micah', name: 'Micah', emoji: '🧔' },
    { id: 'personas', name: 'Personas', emoji: '👤' },
    { id: 'fun-emoji', name: 'Fun Emoji', emoji: '🎭' },
    { id: 'pixel-art', name: 'Pixel Art', emoji: '👾' },
  ];

  useEffect(() => {
  if (profileUserId && currentUser) {
    fetchProfile(profileUserId);
  }
}, [profileUserId, currentUser]);

  const fetchProfile = async (id: string) => {
    try {
      setIsLoading(true);
      
      if (isOwnProfile) {
        const [statsData, gamesData] = await Promise.all([
          authService.getStats(),
          gameService.getGameHistory(10)
        ]);
        console.log(statsData);
        console.log(gamesData);

        setProfile({
          user: {
            id: id,
            username: currentUser!.username,
            avatar: currentUser!.avatar,
            createdAt: currentUser!.createdAt || new Date().toISOString()
          },
          stats: {
            ...currentUser!.stats,
            losses: currentUser!.stats.gamesPlayed - currentUser!.stats.wins,
            avgPointsPerGame: currentUser!.stats.gamesPlayed > 0 
              ? currentUser!.stats.totalPoints / currentUser!.stats.gamesPlayed 
              : 0,
            highestScore: (currentUser as any).stats.highestScore || 0,
            longestStreak: (currentUser as any).stats.longestStreak || 0,
            perfectGames: (currentUser as any).stats.perfectGames || 0,
            rank: getRank(currentUser!.stats.totalPoints)
          },
          recentGames: gamesData.games,
          achievements: {
            recent: [],
            total: 0
          }
        });
        setEditedUsername(currentUser!.username);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getRank = (points: number): string => {
    if (points >= 50000) return 'Master';
    if (points >= 20000) return 'Expert';
    if (points >= 5000) return 'Intermediate';
    return 'Beginner';
  };

  const getRankColor = (rank: string) => {
    const colors = {
      'Master': 'from-purple-500 to-pink-500',
      'Expert': 'from-red-500 to-orange-500',
      'Intermediate': 'from-blue-500 to-cyan-500',
      'Beginner': 'from-green-500 to-emerald-500'
    };
    return colors[rank as keyof typeof colors] || 'from-gray-500 to-gray-600';
  };

  const getRankIcon = (rank: string) => {
    const icons = {
      'Master': <Crown className="w-6 h-6" />,
      'Expert': <Flame className="w-6 h-6" />,
      'Intermediate': <Shield className="w-6 h-6" />,
      'Beginner': <Star className="w-6 h-6" />
    };
    return icons[rank as keyof typeof icons] || <Star className="w-6 h-6" />;
  };

  const handleSaveUsername = async () => {
    if (!editedUsername.trim() || editedUsername === profile?.user.username) {
      setIsEditing(false);
      return;
    }

    try {
      setIsSaving(true);
      await authService.updateProfile({ username: editedUsername });
      
      if (profileUserId) {
        await fetchProfile(profileUserId);
      }
      
      setIsEditing(false);
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to update username');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarChange = async (style: string) => {
    try {
      const newAvatar = `https://api.dicebear.com/7.x/${style}/svg?seed=${profile?.user.username}`;
      await authService.updateProfile({ avatar: newAvatar });
      
      
      if (profileUserId) {
        await fetchProfile(profileUserId);
      }
      
      setShowAvatarPicker(false);
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to update avatar');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    try {
      setUploadingAvatar(true);
      
      await authService.uploadAvatar(file);
      
      // Refresh profile
      if (profileUserId) {
        await fetchProfile(profileUserId);
      }
      
      setShowAvatarPicker(false);
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to upload avatar');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <Navbar />
        <div className="flex items-center justify-center h-[80vh]">
          <div className="text-center">
            <Loader2 className="w-16 h-16 animate-spin text-primary-500 mx-auto mb-4" />
            <p className="text-white/70 text-lg">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <Navbar />
        <div className="flex items-center justify-center h-[80vh]">
          <div className="text-center">
            <p className="text-white/70 text-lg">Profile not found</p>
          </div>
        </div>
      </div>
    );
  }

  const difficultyColors = {
    easy: 'text-green-400 bg-green-500/20 border-green-500/30',
    medium: 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30',
    hard: 'text-red-400 bg-red-500/20 border-red-500/30',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Profile Header */}
        <div className="glass rounded-3xl p-8 md:p-12 border border-white/20 mb-8 animate-fade-in">
          <div className="flex flex-col md:flex-row items-center gap-8">
            
            {/* Avatar */}
            <div className="relative group">
              <img
                src={profile.user.avatar}
                alt={profile.user.username}
                className="w-32 h-32 rounded-full border-4 border-primary-500 shadow-2xl"
              />
              {isOwnProfile && (
                <>
                  <button
                    onClick={() => setShowAvatarPicker(true)}
                    className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-primary-600 hover:bg-primary-700 flex items-center justify-center border-4 border-slate-900 transition-all opacity-0 group-hover:opacity-100 hover:scale-110"
                  >
                    <Camera className="w-5 h-5 text-white" />
                  </button>

                  {/* Avatar Picker Modal */}
                  {showAvatarPicker && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
                      <div className="glass rounded-3xl p-8 border border-white/20 max-w-2xl w-full max-h-[80vh] overflow-y-auto animate-slide-up">
                        <div className="flex items-center justify-between mb-6">
                          <h3 className="text-2xl font-black text-white">Choose Your Avatar</h3>
                          <button
                            onClick={() => setShowAvatarPicker(false)}
                            className="p-2 hover:bg-white/10 rounded-lg transition-all"
                          >
                            <X className="w-6 h-6 text-white" />
                          </button>
                        </div>

                        {/* Upload Custom Avatar */}
                        <div className="mb-6">
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFileUpload}
                            className="hidden"
                          />
                          <button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploadingAvatar}
                            className="w-full p-4 bg-primary-600 hover:bg-primary-700 rounded-xl text-white font-semibold flex items-center justify-center gap-3 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {uploadingAvatar ? (
                              <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Uploading...
                              </>
                            ) : (
                              <>
                                <Upload className="w-5 h-5" />
                                Upload Custom Image
                              </>
                            )}
                          </button>
                          <p className="text-xs text-white/50 text-center mt-2">
                            Max 5MB • JPG, PNG, GIF
                          </p>
                        </div>

                        <div className="relative mb-6">
                          <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/10"></div>
                          </div>
                          <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-slate-800 text-white/60">Or choose a style</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                          {avatarStyles.map((style) => (
                            <button
                              key={style.id}
                              onClick={() => handleAvatarChange(style.id)}
                              className="flex flex-col items-center gap-3 p-4 rounded-xl border-2 border-white/10 hover:border-primary-500 bg-slate-800/50 hover:bg-slate-800 transition-all hover:scale-105 group"
                            >
                              <img
                                src={`https://api.dicebear.com/7.x/${style.id}/svg?seed=${profile.user.username}`}
                                alt={style.name}
                                className="w-20 h-20 rounded-full border-2 border-primary-500"
                              />
                              <div className="text-center">
                                <div className="text-2xl mb-1">{style.emoji}</div>
                                <div className="text-sm font-semibold text-white">{style.name}</div>
                              </div>
                            </button>
                          ))}
                        </div>

                        <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                          <p className="text-sm text-blue-300 flex items-center gap-2">
                            <Camera className="w-4 h-4" />
                            Select an avatar style that matches your personality!
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
              
              {/* Rank Badge */}
              <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r ${getRankColor(profile.stats.rank)} flex items-center gap-2 shadow-lg`}>
                {getRankIcon(profile.stats.rank)}
                <span className="text-white font-bold text-sm">{profile.stats.rank}</span>
              </div>
            </div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              {isEditing ? (
                <div className="flex items-center gap-2 justify-center md:justify-start mb-2">
                  <input
                    type="text"
                    value={editedUsername}
                    onChange={(e) => setEditedUsername(e.target.value)}
                    className="input w-64 text-2xl font-black"
                    autoFocus
                  />
                  <button
                    onClick={handleSaveUsername}
                    disabled={isSaving}
                    className="p-2 bg-green-600 hover:bg-green-700 rounded-lg text-white"
                  >
                    {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setEditedUsername(profile.user.username);
                    }}
                    className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3 justify-center md:justify-start mb-2">
                  <h1 className="text-4xl font-black text-white">{profile.user.username}</h1>
                  {isOwnProfile && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="p-2 hover:bg-white/10 rounded-lg transition-all"
                    >
                      <Edit className="w-5 h-5 text-white/60 hover:text-white" />
                    </button>
                  )}
                </div>
              )}
              
              <div className="flex items-center gap-4 justify-center md:justify-start text-white/60 mb-4">
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Joined {new Date(profile.user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                </span>
                <span className="flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  {profile.stats.gamesPlayed} battles
                </span>
              </div>

              {/* Quick Stats */}
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                <div className="px-4 py-2 bg-slate-800/50 rounded-lg border border-white/10">
                  <span className="text-white/60 text-sm mr-2">Total Points:</span>
                  <span className="font-black text-yellow-400 text-lg">
                    {profile.stats.totalPoints.toLocaleString()}
                  </span>
                </div>
                <div className="px-4 py-2 bg-slate-800/50 rounded-lg border border-white/10">
                  <span className="text-white/60 text-sm mr-2">Win Rate:</span>
                  <span className="font-black text-green-400 text-lg">
                    {profile.stats.winRate.toFixed(1)}%
                  </span>
                </div>
                <div className="px-4 py-2 bg-slate-800/50 rounded-lg border border-white/10">
                  <span className="text-white/60 text-sm mr-2">Highest Score:</span>
                  <span className="font-black text-purple-400 text-lg">
                    {profile.stats.highestScore}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons (Own Profile) */}
            {isOwnProfile && (
              <div className="flex flex-col gap-2">
                <Link to='/settings'>
                  <button className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-xl transition-all flex items-center gap-2">
                    <SettingsIcon className="w-5 h-5" />
                    Settings
                  </button>
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-all flex items-center gap-2"
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="glass rounded-xl p-6 border border-white/20 hover:scale-105 transition-transform">
            <div className="flex items-center justify-between mb-3">
              <Target className="w-8 h-8 text-blue-400" />
            </div>
            <div className="text-3xl font-black bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-1">
              {profile.stats.gamesPlayed}
            </div>
            <div className="text-sm text-white/60 font-semibold">Games Played</div>
          </div>

          <div className="glass rounded-xl p-6 border border-white/20 hover:scale-105 transition-transform">
            <div className="flex items-center justify-between mb-3">
              <Trophy className="w-8 h-8 text-yellow-400" />
            </div>
            <div className="text-3xl font-black bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent mb-1">
              {profile.stats.wins}
            </div>
            <div className="text-sm text-white/60 font-semibold">Victories</div>
          </div>

          <div className="glass rounded-xl p-6 border border-white/20 hover:scale-105 transition-transform">
            <div className="flex items-center justify-between mb-3">
              <Flame className="w-8 h-8 text-red-400" />
            </div>
            <div className="text-3xl font-black bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent mb-1">
              {profile.stats.longestStreak}
            </div>
            <div className="text-sm text-white/60 font-semibold">Best Streak</div>
          </div>

          <div className="glass rounded-xl p-6 border border-white/20 hover:scale-105 transition-transform">
            <div className="flex items-center justify-between mb-3">
              <Star className="w-8 h-8 text-purple-400" />
            </div>
            <div className="text-3xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-1">
              {profile.stats.perfectGames}
            </div>
            <div className="text-sm text-white/60 font-semibold">Perfect Games</div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          
          {/* Recent Games - 2/3 width */}
          <div className="lg:col-span-2 glass rounded-2xl p-8 border border-white/20 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-white flex items-center gap-2">
                <Clock className="w-6 h-6 text-blue-400" />
                Recent Battles
              </h2>
            </div>

            {profile.recentGames.length === 0 ? (
              <div className="text-center py-12 text-white/50">
                <Trophy className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>No battles yet. Start your journey!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {profile.recentGames.map((game) => {
                  const myStats = game.players.find((p: any) => p.userId === profile.user.id);
                  const isWinner = game.winner === profile.user.id;
                  
                  return (
                    <div
                      key={game._id}
                      className="p-4 bg-slate-800/50 rounded-xl border border-white/10 hover:border-white/20 transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className={`font-bold ${isWinner ? 'text-green-400' : 'text-red-400'}`}>
                              {isWinner ? 'Victory' : 'Defeat'}
                            </span>
                            <span className={`badge ${difficultyColors[game.settings?.difficulty as keyof typeof difficultyColors]}`}>
                              {game.settings?.difficulty}
                            </span>
                            <span className="text-white/50 text-sm">
                              {new Date(game.finishedAt).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-white/70">
                            <span>
                              {game.players.length} players
                            </span>
                            <span>
                              {myStats?.accuracy?.toFixed(1) || 0}% accuracy
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

          {/* Detailed Stats - 1/3 width */}
          <div className="space-y-6">
            
            {/* Performance Stats */}
            <div className="glass rounded-2xl p-6 border border-white/20 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <h3 className="text-xl font-black text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-400" />
                Performance
              </h3>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white/60 text-sm">Win Rate</span>
                    <span className="font-bold text-white">{profile.stats.winRate.toFixed(1)}%</span>
                  </div>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all"
                      style={{ width: `${profile.stats.winRate}%` }}
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-white/10">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-white/60 text-sm">Avg Points/Game</span>
                    <span className="font-bold text-white">
                      {profile.stats.avgPointsPerGame.toFixed(0)}
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/10">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-white/60 text-sm">Highest Score</span>
                    <span className="font-bold text-purple-400">
                      {profile.stats.highestScore}
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/10">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-white/60 text-sm">Perfect Games</span>
                    <span className="font-bold text-yellow-400">
                      {profile.stats.perfectGames}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Achievements Preview */}
            <div className="glass rounded-2xl p-6 border border-white/20 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-black text-white flex items-center gap-2">
                  <Award className="w-5 h-5 text-yellow-400" />
                  Achievements
                </h3>
                <button className="text-yellow-400 hover:text-yellow-300 text-sm font-semibold">
                  View All →
                </button>
              </div>

              <div className="text-center py-8 text-white/50">
                <Trophy className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm">Play games to unlock achievements!</p>
              </div>
            </div>

            {/* Battle Record */}
            <div className="glass rounded-2xl p-6 border border-white/20 animate-fade-in" style={{ animationDelay: '0.5s' }}>
              <h3 className="text-xl font-black text-white mb-4 flex items-center gap-2">
                <Medal className="w-5 h-5 text-orange-400" />
                Battle Record
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg">
                  <span className="text-white/60">Wins</span>
                  <span className="font-black text-green-400 text-xl">{profile.stats.wins}</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg">
                  <span className="text-white/60">Losses</span>
                  <span className="font-black text-red-400 text-xl">{profile.stats.losses}</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg">
                  <span className="text-white/60">W/L Ratio</span>
                  <span className="font-black text-white text-xl">
                    {profile.stats.losses > 0 
                      ? (profile.stats.wins / profile.stats.losses).toFixed(2)
                      : profile.stats.wins}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;