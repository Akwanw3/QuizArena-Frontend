import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/AuthStores';
import { useGameStore } from '../store/GameStores';
import { roomService } from '../services/RoomServices';
import { gameService } from '../services/GameServices';
import { socketService } from '../services/SocketService';
import Navbar from '../components/Navbar';
import {
  Users,
  Crown,
  Copy,
  Check,
  Settings,
  Play,
  LogOut,
  Loader2,
  Trophy,
  Zap,
  Clock,
  Target,
  Shield,
  Sparkles,
  CheckCircle
} from 'lucide-react';


const GameRoom = () => {
  const { roomCode } = useParams<{ roomCode: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { 
    currentRoom, 
    currentQuestion, 
    timeRemaining, 
    hasAnswered,
    selectedAnswer,
    gameResults,
    setCurrentRoom, 
    setCurrentQuestion,
    setTimeRemaining,
    setHasAnswered,
    setSelectedAnswer,
    setGameResults,
    updatePlayerInRoom,
    resetGame
  } = useGameStore();

  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [gamePhase, setGamePhase] = useState<'waiting' | 'countdown' | 'playing' | 'results'>('waiting');
  const [countdown, setCountdown] = useState(3);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  const [correctAnswer, setCorrectAnswer] = useState('');

  // Fetch room data on mount
  // Fetch room data on mount
// CRITICAL: Setup socket listeners FIRST, before fetching room
  useEffect(() => {
    if (!roomCode) return;

    console.log('🎮 Setting up game room socket listeners FIRST');

    // Room updated
    const handleRoomUpdate = (updatedRoom: any) => {
      console.log('📢 Room updated:', updatedRoom);
      setCurrentRoom(updatedRoom);
    };

    // Game started - THIS IS THE CRITICAL ONE
    const handleGameStart = (data: any) => {
      console.log('🎮 Game started event received:', data);
      setGamePhase('countdown');
      setCountdown(3);
    };

    // Question received
    const handleQuestion = (question: any) => {
      console.log('❓ Question received:', question);
      setCurrentQuestion(question);
      setGamePhase('playing');
      setTimeRemaining(question.timeLimit);
      setHasAnswered(false);
      setSelectedAnswer(null);
      setShowCorrectAnswer(false);
    };

    // Answer revealed
    const handleAnswerReveal = (data: any) => {
      console.log('✅ Answer reveal:', data);
      setCorrectAnswer(data.correctAnswer);
      setShowCorrectAnswer(true);
    };

    // Scores updated
    const handleScoresUpdate = (scores: any) => {
      console.log('📊 Scores updated:', scores);
      scores.forEach((playerScore: any) => {
        updatePlayerInRoom(playerScore.userId, { score: playerScore.score });
      });
    };

    // Game ended
    const handleGameEnd = (data: any) => {
      console.log('🏁 Game ended:', data);
      setGameResults(data.results);
      setGamePhase('results');
    };

    // Player answered notification
    const handlePlayerAnswered = (data: any) => {
      console.log('✋ Player answered:', data);
      setCurrentRoom((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          players: prev.players.map((p) =>
            p.userId === data.userId ? { ...p, hasAnswered: true } : p
          ),
        };
      });
    };

    // Kicked from room
    const handleKicked = (data: any) => {
      alert(data.message);
      navigate('/home');
    };

    // Room deleted
    const handleRoomDeleted = (data: any) => {
      alert(data.message);
      navigate('/home');
    };

    // ATTACH ALL LISTENERS FIRST
    socketService.on('room:updated', handleRoomUpdate);
    socketService.on('game:started', handleGameStart);
    socketService.on('game:question', handleQuestion);
    socketService.on('game:answer-reveal', handleAnswerReveal);
    socketService.on('game:scores', handleScoresUpdate);
    socketService.on('game:ended', handleGameEnd);
    socketService.on('player:answered', handlePlayerAnswered);
    socketService.on('room:kicked', handleKicked);
    socketService.on('room:deleted', handleRoomDeleted);

    console.log('✅ All socket listeners attached');

    // NOW fetch room and join socket room
    const fetchRoom = async () => {
      try {
        setIsLoading(true);
        const room = await roomService.getRoomByCode(roomCode);
        console.log('📥 Room fetched:', room);
        setCurrentRoom(room);

        // Join Socket.io room AFTER listeners are set up
        console.log('🔌 Joining Socket.io room:', roomCode);
        socketService.joinRoom(roomCode);

        // Check if user is in the room
        const isPlayerInRoom = room.players.some((p) => p.userId === user?.id);
        if (!isPlayerInRoom) {
          console.log('🚪 Not in room, joining via API');
          await roomService.joinRoom(roomCode);
          const updatedRoom = await roomService.getRoomByCode(roomCode);
          setCurrentRoom(updatedRoom);
        }

        // Set game phase based on room status
        if (room.status === 'playing') {
          console.log('⚠️ Room already playing, setting phase to playing');
          setGamePhase('playing');
        } else if (room.status === 'finished') {
          console.log('⚠️ Room already finished');
          setGamePhase('results');
        }
      } catch (error: any) {
        console.error('❌ Error fetching room:', error);
        alert(error.response?.data?.message || 'Failed to load room');
        navigate('/home');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoom();

    // Cleanup
    return () => {
      console.log('🧹 Cleaning up game room socket listeners');
      socketService.off('room:updated', handleRoomUpdate);
      socketService.off('game:started', handleGameStart);
      socketService.off('game:question', handleQuestion);
      socketService.off('game:answer-reveal', handleAnswerReveal);
      socketService.off('game:scores', handleScoresUpdate);
      socketService.off('game:ended', handleGameEnd);
      socketService.off('player:answered', handlePlayerAnswered);
      socketService.off('room:kicked', handleKicked);
      socketService.off('room:deleted', handleRoomDeleted);
      
      console.log('🚪 Leaving room on unmount');
      socketService.leaveRoom();
    };
  }, [roomCode]);


 useEffect(() => {
    if (gamePhase === 'countdown' && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [gamePhase, countdown]);

  // Question timer
  useEffect(() => {
    if (gamePhase === 'playing' && currentQuestion && timeRemaining > 0 && !hasAnswered) {
      const timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [gamePhase, currentQuestion, timeRemaining, hasAnswered]);

  

  
 
  const handleCopyCode = () => {
    if (roomCode) {
      navigator.clipboard.writeText(roomCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleToggleReady = async () => {
    try {
      await roomService.toggleReady(roomCode!);
    } catch (error) {
      console.error('Error toggling ready:', error);
    }
  };

  const handleStartGame = async () => {
    try {
      await gameService.startGame(roomCode!);
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to start game');
    }
  };

  const handleLeaveRoom = async () => {
    try {
      await roomService.leaveRoom(roomCode!);
      resetGame();
      navigate('/home');
    } catch (error) {
      console.error('Error leaving room:', error);
      navigate('/home');
    }
  };

  const handleAnswerSelect = async (answer: string) => {
    if (hasAnswered || showCorrectAnswer) return;

    try {
      setSelectedAnswer(answer);
      setHasAnswered(true);
      
      await gameService.submitAnswer(roomCode!, answer);
    } catch (error) {
      console.error('Error submitting answer:', error);
    }
  };

  const handlePlayAgain = () => {
    resetGame();
    navigate('/lobby');
  };

  const isHost = currentRoom?.hostId === user?.id;
  const myPlayer = currentRoom?.players.find((p) => p.userId === user?.id);
  const allPlayersReady = currentRoom?.players.every((p) => p.isReady || p.userId === currentRoom.hostId);

  const difficultyColors = {
    easy: 'bg-green-500/20 text-green-400 border-green-500/30',
    medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    hard: 'bg-red-500/20 text-red-400 border-red-500/30',
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin text-primary-500 mx-auto mb-4" />
          <p className="text-white/70 text-lg">Loading arena...</p>
        </div>
      </div>
    );
  }

  if (!currentRoom) {
    return null;
  }

  // WAITING ROOM PHASE
  if (gamePhase === 'waiting') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <Navbar />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Room Header */}
          <div className="text-center mb-8 animate-fade-in">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div className="text-left">
                <h1 className="text-3xl font-black text-white">Battle Arena</h1>
                <p className="text-white/60">Waiting for warriors...</p>
              </div>
            </div>

            {/* Room Code */}
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="glass px-6 py-3 rounded-xl border border-white/20">
                <span className="text-white/60 text-sm mr-3">Room Code:</span>
                <span className="text-3xl font-black font-mono text-white tracking-wider">
                  {roomCode}
                </span>
              </div>
              <button
                onClick={handleCopyCode}
                className="p-3 glass rounded-xl border border-white/20 hover:border-primary-500/50 transition-all hover:scale-110"
              >
                {copied ? (
                  <Check className="w-6 h-6 text-green-400" />
                ) : (
                  <Copy className="w-6 h-6 text-white" />
                )}
              </button>
            </div>

            {copied && (
              <p className="text-green-400 text-sm animate-fade-in">
                Code copied! Share with friends!
              </p>
            )}
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            
            {/* Players List */}
            <div className="lg:col-span-2 glass rounded-2xl p-8 border border-white/20 animate-slide-up">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black text-white flex items-center gap-2">
                  <Users className="w-6 h-6 text-blue-400" />
                  Warriors ({currentRoom.players.length}/10)
                </h2>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {currentRoom.players.map((player) => (
                  <div
                    key={player.userId}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      player.isReady
                        ? 'border-green-500/50 bg-green-500/10'
                        : 'border-white/10 bg-slate-800/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={player.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + player.username}
                        alt={player.username}
                        className="w-12 h-12 rounded-full border-2 border-primary-500"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white">{player.username}</span>
                          {player.userId === currentRoom.hostId && (
                            <Crown className="w-4 h-4 text-yellow-400" />
                          )}
                          {player.userId === user?.id && (
                            <span className="text-xs px-2 py-0.5 bg-primary-500 rounded-full text-white">
                              You
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          {player.isReady ? (
                            <span className="text-xs text-green-400 flex items-center gap-1">
                              <CheckCircle className="w-4 h-4" />
                              Ready
                            </span>
                          ) : (
                            <span className="text-xs text-white/50">Not Ready</span>
                          )}
                          {!player.isConnected && (
                            <span className="text-xs text-red-400">Disconnected</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Game Info & Controls */}
            <div className="space-y-6">
              
              {/* Game Settings */}
              <div className="glass rounded-2xl p-6 border border-white/20 animate-fade-in">
                <h3 className="text-xl font-black text-white mb-4 flex items-center gap-2">
                  <Settings className="w-5 h-5 text-purple-400" />
                  Battle Settings
                </h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg">
                    <span className="text-white/60 text-sm">Difficulty</span>
                    <span className={`badge ${difficultyColors[currentRoom.settings.difficulty]}`}>
                      {currentRoom.settings.difficulty}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg">
                    <span className="text-white/60 text-sm">Questions</span>
                    <span className="font-bold text-white">{currentRoom.settings.numberOfQuestions}</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg">
                    <span className="text-white/60 text-sm">Time/Question</span>
                    <span className="font-bold text-white">{currentRoom.settings.timePerQuestion}s</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg">
                    <span className="text-white/60 text-sm">Category</span>
                    <span className="font-bold text-white capitalize">
                      {currentRoom.settings.category.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="glass rounded-2xl p-6 border border-white/20 space-y-3">
                { (
                  <button
                    onClick={handleToggleReady}
                    className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
                      myPlayer?.isReady
                        ? 'bg-slate-700 hover:bg-slate-600 text-white'
                        : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:shadow-lg hover:shadow-green-500/50 text-white'
                    }`}
                  >
                    {myPlayer?.isReady ? (
                      <>
                        <CheckCircle className="w-6 h-6 inline mr-2" />
                        Ready!
                      </>
                    ) : (
                      <>
                        <Shield className="w-6 h-6 inline mr-2" />
                        Mark as Ready
                      </>
                    )}
                  </button>
                )}

                {isHost && (
                  <button
                    onClick={handleStartGame}
                    disabled={!allPlayersReady || currentRoom.players.length < 1}
                    className="w-full py-4 bg-gradient-to-r from-primary-500 via-purple-600 to-pink-500 text-white font-bold text-lg rounded-xl shadow-2xl hover:shadow-primary-500/50 transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                  >
                    <Play className="w-6 h-6" />
                    <span>Start Battle</span>
                    <Sparkles className="w-5 h-5 animate-pulse" />
                  </button>
                )}

                <button
                  onClick={handleLeaveRoom}
                  className="w-full py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <LogOut className="w-5 h-5" />
                  Leave Arena
                </button>

                {isHost && !allPlayersReady && (
                  <p className="text-center text-white/50 text-sm">
                    Waiting for all players to be ready...
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // COUNTDOWN PHASE
  if (gamePhase === 'countdown') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center animate-bounce-in">
          <div className="text-9xl font-black mb-6 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent animate-pulse">
            {countdown > 0 ? countdown : 'GO!'}
          </div>
          <p className="text-2xl text-white/70 font-semibold">
            Prepare for battle...
          </p>
        </div>
      </div>
    );
  }

  // PLAYING PHASE
  if (gamePhase === 'playing' && currentQuestion) {
    const timePercentage = (timeRemaining / currentQuestion.timeLimit) * 100;
    const getTimeColor = () => {
      if (timePercentage > 50) return 'bg-green-500';
      if (timePercentage > 25) return 'bg-yellow-500';
      return 'bg-red-500';
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <Navbar />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Question Header */}
          <div className="text-center mb-8 animate-fade-in">
            <div className="flex items-center justify-center gap-6 mb-6">
              <div className="glass px-6 py-3 rounded-xl border border-white/20">
                <span className="text-white/60 text-sm">Question</span>
                <span className="text-2xl font-black text-white ml-3">
                  {currentQuestion.questionNumber}/{currentQuestion.totalQuestions}
                </span>
              </div>

              <div className="glass px-6 py-3 rounded-xl border border-white/20">
                <span className={`badge ${difficultyColors[currentQuestion.difficulty as keyof typeof difficultyColors]}`}>
                  {currentQuestion.difficulty}
                </span>
              </div>
            </div>

            {/* Timer Bar */}
            <div className="max-w-md mx-auto mb-8">
              <div className="flex items-center justify-between mb-2">
                <Clock className="w-5 h-5 text-white/60" />
                <span className={`text-3xl font-black ${timePercentage < 25 ? 'text-red-400 animate-pulse' : 'text-white'}`}>
                  {timeRemaining}s
                </span>
              </div>
              <div className="h-4 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className={`h-full ${getTimeColor()} transition-all duration-1000 ease-linear`}
                  style={{ width: `${timePercentage}%` }}
                />
              </div>
            </div>
          </div>

          {/* Question Card */}
          <div className="glass rounded-3xl p-8 md:p-12 border border-white/20 mb-8 animate-slide-up">
            <div className="text-center mb-4">
              <span className="text-sm text-white/50 uppercase tracking-wider">
                {currentQuestion.category}
              </span>
            </div>
            <h2 className="text-2xl md:text-4xl font-bold text-white text-center leading-relaxed">
              {currentQuestion.question}
            </h2>
          </div>

          {/* Answer Options */}
          <div className="grid md:grid-cols-2 gap-4 animate-fade-in">
            {currentQuestion.answers.map((answer, index) => {
              const isSelected = selectedAnswer === answer;
              const isCorrect = showCorrectAnswer && answer === correctAnswer;
              const isWrong = showCorrectAnswer && isSelected && answer !== correctAnswer;

              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(answer)}
                  disabled={hasAnswered || showCorrectAnswer}
                  className={`p-6 rounded-2xl border-2 font-semibold text-lg transition-all transform hover:scale-105 disabled:cursor-not-allowed ${
                    isCorrect
                      ? 'border-green-500 bg-green-500/20 text-green-400'
                      : isWrong
                      ? 'border-red-500 bg-red-500/20 text-red-400'
                      : isSelected
                      ? 'border-primary-500 bg-primary-500/20 text-white scale-105'
                      : 'border-white/20 bg-slate-800/50 text-white hover:border-white/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{answer}</span>
                    {isCorrect && <CheckCircle className="w-6 h-6" />}
                    {isWrong && <span className="text-2xl">❌</span>}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Status Message */}
          {hasAnswered && !showCorrectAnswer && (
            <div className="text-center mt-8 animate-fade-in">
              <div className="inline-flex items-center gap-2 glass px-6 py-3 rounded-xl border border-white/20">
                <Loader2 className="w-5 h-5 animate-spin text-primary-500" />
                <span className="text-white font-semibold">Waiting for other players...</span>
              </div>
            </div>
          )}

          {/* Players Who Answered */}
          <div className="mt-8 glass rounded-2xl p-6 border border-white/20">
            <div className="flex items-center gap-4 flex-wrap">
              <span className="text-white/60 text-sm font-semibold">Answered:</span>
              {currentRoom.players.map((player) => (
                player.hasAnswered && (
                  <div key={player.userId} className="flex items-center gap-2">
                    <img
                      src={player.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + player.username}
                      alt={player.username}
                      className="w-8 h-8 rounded-full border-2 border-green-500"
                    />
                    <span className="text-white text-sm font-semibold">{player.username}</span>
                  </div>
                )
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // RESULTS PHASE
  if (gamePhase === 'results' && gameResults) {
    const myResult = gameResults.find((r) => r.userId === user?.id);
    const winner = gameResults[0];

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <Navbar />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Victory Banner */}
          <div className="text-center mb-12 animate-fade-in">
            {myResult?.rank === 1 && (
              <div className="mb-6">
                <div className="text-6xl mb-4">🎉</div>
                <h1 className="text-5xl font-black mb-3 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
                  VICTORY!
                </h1>
                <p className="text-2xl text-white/80">You dominated the arena!</p>
              </div>
            )}
            
            {myResult && myResult.rank > 1 && (
              <div className="mb-6">
                <h1 className="text-4xl font-black mb-3 text-white">
                  Battle Complete!
                </h1>
                <p className="text-xl text-white/70">
                  You finished #{myResult.rank}
                </p>
              </div>
            )}

            <div className="inline-flex items-center gap-3 glass px-6 py-3 rounded-xl border border-white/20">
              <Trophy className="w-6 h-6 text-yellow-400" />
              <span className="text-white/60">Winner:</span>
              <span className="text-xl font-black text-white">{winner.username}</span>
              <Crown className="w-6 h-6 text-yellow-400" />
            </div>
          </div>

          {/* Leaderboard */}
          <div className="glass rounded-3xl p-8 border border-white/20 mb-8 animate-slide-up">
            <h2 className="text-3xl font-black text-white mb-6 text-center flex items-center justify-center gap-3">
              <Trophy className="w-8 h-8 text-yellow-400" />
              Final Standings
            </h2>

            <div className="space-y-4">
              {gameResults.map((result, index) => {
                const medals = ['🥇', '🥈', '🥉'];
                const isMe = result.userId === user?.id;

                return (
                  <div
                    key={result.userId}
                    className={`p-6 rounded-2xl border-2 transition-all ${
                      isMe
                        ? 'border-primary-500 bg-primary-500/10 scale-105'
                        : index < 3
                        ? 'border-yellow-500/30 bg-yellow-500/5'
                        : 'border-white/10 bg-slate-800/30'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-4xl font-black w-12 text-center">
                        {medals[index] || `#${index + 1}`}
                      </div>

                      <img
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${result.username}`}
                        alt={result.username}
                        className="w-14 h-14 rounded-full border-2 border-primary-500"
                      />

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-black text-white text-xl">
                            {result.username}
                          </span>
                          {isMe && (
                            <span className="text-xs px-2 py-0.5 bg-primary-500 rounded-full text-white">
                              You
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-white/70">
                          <span>
                            <Target className="w-4 h-4 inline mr-1" />
                            {result.accuracy.toFixed(1)}% accuracy
                          </span>
                          <span>
                            <Zap className="w-4 h-4 inline mr-1" />
                            {result.averageTimeToAnswer.toFixed(1)}s avg
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-4xl font-black bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                          {result.finalScore}
                        </div>
                        <div className="text-sm text-white/50">points</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* My Stats */}
          {myResult && (
            <div className="grid md:grid-cols-4 gap-4 mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="glass rounded-xl p-6 border border-white/20 text-center">
                <div className="text-3xl font-black bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                  #{myResult.rank}
                </div>
                <div className="text-sm text-white/60">Final Rank</div>
              </div>

              <div className="glass rounded-xl p-6 border border-white/20 text-center">
                <div className="text-3xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">{myResult.accuracy.toFixed(1)}%
                </div>
                <div className="text-sm text-white/60">Accuracy</div>
              </div>

              <div className="glass rounded-xl p-6 border border-white/20 text-center">
                <div className="text-3xl font-black bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-2">
                  {myResult.averageTimeToAnswer.toFixed(1)}s
                </div>
                <div className="text-sm text-white/60">Avg Time</div>
              </div>

              <div className="glass rounded-xl p-6 border border-white/20 text-center">
                <div className="text-3xl font-black bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent mb-2">
                  {myResult.fastestAnswer.toFixed(1)}s
                </div>
                <div className="text-sm text-white/60">Fastest</div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <button
              onClick={handlePlayAgain}
              className="px-8 py-4 bg-gradient-to-r from-primary-500 via-purple-600 to-pink-500 text-white font-bold text-lg rounded-xl shadow-2xl hover:shadow-primary-500/50 transition-all hover:scale-105 flex items-center justify-center gap-2"
            >
              <Play className="w-6 h-6" />
              Play Again
            </button>

            <button
              onClick={() => navigate('/home')}
              className="px-8 py-4 bg-slate-700 hover:bg-slate-600 text-white font-bold text-lg rounded-xl transition-all hover:scale-105 flex items-center justify-center gap-2"
            >
              <Trophy className="w-6 h-6" />
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default GameRoom ;