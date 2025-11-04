import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { roomService } from '../services/RoomServices';
import Navbar from '../components/Navbar';
import {
  Play,
  Users,
  Clock,
  Target,
  BookOpen,
  Zap,
  Trophy,
  Settings,
  Sparkles,
  ArrowLeft,
  Loader2,
  Shield,
  Flame
} from 'lucide-react';
import { Link } from 'react-router-dom';

// Validation schema
const createRoomSchema = z.object({
  category: z.string(),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  numberOfQuestions: z.number().min(5).max(20),
  timePerQuestion: z.number().min(5).max(60),
  isPublic: z.boolean(),
});

type CreateRoomFormData = z.infer<typeof createRoomSchema>;

const GameLobby = () => {
  const navigate = useNavigate();
  const [isCreating, setIsCreating] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [selectedCategory, setSelectedCategory] = useState('any');
  const [questionCount, setQuestionCount] = useState(10);
  const [timePerQuestion, setTimePerQuestion] = useState(15);
  const [isPublic, setIsPublic] = useState(true);

  const categories = [
    { id: 'any', name: 'Random Mix', icon: '🎲', color: 'from-purple-500 to-pink-500' },
    { id: 'general_knowledge', name: 'General Knowledge', icon: '🧠', color: 'from-blue-500 to-cyan-500' },
    { id: 'science', name: 'Science', icon: '🔬', color: 'from-green-500 to-emerald-500' },
    { id: 'history', name: 'History', icon: '📜', color: 'from-yellow-500 to-orange-500' },
    { id: 'geography', name: 'Geography', icon: '🌍', color: 'from-teal-500 to-blue-500' },
    { id: 'sports', name: 'Sports', icon: '⚽', color: 'from-red-500 to-orange-500' },
    { id: 'entertainment', name: 'Entertainment', icon: '🎬', color: 'from-pink-500 to-purple-500' },
    { id: 'arts', name: 'Arts & Literature', icon: '🎨', color: 'from-indigo-500 to-purple-500' },
    { id: 'animals', name: 'Animals', icon: '🦁', color: 'from-amber-500 to-yellow-500' },
  ];

  const difficulties = [
    { 
      value: 'easy', 
      label: 'Easy', 
      icon: <Shield className="w-5 h-5" />,
      color: 'from-green-500 to-emerald-500',
      description: 'Perfect for beginners'
    },
    { 
      value: 'medium', 
      label: 'Medium', 
      icon: <Target className="w-5 h-5" />,
      color: 'from-yellow-500 to-orange-500',
      description: 'Balanced challenge'
    },
    { 
      value: 'hard', 
      label: 'Hard', 
      icon: <Flame className="w-5 h-5" />,
      color: 'from-red-500 to-pink-500',
      description: 'For true masters'
    },
  ];

  const handleCreateRoom = async () => {
    try {
      setIsCreating(true);

      const roomData = {
        category: selectedCategory,
        difficulty: selectedDifficulty,
        numberOfQuestions: questionCount,
        timePerQuestion: timePerQuestion,
        isPublic: isPublic,
      } as CreateRoomFormData;

      const room = await roomService.createRoom(roomData);
      
      // Navigate to the created room
      navigate(`/room/${room.roomCode}`);
    } catch (error: any) {
      console.error('Error creating room:', error);
      alert(error.response?.data?.message || 'Failed to create room');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Back Button */}
        <Link
          to="/home"
          className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-6 transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Home</span>
        </Link>

        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center shadow-2xl">
              <Settings className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-3">
            <span className="bg-gradient-to-r from-primary-400 to-purple-500 bg-clip-text text-transparent">
              Create Your Arena
            </span>
          </h1>
          <p className="text-white/70 text-lg">
            Configure your perfect battle and invite warriors!
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Settings Panel - 2/3 width */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Category Selection */}
            <div className="glass rounded-2xl p-8 border border-white/20 animate-slide-up">
              <div className="flex items-center gap-3 mb-6">
                <BookOpen className="w-6 h-6 text-purple-400" />
                <h2 className="text-2xl font-black text-white">Choose Category</h2>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                      selectedCategory === category.id
                        ? 'border-purple-500 bg-purple-500/20 scale-105'
                        : 'border-white/10 bg-slate-800/50 hover:border-white/30 hover:scale-105'
                    }`}
                  >
                    <div className="text-4xl mb-2">{category.icon}</div>
                    <div className="font-bold text-white text-sm">{category.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty Selection */}
            <div className="glass rounded-2xl p-8 border border-white/20 animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <div className="flex items-center gap-3 mb-6">
                <Zap className="w-6 h-6 text-yellow-400" />
                <h2 className="text-2xl font-black text-white">Select Difficulty</h2>
              </div>
              
              <div className="grid md:grid-cols-3 gap-4">
                {difficulties.map((difficulty) => (
                  <button
                    key={difficulty.value}
                    onClick={() => setSelectedDifficulty(difficulty.value as any)}
                    className={`p-6 rounded-xl border-2 transition-all duration-300 ${
                      selectedDifficulty === difficulty.value
                        ? `border-transparent bg-gradient-to-br ${difficulty.color} scale-105`
                        : 'border-white/10 bg-slate-800/50 hover:border-white/30 hover:scale-105'
                    }`}
                  >
                    <div className="flex justify-center mb-3">
                      {difficulty.icon}
                    </div>
                    <div className="font-black text-white text-lg mb-1">
                      {difficulty.label}
                    </div>
                    <div className="text-white/70 text-xs">
                      {difficulty.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Advanced Settings */}
            <div className="glass rounded-2xl p-8 border border-white/20 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center gap-3 mb-6">
                <Settings className="w-6 h-6 text-blue-400" />
                <h2 className="text-2xl font-black text-white">Game Settings</h2>
              </div>
              
              <div className="space-y-6">
                
                {/* Number of Questions */}
                <div>
                  <label className="block text-white font-semibold mb-3">
                    <Target className="w-5 h-5 inline mr-2 text-blue-400" />
                    Number of Questions: 
                    <span className="text-blue-400 ml-2 text-2xl font-black">{questionCount}</span>
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min="5"
                      max="20"
                      value={questionCount}
                      onChange={(e) => setQuestionCount(parseInt(e.target.value))}
                      className="flex-1 h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <div className="text-white/50 text-sm">5-20</div>
                  </div>
                  <div className="flex justify-between text-xs text-white/40 mt-1 px-1">
                    <span>Quick</span>
                    <span>Standard</span>
                    <span>Epic</span>
                  </div>
                </div>

                {/* Time per Question */}
                <div>
                  <label className="block text-white font-semibold mb-3">
                    <Clock className="w-5 h-5 inline mr-2 text-orange-400" />
                    Time per Question: 
                    <span className="text-orange-400 ml-2 text-2xl font-black">{timePerQuestion}s</span>
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min="5"
                      max="60"
                      step="5"
                      value={timePerQuestion}
                      onChange={(e) => setTimePerQuestion(parseInt(e.target.value))}
                      className="flex-1 h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <div className="text-white/50 text-sm">5-60s</div>
                  </div>
                  <div className="flex justify-between text-xs text-white/40 mt-1 px-1">
                    <span>Blitz</span>
                    <span>Balanced</span>
                    <span>Relaxed</span>
                  </div>
                </div>

                {/* Public/Private Toggle */}
                <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-green-400" />
                    <div>
                      <div className="font-semibold text-white">Public Room</div>
                      <div className="text-sm text-white/60">
                        {isPublic ? 'Anyone can join' : 'Invite only'}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsPublic(!isPublic)}
                    className={`relative w-14 h-8 rounded-full transition-all duration-300 ${
                      isPublic ? 'bg-green-500' : 'bg-slate-600'
                    }`}
                  >
                    <div
                      className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform duration-300 ${
                        isPublic ? 'translate-x-7' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Summary & Create Panel - 1/3 width */}
          <div className="lg:col-span-1">
            <div className="glass rounded-2xl p-8 border border-white/20 sticky top-24 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="flex items-center gap-3 mb-6">
                <Trophy className="w-6 h-6 text-yellow-400" />
                <h2 className="text-2xl font-black text-white">Battle Summary</h2>
              </div>

              {/* Summary Cards */}
              <div className="space-y-4 mb-6">
                <div className="p-4 bg-slate-800/50 rounded-xl border border-white/10">
                  <div className="flex items-center justify-between">
                    <span className="text-white/60 text-sm">Category</span>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">
                        {categories.find(c => c.id === selectedCategory)?.icon}
                      </span>
                      <span className="font-bold text-white text-sm">
                        {categories.find(c => c.id === selectedCategory)?.name}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-800/50 rounded-xl border border-white/10">
                  <div className="flex items-center justify-between">
                    <span className="text-white/60 text-sm">Difficulty</span>
                    <span className={`px-3 py-1 rounded-full font-bold text-sm bg-gradient-to-r ${
                      difficulties.find(d => d.value === selectedDifficulty)?.color
                    } text-white`}>
                      {selectedDifficulty.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-slate-800/50 rounded-xl border border-white/10">
                  <div className="flex items-center justify-between">
                    <span className="text-white/60 text-sm">Questions</span>
                    <span className="font-black text-white text-xl">{questionCount}</span>
                  </div>
                </div>

                <div className="p-4 bg-slate-800/50 rounded-xl border border-white/10">
                  <div className="flex items-center justify-between">
                    <span className="text-white/60 text-sm">Time/Question</span>
                    <span className="font-black text-white text-xl">{timePerQuestion}s</span>
                  </div>
                </div>

                <div className="p-4 bg-slate-800/50 rounded-xl border border-white/10">
                  <div className="flex items-center justify-between">
                    <span className="text-white/60 text-sm">Room Type</span>
                    <span className={`font-bold ${isPublic ? 'text-green-400' : 'text-orange-400'}`}>
                      {isPublic ? 'Public' : 'Private'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Estimated Duration */}
              <div className="p-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl border border-blue-500/30 mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-blue-400" />
                  <span className="text-white/80 text-sm font-semibold">Estimated Duration</span>
                </div>
                <div className="text-2xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  ~{Math.ceil((questionCount * timePerQuestion) / 60)} minutes
                </div>
              </div>

              {/* Create Button */}
              <button
                onClick={handleCreateRoom}
                disabled={isCreating}
                className="w-full py-4 bg-gradient-to-r from-primary-500 via-purple-600 to-pink-500 text-white font-black text-lg rounded-xl shadow-2xl hover:shadow-primary-500/50 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
              >
                {isCreating ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span>Creating Arena...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-6 h-6" />
                    <span>Create Arena</span>
                    <Sparkles className="w-5 h-5 animate-pulse" />
                  </>
                )}
              </button>

              <p className="text-white/50 text-xs text-center mt-4">
                You'll be able to share the room code with friends
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameLobby;