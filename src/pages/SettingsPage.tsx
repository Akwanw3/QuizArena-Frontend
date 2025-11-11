import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '../store/AuthStores';
import { authService } from '../services/AuthServices';
import Navbar from '../components/Navbar';
import {
  Settings as SettingsIcon,
  User,
  Lock,
  Mail,
  Shield,
  Camera,
  Bell,
  Save,
  Loader2,
  Check,
  AlertCircle,
  ArrowLeft
} from 'lucide-react';
import { Link } from 'react-router-dom';

const passwordSchema = z.object({
  currentPassword: z.string().min(6, 'Password must be at least 6 characters'),
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type PasswordFormData = z.infer<typeof passwordSchema>;

const SettingsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'profile' | 'password' | 'notifications' | 'Verify-email'>('profile');
  const [isUpdating, setIsUpdating] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [username, setUsername] = useState(user?.username || '');
  const [email] = useState(user?.email || '');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  const handleUpdateProfile = async () => {
    if (!username.trim() || username === user?.username) return;

    try {
      setIsUpdating(true);
      setErrorMessage('');
      
      await authService.updateProfile({ username });
      
      setSuccessMessage('Profile updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error: any) {
      setErrorMessage(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleChangePassword = async (data: PasswordFormData) => {
    try {
      setIsUpdating(true);
      setErrorMessage('');
      
      await authService.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      
      setSuccessMessage('Password changed successfully!');
      reset();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error: any) {
      setErrorMessage(error.response?.data?.message || 'Failed to change password');
    } finally {
      setIsUpdating(false);
    }
  };

  

  const tabs = [
    { id: 'profile', name: 'Profile', icon: <User className="w-5 h-5" /> },
    { id: 'password', name: 'Password', icon: <Lock className="w-5 h-5" /> },
    { id: 'notifications', name: 'Notifications', icon: <Bell className="w-5 h-5" /> },
     { id: 'Verify-email', name: 'Verify-email', icon: <Mail className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Back Button */}
        <Link
          to={`/profile/${user?.id}`}
          className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-6 transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Profile</span>
        </Link>

        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-2xl">
              <SettingsIcon className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-3">
            <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
              Settings
            </span>
          </h1>
          <p className="text-white/70 text-lg">
            Manage your account preferences
          </p>
        </div>

        {/* Success/Error Messages */}
        {successMessage && (
          <div className="mb-6 p-4 rounded-xl bg-green-500/20 border border-green-500/50 flex items-center gap-3 animate-fade-in">
            <Check className="w-5 h-5 text-green-400" />
            <p className="text-green-200">{successMessage}</p>
          </div>
        )}

        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/20 border border-red-500/50 flex items-center gap-3 animate-shake">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <p className="text-red-200">{errorMessage}</p>
          </div>
        )}

        <div className="grid lg:grid-cols-4 gap-6">
          
          {/* Sidebar Tabs */}
          <div className="lg:col-span-1">
            <div className="glass rounded-2xl p-4 border border-white/20 sticky top-24">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${
                      activeTab === tab.id
                        ? 'bg-primary-600 text-white'
                        : 'text-white/70 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.name}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            {/*email tab*/}

            
            
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="glass rounded-2xl p-8 border border-white/20 animate-fade-in">
                <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
                  <User className="w-6 h-6 text-blue-400" />
                  Profile Information
                </h2>

                <div className="space-y-6">
                  
                  {/* Avatar */}
                  <div>
                    <label className="block text-sm font-semibold text-white/90 mb-3">
                      Profile Picture
                    </label>
                    <div className="flex items-center gap-6">
                      <img
                        src={user?.avatar}
                        alt={user?.username}
                        className="w-24 h-24 rounded-full border-4 border-primary-500"
                      />
                      <div>
                        <button
                          onClick={() => navigate(`/profile/${user?.id}`)}
                          className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-all"
                        >
                          <Camera className="w-5 h-5" />
                          Change Avatar
                        </button>
                        <p className="text-sm text-white/50 mt-2">
                          Click to choose from avatar styles
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Username */}
                  <div>
                    <label className="block text-sm font-semibold text-white/90 mb-2">
                      Username
                    </label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="input"
                      placeholder="Enter username"
                    />
                    <p className="text-xs text-white/50 mt-1">
                      This is how other players will see you
                    </p>
                  </div>

                  {/* Email (Read-only) */}
                  <div>
                    <label className="block text-sm font-semibold text-white/90 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                      <input
                        type="email"
                        value={email}
                        disabled
                        className="input pl-12 bg-slate-800/30 cursor-not-allowed"
                      />
                    </div>
                    <p className="text-xs text-white/50 mt-1">
                      Email cannot be changed
                    </p>
                  </div>

                  {/* Save Button */}
                  <button
                    onClick={handleUpdateProfile}
                    disabled={isUpdating || username === user?.username}
                    className="w-full py-3 bg-gradient-to-r from-primary-500 to-purple-600 text-white font-bold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isUpdating ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Password Tab */}
            {activeTab === 'password' && (
              <div className="glass rounded-2xl p-8 border border-white/20 animate-fade-in">
                <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
                  <Shield className="w-6 h-6 text-green-400" />
                  Change Password
                </h2>

                <form onSubmit={handleSubmit(handleChangePassword)} className="space-y-6">
                  
                  {/* Current Password */}
                  <div>
                    <label className="block text-sm font-semibold text-white/90 mb-2">
                      Current Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                      <input
                        type="password"
                        placeholder="Enter current password"
                        {...register('currentPassword')}
                        className={`input pl-12 ${errors.currentPassword ? 'border-red-500' : ''}`}
                      />
                    </div>
                    {errors.currentPassword && (
                      <p className="mt-2 text-sm text-red-400">{errors.currentPassword.message}</p>
                    )}
                  </div>

                  {/* New Password */}
                  <div>
                    <label className="block text-sm font-semibold text-white/90 mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                      <input
                        type="password"
                        placeholder="Enter new password"
                        {...register('newPassword')}
                        className={`input pl-12 ${errors.newPassword ? 'border-red-500' : ''}`}
                      />
                    </div>
                    {errors.newPassword && (
                      <p className="mt-2 text-sm text-red-400">{errors.newPassword.message}</p>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-sm font-semibold text-white/90 mb-2">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                      <input
                        type="password"
                        placeholder="Confirm new password"
                        {...register('confirmPassword')}
                        className={`input pl-12 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                      />
                    </div>
                    {errors.confirmPassword && (
                      <p className="mt-2 text-sm text-red-400">{errors.confirmPassword.message}</p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isUpdating ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <Shield className="w-5 h-5" />
                        Change Password
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="glass rounded-2xl p-8 border border-white/20 animate-fade-in">
                <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
                  <Bell className="w-6 h-6 text-yellow-400" />
                  Notification Preferences
                </h2>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl">
                    <div>
                      <div className="font-semibold text-white">Game Invites</div>
                      <div className="text-sm text-white/60">Get notified when someone invites you</div>
                    </div>
                    <button className="relative w-14 h-8 rounded-full bg-primary-600">
                      <div className="absolute top-1 right-1 w-6 h-6 bg-white rounded-full transition-transform" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl">
                    <div>
                      <div className="font-semibold text-white">Achievements</div>
                      <div className="text-sm text-white/60">Get notified when you unlock achievements</div>
                    </div>
                    <button className="relative w-14 h-8 rounded-full bg-primary-600">
                      <div className="absolute top-1 right-1 w-6 h-6 bg-white rounded-full transition-transform" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl">
                    <div>
                      <div className="font-semibold text-white">Leaderboard Updates</div>
                      <div className="text-sm text-white/60">Get notified about your ranking changes</div>
                    </div>
                    <button className="relative w-14 h-8 rounded-full bg-slate-600">
                      <div className="absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            

            {activeTab === "Verify-email" && (
               <div  className="glass rounded-2xl p-8 border border-white/20 animate-fade-in">
                 <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
                  <Mail className="w-6 h-6 text-red-400" />
                  Verify your Email
                </h2>
                {user?.isVerified ? (
                  <div className="font-semibold text-white">Your email is verified</div>
                ) : (
                  <div className='mt-2 text-sm text-red-400 font-bold'>
                    Please verify your Email to access the arena and battle in real time.
                    <button className='ml-2 text-sm text-blue-400 font-semibold bg-red-600 w-full py-3  rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2' onClick={() => navigate(`/verify-email`)}
                >
                  Verify Now!!!
                  </button>
                </div>
                )}
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;