import React from 'react';
import { Brain, Users, Clock, Star, ArrowRight, Shield } from 'lucide-react';

interface HomePageProps {
  onNavigateToSignup: () => void;
  onNavigateToAdmin: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ onNavigateToSignup, onNavigateToAdmin }) => {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Parent of 16-year-old",
      content: "This program helped my daughter understand AI in ways that school never could. The practical approach made all the difference!",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "Father of twins (14 & 16)",
      content: "As a non-tech parent, I was worried about being left behind. Now both my kids and I feel confident about AI's role in our future.",
      rating: 5
    },
    {
      name: "Emma Rodriguez",
      role: "High School Student",
      content: "Finally, someone explained AI without all the confusing technical jargon. I actually understand how it works now!",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Dynamic Background with Flowing Curves */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-700 to-blue-600">
        {/* Flowing Curve 1 */}
        <div className="absolute top-0 left-0 w-full h-full">
          <svg viewBox="0 0 1200 800" className="absolute inset-0 w-full h-full">
            <defs>
              <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FCD34D" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#06B6D4" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.4" />
              </linearGradient>
            </defs>
            <path
              d="M0,200 C300,100 600,300 900,200 C1000,150 1100,250 1200,200 L1200,0 L0,0 Z"
              fill="url(#gradient1)"
            />
          </svg>
        </div>
        
        {/* Flowing Curve 2 */}
        <div className="absolute bottom-0 right-0 w-full h-full">
          <svg viewBox="0 0 1200 800" className="absolute inset-0 w-full h-full">
            <defs>
              <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.7" />
                <stop offset="50%" stopColor="#FCD34D" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.3" />
              </linearGradient>
            </defs>
            <path
              d="M1200,600 C900,700 600,500 300,600 C200,650 100,550 0,600 L0,800 L1200,800 Z"
              fill="url(#gradient2)"
            />
          </svg>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-20 w-4 h-4 bg-yellow-400 rounded-full opacity-60 animate-pulse"></div>
        <div className="absolute top-40 right-32 w-6 h-6 bg-cyan-400 rounded-full opacity-40 animate-bounce"></div>
        <div className="absolute bottom-32 left-16 w-3 h-3 bg-white rounded-full opacity-50"></div>
        <div className="absolute top-60 left-1/3 w-2 h-2 bg-yellow-300 rounded-full opacity-70 animate-pulse"></div>
        <div className="absolute bottom-40 right-20 w-5 h-5 bg-blue-300 rounded-full opacity-30"></div>
        <div className="absolute top-32 right-1/4 w-8 h-8 border-2 border-cyan-300 rounded-full opacity-40"></div>
        <div className="absolute bottom-60 left-1/2 w-6 h-6 border-2 border-yellow-400 rounded-full opacity-50"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 backdrop-blur-md p-2 rounded-lg border border-white/30">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">KOACH</h1>
              <p className="text-sm text-white/80">For Teenagers & Parents</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={onNavigateToAdmin}
              className="bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-full border border-white/30 hover:bg-white/30 transition-all text-sm"
            >
              ADMIN
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-6xl font-bold text-white mb-6 leading-tight">
            KOACH AI LEARNING
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">PLATFORM</span>
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
            Join thousands of teenagers and parents who've discovered that artificial intelligence 
            doesn't have to be intimidating. Our expert-led sessions make AI accessible, 
            practical, and relevant to your daily life.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <button
              onClick={onNavigateToSignup}
              className="bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 px-8 py-4 rounded-full hover:from-yellow-300 hover:to-orange-400 transition-all transform hover:scale-105 shadow-lg flex items-center space-x-2 text-lg font-bold"
            >
              <span>Get Started</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <div className="flex items-center space-x-2 text-white/80">
              <Clock className="w-5 h-5" />
              <span>Daily sessions: 7:00 PM - 8:00 PM</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-16 bg-white/5 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4">
          <h3 className="text-4xl font-bold text-center text-white mb-12">
            Why Choose KOACH AI Learning Platform?
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/15 transition-all transform hover:scale-105">
              <div className="bg-gradient-to-r from-cyan-400 to-blue-500 p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                <Users className="w-10 h-10 text-white" />
              </div>
              <h4 className="text-2xl font-bold text-white mb-4">Family-Friendly Approach</h4>
              <p className="text-white/80 text-lg">
                Designed specifically for teenagers and parents with no technical background. 
                We speak your language, not tech jargon.
              </p>
            </div>
            <div className="text-center p-8 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/15 transition-all transform hover:scale-105">
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                <Brain className="w-10 h-10 text-white" />
              </div>
              <h4 className="text-2xl font-bold text-white mb-4">Practical Learning</h4>
              <p className="text-white/80 text-lg">
                Real-world examples and hands-on activities that show how AI impacts your 
                daily life, from social media to future careers.
              </p>
            </div>
            <div className="text-center p-8 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/15 transition-all transform hover:scale-105">
              <div className="bg-gradient-to-r from-purple-400 to-pink-500 p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <h4 className="text-2xl font-bold text-white mb-4">Safe & Trusted</h4>
              <p className="text-white/80 text-lg">
                Expert instruction in a secure environment. We prioritize your family's 
                privacy and create a comfortable learning space.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative z-10 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h3 className="text-4xl font-bold text-center text-white mb-12">
            What Families Are Saying
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-white/20 hover:bg-white/15 transition-all transform hover:scale-105">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-white/90 mb-6 italic text-lg">"{testimonial.content}"</p>
                <div>
                  <p className="font-bold text-white text-lg">{testimonial.name}</p>
                  <p className="text-white/70">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h3 className="text-4xl font-bold mb-6 text-white">Ready to Start Your AI Journey?</h3>
          <p className="text-xl mb-8 text-white/90">
            Join our community of learners and discover how AI can enhance your family's future. 
            No prerequisites needed – just curiosity and an open mind.
          </p>
          <button
            onClick={onNavigateToSignup}
            className="bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 px-10 py-5 rounded-full hover:from-yellow-300 hover:to-orange-400 transition-all font-bold text-xl shadow-2xl hover:shadow-3xl transform hover:scale-105"
          >
            Reserve Your Spot Today
          </button>
          <p className="text-sm mt-6 text-white/70">Free demo session • No commitment required</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-black/20 backdrop-blur-md border-t border-white/20 text-white py-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="bg-gradient-to-r from-cyan-400 to-blue-500 p-3 rounded-lg">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <span className="text-2xl font-bold">KOACH</span>
          </div>
          <p className="text-white/80 mb-6 text-lg">
            Empowering families with AI knowledge for a better tomorrow.
          </p>
          <p className="text-white/60">
            © 2025 KOACH AI Learning Platform. Making AI accessible to everyone.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;