import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/AuthStores';
import Arena from '../assets/Arena2.mp4';

import { 
  Trophy, 
  Users, 
  Zap, 
  Star, 
  Crown, 
  Sparkles,
  Target,
  Swords,
  Shield
} from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [stats, setStats] = useState({
    players: 1247,
    games: 689,
    questions: 10000,
  });

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/home');
    }
  }, [isAuthenticated, navigate]);

  // Animated counter effect
  useEffect(() => {
    const interval = setInterval(() => {
      setStats({
        players: Math.floor(Math.random() * 500) + 1000,
        games: Math.floor(Math.random() * 200) + 500,
        questions: 10000,
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Floating badges data
  const achievements = [
    { icon: <Trophy className="w-6 h-6" />, label: 'Champion', color: 'from-yellow-400 to-orange-500' },
    { icon: <Crown className="w-6 h-6" />, label: 'Legend', color: 'from-purple-400 to-pink-500' },
    { icon: <Star className="w-6 h-6" />, label: 'Master', color: 'from-blue-400 to-cyan-500' },
    { icon: <Zap className="w-6 h-6" />, label: 'Speed', color: 'from-green-400 to-emerald-500' },
  ];

  return (
    <>
    <div className="relative min-h-screen overflow-hidden">
      
      
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          {/* Replace this src with your downloaded video */}
          <source src={Arena} type="video/mp4" />
          {/* Fallback for older browsers */}
          Your browser does not support video backgrounds.
        </video>
        
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-purple-900/70 to-slate-900/90" />
        
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/30 via-transparent to-orange-900/30 animate-pulse-slow" />
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-[1]">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 10}s`,
            }}
          />
        ))}
      </div>

      {/* Floating Achievement Badges */}
      {achievements.map((achievement, i) => (
        <div
          key={i}
          className={`floating-badge floating-badge-${i + 1} z-[2]`}
          style={{
            animationDelay: `${i * 1.5}s`,
          }}
        >
          <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${achievement.color} flex items-center justify-center shadow-2xl border-2 border-white/30 backdrop-blur-sm`}>
            {achievement.icon}
          </div>
          <span className="text-xs font-bold mt-1 text-white/80">{achievement.label}</span>
        </div>
      ))}

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-20">
        
        {/* Logo/Title */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <Swords className="w-20 h-20 text-yellow-400 animate-bounce-in drop-shadow-2xl" />
              <Shield className="w-12 h-12 text-orange-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
            </div>
          </div>
          
          <h1 className="text-7xl md:text-9xl font-black mb-6 animate-slide-up">
            <span className="block bg-gradient-to-r from-yellow-300 via-orange-400 to-red-500 bg-clip-text text-transparent drop-shadow-2xl filter brightness-125" style={{ textShadow: '0 0 40px rgba(251, 191, 36, 0.5)' }}>
              Quiz
            </span>
            <span className="block bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-2xl filter brightness-125" style={{ textShadow: '0 0 40px rgba(139, 92, 246, 0.5)' }}>
              Arena
            </span>
          </h1>
          
          <div className="space-y-2 mb-4">
            <p className="text-3xl md:text-4xl font-black text-white animate-fade-in" style={{ animationDelay: '0.2s', textShadow: '0 2px 20px rgba(0,0,0,0.8)' }}>
              ⚔️ Battle of the Brains ⚔️
            </p>
            <p className="text-xl md:text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent animate-fade-in" style={{ animationDelay: '0.3s' }}>
              Compete. Conquer. Claim Glory.
            </p>
          </div>
          
          <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed animate-fade-in px-4" style={{ animationDelay: '0.4s', textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>
            Step into the ultimate trivia battleground. Challenge players worldwide in real-time battles. 
            Answer fast, answer right, and rise to legendary status!
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 mb-20 animate-bounce-in" style={{ animationDelay: '0.6s' }}>
          <Link
            to="/register"
            className="group relative px-10 py-5 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-slate-900 font-black text-xl rounded-2xl shadow-2xl hover:shadow-yellow-500/50 transform hover:scale-110 transition-all duration-300 overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-3">
              <Target className="w-7 h-7" />
              Enter the Arena
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute inset-0 animate-pulse-slow bg-gradient-to-r from-yellow-300 to-orange-400 blur-xl opacity-50" />
          </Link>
          
          <Link
            to="/login"
            className="group px-10 py-5 bg-white/10 backdrop-blur-lg text-white font-black text-xl rounded-2xl border-3 border-white/40 hover:bg-white/20 hover:border-white/60 transform hover:scale-110 transition-all duration-300 shadow-2xl flex items-center gap-3 relative overflow-hidden"
          >
            <Sparkles className="w-7 h-7 text-yellow-300" />
            I'm Already a Warrior
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Link>
        </div>

        {/* Live Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16 w-full max-w-4xl animate-slide-up" style={{ animationDelay: '0.8s' }}>
          <div className="text-center">
            <div className="glass rounded-2xl p-8 hover:scale-110 hover:bg-white/20 transition-all duration-300 border border-white/20">
              <Users className="w-10 h-10 mx-auto mb-3 text-blue-400 drop-shadow-lg" />
              <div className="text-4xl md:text-5xl font-black bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                {stats.players.toLocaleString()}+
              </div>
              <div className="text-sm md:text-base text-white/80 font-bold mt-1">Active Warriors</div>
            </div>
          </div>
          
          <div className="text-center">
            <div className="glass rounded-2xl p-8 hover:scale-110 hover:bg-white/20 transition-all duration-300 border border-white/20">
              <Trophy className="w-10 h-10 mx-auto mb-3 text-yellow-400 drop-shadow-lg" />
              <div className="text-4xl md:text-5xl font-black bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                {stats.games.toLocaleString()}+
              </div>
              <div className="text-sm md:text-base text-white/80 font-bold mt-1">Battles Today</div>
            </div>
          </div>
          
          <div className="text-center">
            <div className="glass rounded-2xl p-8 hover:scale-110 hover:bg-white/20 transition-all duration-300 border border-white/20">
              <Zap className="w-10 h-10 mx-auto mb-3 text-purple-400 drop-shadow-lg" />
              <div className="text-4xl md:text-5xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                {stats.questions.toLocaleString()}+
              </div>
              <div className="text-sm md:text-base text-white/80 font-bold mt-1">Epic Questions</div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto w-full px-4 animate-fade-in" style={{ animationDelay: '1s' }}>
          <div className="card text-center hover:scale-105 hover:bg-white/15 transition-all duration-300 border border-white/20 p-8">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-2xl">
              <Zap className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-black mb-3 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Real-Time Battles</h3>
            <p className="text-white/80 text-base leading-relaxed">Compete live against players worldwide in fast-paced trivia showdowns. Every second counts!</p>
          </div>
          
          <div className="card text-center hover:scale-105 hover:bg-white/15 transition-all duration-300 border border-white/20 p-8">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center shadow-2xl">
              <Trophy className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-black mb-3 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">Unlock Achievements</h3>
            <p className="text-white/80 text-base leading-relaxed">Earn legendary badges and climb the ranks. From rookie to Quiz Master - the journey awaits!</p>
          </div>
          
          <div className="card text-center hover:scale-105 hover:bg-white/15 transition-all duration-300 border border-white/20 p-8">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-2xl">
              <Crown className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-black mb-3 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Dominate Leaderboards</h3>
            <p className="text-white/80 text-base leading-relaxed">Prove you're the best. See your name in lights on global rankings. Glory awaits the victorious!</p>
          </div>
        </div>

      </div>

      
    </div>
    
    </>
  );
};

export default LandingPage;