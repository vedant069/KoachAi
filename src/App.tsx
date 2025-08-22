import React, { useState, useEffect } from 'react';
import SignupForm from './components/SignupForm';
import AdminDashboard from './components/AdminDashboard';
import HomePage from './components/HomePage';
import { UserData } from './types/UserData';
import { GraduationCap } from 'lucide-react';

function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'signup' | 'admin' | 'confirmation'>('home');
  const [users, setUsers] = useState<UserData[]>([]);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [confirmedUser, setConfirmedUser] = useState<UserData | null>(null);

  useEffect(() => {
    const savedUsers = localStorage.getItem('koachAIUsers');
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    }
  }, []);

  const handleSignup = (userData: UserData) => {
    const newUsers = [...users, userData];
    setUsers(newUsers);
    localStorage.setItem('aiEducationUsers', JSON.stringify(newUsers));
    setConfirmedUser(userData);
    setCurrentPage('confirmation');
  };

  const handleAdminLogin = (username: string, password: string) => {
    if (username === 'ved' && password === 'ved') {
      setIsAdminAuthenticated(true);
      setCurrentPage('admin');
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    setIsAdminAuthenticated(false);
    setCurrentPage('home');
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigateToSignup={() => setCurrentPage('signup')} onNavigateToAdmin={() => setCurrentPage('admin')} />;
      case 'signup':
        return <SignupForm onSubmit={handleSignup} onBack={() => setCurrentPage('home')} />;
      case 'admin':
        return (
          <AdminDashboard
            users={users}
            isAuthenticated={isAdminAuthenticated}
            onLogin={handleAdminLogin}
            onLogout={handleLogout}
          />
        );
      case 'confirmation':
        return (
          <div className="min-h-screen relative overflow-hidden">
            {/* Dynamic Background with Flowing Curves */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-900 via-emerald-700 to-teal-600">
              {/* Flowing Curve 1 */}
              <div className="absolute top-0 left-0 w-full h-full">
                <svg viewBox="0 0 1200 800" className="absolute inset-0 w-full h-full">
                  <defs>
                    <linearGradient id="confirmGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FCD34D" stopOpacity="0.8" />
                      <stop offset="50%" stopColor="#10B981" stopOpacity="0.6" />
                      <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.4" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M0,200 C300,100 600,300 900,200 C1000,150 1100,250 1200,200 L1200,0 L0,0 Z"
                    fill="url(#confirmGradient1)"
                  />
                </svg>
              </div>
              
              {/* Flowing Curve 2 */}
              <div className="absolute bottom-0 right-0 w-full h-full">
                <svg viewBox="0 0 1200 800" className="absolute inset-0 w-full h-full">
                  <defs>
                    <linearGradient id="confirmGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#10B981" stopOpacity="0.7" />
                      <stop offset="50%" stopColor="#FCD34D" stopOpacity="0.5" />
                      <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.3" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M1200,600 C900,700 600,500 300,600 C200,650 100,550 0,600 L0,800 L1200,800 Z"
                    fill="url(#confirmGradient2)"
                  />
                </svg>
              </div>

              {/* Floating Elements */}
              <div className="absolute top-20 left-20 w-6 h-6 bg-yellow-400 rounded-full opacity-70 animate-pulse"></div>
              <div className="absolute top-40 right-32 w-8 h-8 bg-emerald-400 rounded-full opacity-50 animate-bounce"></div>
              <div className="absolute bottom-32 left-16 w-4 h-4 bg-white rounded-full opacity-60"></div>
              <div className="absolute top-60 left-1/3 w-5 h-5 bg-teal-300 rounded-full opacity-80 animate-pulse"></div>
              <div className="absolute bottom-40 right-20 w-7 h-7 bg-green-300 rounded-full opacity-40"></div>
              <div className="absolute top-32 right-1/4 w-10 h-10 border-3 border-yellow-300 rounded-full opacity-50"></div>
              <div className="absolute bottom-60 left-1/2 w-8 h-8 border-3 border-emerald-400 rounded-full opacity-60"></div>
            </div>

            <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
              <div className="bg-white/15 backdrop-blur-md p-12 rounded-3xl shadow-2xl max-w-lg w-full text-center border border-white/30">
                <div className="bg-gradient-to-r from-green-400 to-emerald-500 p-6 rounded-3xl w-28 h-28 mx-auto mb-8 flex items-center justify-center shadow-2xl">
                  <GraduationCap className="w-14 h-14 text-white" />
                </div>
                <h2 className="text-4xl font-bold text-white mb-6">Registration Confirmed!</h2>
                <p className="text-white/90 mb-8 text-xl leading-relaxed">
                  Thank you for registering for our AI education demo lecture.
                </p>
                {confirmedUser && (
                  <div className="bg-white/20 backdrop-blur-sm p-6 rounded-2xl mb-8 text-left border border-white/40">
                    <h3 className="font-bold text-white mb-4 text-xl">Your Demo Lecture Details:</h3>
                    <div className="space-y-2 text-white/90 text-lg">
                      <p><strong>Date:</strong> {confirmedUser.preferredDate}</p>
                      <p><strong>Time:</strong> 7:00 PM - 8:00 PM</p>
                      <p><strong>Name:</strong> {confirmedUser.fullName}</p>
                    </div>
                  </div>
                )}
                <a
                  href="https://chat.whatsapp.com/HK2CXlBMv9EFOx8w2o8eH2?mode=ems_copy_t" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gradient-to-r from-green-500 via-emerald-600 to-teal-600 text-white px-10 py-5 rounded-2xl hover:from-green-400 hover:via-emerald-500 hover:to-teal-500 transition-all font-bold shadow-2xl transform hover:scale-105 text-lg inline-block"
                >
                  Join WhatsApp Group for Updates
                </a>
              </div>
            </div>
          </div>
        );
      default:
        return <HomePage onNavigateToSignup={() => setCurrentPage('signup')} onNavigateToAdmin={() => setCurrentPage('admin')} />;
    }
  };

  return (
    <div className="font-sans">
      {renderCurrentPage()}
    </div>
  );
}

export default App;