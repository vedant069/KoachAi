import React, { useState } from 'react';
import { UserData } from '../types/UserData';
import { Users, Calendar, Eye, LogOut, Lock, Shield, BarChart3, Sheet } from 'lucide-react';

interface AdminDashboardProps {
  users: UserData[];
  isAuthenticated: boolean;
  onLogin: (username: string, password: string) => boolean;
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({
  users,
  isAuthenticated,
  onLogin,
  onLogout
}) => {
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const success = onLogin(loginForm.username, loginForm.password);
    if (!success) {
      setLoginError('Invalid credentials');
    } else {
      setLoginError('');
      setLoginForm({ username: '', password: '' });
    }
  };

  const groupUsersByDate = () => {
    const grouped: Record<string, UserData[]> = {};
    users.forEach(user => {
      if (!grouped[user.preferredDate]) {
        grouped[user.preferredDate] = [];
      }
      grouped[user.preferredDate].push(user);
    });
    return grouped;
  };

  // Login Form
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        {/* Dynamic Background with Flowing Curves */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
          {/* Flowing Curve 1 */}
          <div className="absolute top-0 left-0 w-full h-full">
            <svg viewBox="0 0 1200 800" className="absolute inset-0 w-full h-full">
              <defs>
                <linearGradient id="adminGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#3B82F6" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.4" />
                </linearGradient>
              </defs>
              <path
                d="M0,200 C300,100 600,300 900,200 C1000,150 1100,250 1200,200 L1200,0 L0,0 Z"
                fill="url(#adminGradient1)"
              />
            </svg>
          </div>
          
          {/* Flowing Curve 2 */}
          <div className="absolute bottom-0 right-0 w-full h-full">
            <svg viewBox="0 0 1200 800" className="absolute inset-0 w-full h-full">
              <defs>
                <linearGradient id="adminGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.7" />
                  <stop offset="50%" stopColor="#06B6D4" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.3" />
                </linearGradient>
              </defs>
              <path
                d="M1200,600 C900,700 600,500 300,600 C200,650 100,550 0,600 L0,800 L1200,800 Z"
                fill="url(#adminGradient2)"
              />
            </svg>
          </div>

          {/* Floating Elements */}
          <div className="absolute top-20 left-20 w-6 h-6 bg-cyan-400 rounded-full opacity-60 animate-pulse"></div>
          <div className="absolute top-40 right-32 w-8 h-8 bg-purple-400 rounded-full opacity-40 animate-bounce"></div>
          <div className="absolute bottom-32 left-16 w-4 h-4 bg-blue-300 rounded-full opacity-70"></div>
          <div className="absolute top-60 left-1/3 w-5 h-5 bg-cyan-300 rounded-full opacity-50 animate-pulse"></div>
          <div className="absolute bottom-40 right-20 w-7 h-7 bg-purple-300 rounded-full opacity-60"></div>
        </div>

        <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
          <div className="bg-white/15 backdrop-blur-md p-10 rounded-3xl shadow-2xl max-w-md w-full border border-white/30">
            <div className="text-center mb-10">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 rounded-2xl w-20 h-20 mx-auto mb-6 flex items-center justify-center shadow-lg">
                <Lock className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">Admin Login</h2>
              <p className="text-white/80 text-lg">Access the dashboard</p>
            </div>
            
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-lg font-medium text-white/90 mb-3">
                  Username
                </label>
                <input
                  type="text"
                  value={loginForm.username}
                  onChange={(e) => setLoginForm(prev => ({ ...prev, username: e.target.value }))}
                  className="w-full px-6 py-4 rounded-2xl border-2 border-white/30 focus:border-blue-400 focus:outline-none transition-all bg-white/90 backdrop-blur-sm text-lg placeholder-gray-500"
                  placeholder="Enter username"
                  required
                />
              </div>
              <div>
                <label className="block text-lg font-medium text-white/90 mb-3">
                  Password
                </label>
                <input
                  type="password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full px-6 py-4 rounded-2xl border-2 border-white/30 focus:border-blue-400 focus:outline-none transition-all bg-white/90 backdrop-blur-sm text-lg placeholder-gray-500"
                  placeholder="Enter password"
                  required
                />
              </div>
              {loginError && (
                <p className="text-red-200 text-lg text-center bg-red-500/30 backdrop-blur-sm p-3 rounded-xl border border-red-400/50">{loginError}</p>
              )}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 rounded-2xl hover:from-blue-400 hover:to-purple-500 transition-all font-bold text-lg shadow-2xl transform hover:scale-105"
              >
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  const groupedUsers = groupUsersByDate();

  // Dashboard
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
        {/* Flowing Curve 1 */}
        <div className="absolute top-0 left-0 w-full h-full">
          <svg viewBox="0 0 1200 800" className="absolute inset-0 w-full h-full">
            <defs>
              <linearGradient id="dashboardGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FCD34D" stopOpacity="0.3" />
                <stop offset="50%" stopColor="#06B6D4" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.1" />
              </linearGradient>
            </defs>
            <path
              d="M0,150 C200,50 400,250 600,150 C800,50 1000,200 1200,100 L1200,0 L0,0 Z"
              fill="url(#dashboardGradient1)"
            />
          </svg>
        </div>
        
        {/* Flowing Curve 2 */}
        <div className="absolute bottom-0 right-0 w-full h-full">
          <svg viewBox="0 0 1200 800" className="absolute inset-0 w-full h-full">
            <defs>
              <linearGradient id="dashboardGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.2" />
                <stop offset="50%" stopColor="#06B6D4" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#FCD34D" stopOpacity="0.1" />
              </linearGradient>
            </defs>
            <path
              d="M1200,650 C1000,750 800,550 600,650 C400,750 200,600 0,700 L0,800 L1200,800 Z"
              fill="url(#dashboardGradient2)"
            />
          </svg>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-20 w-4 h-4 bg-blue-300 rounded-full opacity-40 animate-pulse"></div>
        <div className="absolute top-40 right-32 w-6 h-6 bg-purple-300 rounded-full opacity-30 animate-bounce"></div>
        <div className="absolute bottom-32 left-16 w-3 h-3 bg-cyan-300 rounded-full opacity-50"></div>
        <div className="absolute top-60 left-1/3 w-5 h-5 bg-yellow-300 rounded-full opacity-40 animate-pulse"></div>
        <div className="absolute bottom-40 right-20 w-4 h-4 bg-blue-400 rounded-full opacity-30"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-white/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-2xl shadow-lg">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                  <p className="text-gray-600 text-lg">KOACH AI Learning Platform Management</p>
                </div>
              </div>
              <button
                onClick={onLogout}
                className="flex items-center space-x-3 text-gray-600 hover:text-gray-900 transition-all bg-white/60 backdrop-blur-sm px-6 py-3 rounded-2xl border border-gray-200 hover:bg-white/80 shadow-lg transform hover:scale-105"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>
        </header>

        {/* Stats Cards */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
            <div className="bg-white/80 backdrop-blur-md p-8 rounded-3xl shadow-xl border border-white/50 transform hover:scale-105 transition-all">
              <div className="flex items-center">
                <div className="bg-gradient-to-r from-blue-400 to-cyan-500 p-4 rounded-2xl shadow-lg">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <div className="ml-6">
                  <p className="text-lg font-medium text-gray-600">Total Registrations</p>
                  <p className="text-4xl font-bold text-gray-900">{users.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/80 backdrop-blur-md p-8 rounded-3xl shadow-xl border border-white/50 transform hover:scale-105 transition-all">
              <div className="flex items-center">
                <div className="bg-gradient-to-r from-green-400 to-emerald-500 p-4 rounded-2xl shadow-lg">
                  <Calendar className="w-8 h-8 text-white" />
                </div>
                <div className="ml-6">
                  <p className="text-lg font-medium text-gray-600">Scheduled Sessions</p>
                  <p className="text-4xl font-bold text-gray-900">{Object.keys(groupedUsers).length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/80 backdrop-blur-md p-8 rounded-3xl shadow-xl border border-white/50 transform hover:scale-105 transition-all">
              <div className="flex items-center">
                <div className="bg-gradient-to-r from-purple-400 to-pink-500 p-4 rounded-2xl shadow-lg">
                  <Sheet className="w-8 h-8 text-white" />
                </div>
                <div className="ml-6">
                  <p className="text-lg font-medium text-gray-600">Auto-Sync Enabled</p>
                  <p className="text-sm text-gray-500 mt-1">Data automatically saved to Google Sheets upon registration</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sessions by Date */}
          <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl border border-white/50 overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-200/50 bg-gradient-to-r from-blue-50/50 to-purple-50/50">
              <h3 className="text-2xl font-bold text-gray-900">Scheduled Sessions</h3>
            </div>
            
            {Object.keys(groupedUsers).length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                <div className="bg-gray-100 p-6 rounded-2xl w-24 h-24 mx-auto mb-4 flex items-center justify-center">
                  <Users className="w-12 h-12 text-gray-400" />
                </div>
                <p className="text-xl">No registrations yet.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200/50">
                {Object.entries(groupedUsers)
                  .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
                  .map(([date, dateUsers]) => (
                    <div key={date} className="p-8">
                      <div className="flex items-center justify-between mb-6">
                        <h4 className="text-2xl font-bold text-gray-900">
                          {new Date(date).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </h4>
                        <span className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 px-4 py-2 rounded-full text-lg font-bold border border-blue-200">
                          {dateUsers.length} {dateUsers.length === 1 ? 'participant' : 'participants'}
                        </span>
                      </div>
                      
                      <div className="grid gap-6">
                        {dateUsers.map(user => (
                          <div key={user.id} className="bg-gradient-to-r from-gray-50/80 to-blue-50/80 backdrop-blur-sm p-6 rounded-2xl border border-gray-200/50 shadow-lg">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <h5 className="font-bold text-xl text-gray-900">{user.fullName}</h5>
                                <div className="text-lg text-gray-600 mt-2">
                                  <p>{user.email} • {user.phoneNumber}</p>
                                  <p className="inline-flex items-center mt-1">
                                    <span className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium mr-3 border border-blue-200">
                                      {user.userType}
                                    </span>
                                    Registered: {new Date(user.signupTimestamp).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                              <button
                                onClick={() => setSelectedUser(user)}
                                className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-all bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-xl border border-blue-200 transform hover:scale-105"
                              >
                                <Eye className="w-5 h-5" />
                                <span className="font-medium">View Details</span>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>

        {/* User Details Modal */}
        {selectedUser && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/50">
              <div className="p-8 border-b border-gray-200/50 bg-gradient-to-r from-blue-50/50 to-purple-50/50">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-gray-900">Registration Details</h3>
                  <button
                    onClick={() => setSelectedUser(null)}
                    className="text-gray-400 hover:text-gray-600 transition-colors bg-gray-100 hover:bg-gray-200 p-2 rounded-full"
                  >
                    ✕
                  </button>
                </div>
              </div>
              
              <div className="p-8 space-y-6">
                <div>
                  <label className="text-lg font-bold text-gray-600">Full Name</label>
                  <p className="text-xl text-gray-900 font-medium">{selectedUser.fullName}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-lg font-bold text-gray-600">Email</label>
                    <p className="text-xl text-gray-900">{selectedUser.email}</p>
                  </div>
                  <div>
                    <label className="text-lg font-bold text-gray-600">Phone</label>
                    <p className="text-xl text-gray-900">{selectedUser.phoneNumber}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-lg font-bold text-gray-600">User Type</label>
                    <p className="text-xl text-gray-900">{selectedUser.userType}</p>
                  </div>
                  <div>
                    <label className="text-lg font-bold text-gray-600">Preferred Date</label>
                    <p className="text-xl text-gray-900">
                      {new Date(selectedUser.preferredDate).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
                
                <div>
                  <label className="text-lg font-bold text-gray-600">Reason for Learning AI</label>
                  <p className="text-xl text-gray-900 bg-gradient-to-r from-gray-50 to-blue-50 p-4 rounded-2xl mt-2 border border-gray-200">{selectedUser.reason}</p>
                </div>
                
                <div>
                  <label className="text-lg font-bold text-gray-600">Registration Timestamp</label>
                  <p className="text-xl text-gray-900">
                    {new Date(selectedUser.signupTimestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;