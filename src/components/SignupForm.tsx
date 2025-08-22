import React, { useState } from 'react';
import { UserData } from '../types/UserData';
import { ArrowLeft, ArrowRight, Phone, User, Mail, MessageSquare, Calendar, Globe, Check } from 'lucide-react';
import axios from 'axios';
import { config } from '../config';

interface SignupFormProps {
  onSubmit: (userData: UserData) => void;
  onBack: () => void;
}

const SignupForm: React.FC<SignupFormProps> = ({ onSubmit, onBack }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });
  const [formData, setFormData] = useState({
    fullName: '',
    region: '',
    phoneNumber: '',
    email: '',
    userType: '',
    reason: '',
    customReason: '',
    preferredDate: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const regions = [
    { code: '+1', name: 'United States', flag: '🇺🇸' },
    { code: '+1', name: 'Canada', flag: '🇨🇦' },
    { code: '+44', name: 'United Kingdom', flag: '🇬🇧' },
    { code: '+91', name: 'India', flag: '🇮🇳' },
    { code: '+86', name: 'China', flag: '🇨🇳' },
    { code: '+81', name: 'Japan', flag: '🇯🇵' },
    { code: '+49', name: 'Germany', flag: '🇩🇪' },
    { code: '+33', name: 'France', flag: '🇫🇷' },
    { code: '+61', name: 'Australia', flag: '🇦🇺' },
    { code: '+55', name: 'Brazil', flag: '🇧🇷' }
  ];

  const learningReasons = [
    'Help my child with future career opportunities',
    'Understand AI to guide my family better',
    'Learn about AI for my own career development',
    'Stay updated with technology trends',
    'Understand AI safety and ethics',
    'Help with school projects and homework',
    'Prepare for college and university',
    'General curiosity about artificial intelligence',
    'Others'
  ];

  const generateAvailableDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 1; i <= 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      dates.push({
        value: date.toISOString().split('T')[0],
        label: date.toLocaleDateString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        }),
        shortLabel: date.toLocaleDateString('en-US', { 
          weekday: 'short', 
          month: 'short', 
          day: 'numeric' 
        })
      });
    }
    return dates;
  };

  const availableDates = generateAvailableDates();

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!formData.fullName.trim()) {
          newErrors.fullName = 'Full name is required';
        }
        break;
      case 2:
        if (!formData.region) {
          newErrors.region = 'Please select your region';
        }
        if (!formData.phoneNumber.trim()) {
          newErrors.phoneNumber = 'Phone number is required';
        } else if (!/^[\d\s\-\(\)]{7,}$/.test(formData.phoneNumber.trim())) {
          newErrors.phoneNumber = 'Please enter a valid phone number';
        }
        break;
      case 3:
        if (!formData.email.trim()) {
          newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
          newErrors.email = 'Please enter a valid email address';
        }
        if (!formData.userType) {
          newErrors.userType = 'Please select your role';
        }
        break;
      case 4:
        if (!formData.reason) {
          newErrors.reason = 'Please select a reason';
        }
        if (formData.reason === 'Others' && !formData.customReason.trim()) {
          newErrors.customReason = 'Please specify your reason';
        }
        break;
      case 5:
        if (!formData.preferredDate) {
          newErrors.preferredDate = 'Please select a preferred date';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    if (validateStep(5)) {
      setIsSubmitting(true);
      setSubmissionStatus({ type: null, message: '' });
      
      const userData: UserData = {
        ...formData,
        userType: formData.userType as "" | "Parent" | "Student" | "Guardian",
        reason: formData.reason === 'Others' ? formData.customReason : formData.reason,
        phoneNumber: `${formData.region} ${formData.phoneNumber}`,
        signupTimestamp: new Date().toISOString(),
        id: Date.now().toString()
      };
      
      try {
        // Send data to Google Sheets immediately upon registration
        const apiUrl = config.getApiUrl('/api/google-sheets');
        const response = await axios.post(apiUrl, {
          data: [userData] // Send as array with single user
          // sheetUrl is now configured in backend .env file
        });
        
        // Check if WhatsApp was sent successfully
        const whatsappSent = response.data.whatsapp?.enabled && 
                           response.data.whatsapp?.results?.length > 0 && 
                           response.data.whatsapp.results[0]?.success;
        
        setSubmissionStatus({
          type: 'success',
          message: whatsappSent 
            ? 'Registration successful! Your data has been saved and WhatsApp confirmation sent! 📱'
            : 'Registration successful! Your data has been saved.'
        });
        
        // Call the original onSubmit to update local state
        onSubmit(userData);
        
      } catch (error) {
        console.error('Error saving registration to Google Sheets:', error);
        setSubmissionStatus({
          type: 'error',
          message: 'Registration saved locally, but failed to sync with Google Sheets. We\'ll try again later.'
        });
        
        // Still call onSubmit to save locally even if Google Sheets fails
        onSubmit(userData);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return "Let's start with your name";
      case 2: return "Your contact information";
      case 3: return "Tell us about yourself";
      case 4: return "Why AI interests you";
      case 5: return "Choose your demo date";
      default: return "";
    }
  };

  const getStepDescription = () => {
    switch (currentStep) {
      case 1: return "We'd love to know what to call you during our sessions";
      case 2: return "We'll use this to send you session reminders and updates";
      case 3: return "This helps us tailor the content to your needs";
      case 4: return "Understanding your motivation helps us customize your learning experience";
      case 5: return "Pick a date that works best for your schedule";
      default: return "";
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Professional Background with Subtle Gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-800 to-indigo-900">
        {/* Subtle Flowing Curve 1 */}
        <div className="absolute top-0 left-0 w-full h-full">
          <svg viewBox="0 0 1200 800" className="absolute inset-0 w-full h-full">
            <defs>
              <linearGradient id="signupGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.6" />
                <stop offset="50%" stopColor="#2563EB" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#4F46E5" stopOpacity="0.2" />
              </linearGradient>
            </defs>
            <path
              d="M0,150 C200,50 400,250 600,150 C800,50 1000,200 1200,100 L1200,0 L0,0 Z"
              fill="url(#signupGradient1)"
            />
          </svg>
        </div>
        
        {/* Subtle Flowing Curve 2 */}
        <div className="absolute bottom-0 right-0 w-full h-full">
          <svg viewBox="0 0 1200 800" className="absolute inset-0 w-full h-full">
            <defs>
              <linearGradient id="signupGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1E40AF" stopOpacity="0.5" />
                <stop offset="50%" stopColor="#3730A3" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#4F46E5" stopOpacity="0.2" />
              </linearGradient>
            </defs>
            <path
              d="M1200,650 C1000,750 800,550 600,650 C400,750 200,600 0,700 L0,800 L1200,800 Z"
              fill="url(#signupGradient2)"
            />
          </svg>
        </div>

        {/* Minimal Floating Elements */}
        <div className="absolute top-20 left-20 w-4 h-4 bg-blue-300 rounded-full opacity-40 animate-pulse"></div>
        <div className="absolute bottom-32 left-16 w-3 h-3 bg-white rounded-full opacity-30"></div>
        <div className="absolute top-60 left-1/3 w-2 h-2 bg-indigo-300 rounded-full opacity-40 animate-pulse"></div>
        <div className="absolute bottom-40 right-20 w-5 h-5 bg-blue-200 rounded-full opacity-20"></div>
      </div>

      <div className="relative z-10 py-8 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={onBack}
              className="flex items-center space-x-2 text-white/90 hover:text-white transition-all mb-6 bg-white/15 backdrop-blur-md px-6 py-3 rounded-full border border-white/30 hover:bg-white/25 transform hover:scale-105"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Home</span>
            </button>
            
            {/* Progress Bar */}
            <div className="bg-white/15 backdrop-blur-md p-8 rounded-3xl shadow-2xl mb-6 border border-white/30">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold text-white">KOACH AI Learning Platform</h1>
                <span className="text-sm text-white/80 bg-gradient-to-r from-blue-400/20 to-indigo-500/20 backdrop-blur-sm px-4 py-2 rounded-full border border-blue-400/30">
                  Step {currentStep} of 5
                </span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-4 shadow-inner">
                <div 
                  className="bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600 h-4 rounded-full transition-all duration-700 shadow-lg relative overflow-hidden"
                  style={{ width: `${(currentStep / 5) * 100}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Content */}
          <div className="bg-white/15 backdrop-blur-md p-10 rounded-3xl shadow-2xl border border-white/30">
            <div className="text-center mb-10">
              <h2 className="text-5xl font-bold text-white mb-4 leading-tight">{getStepTitle()}</h2>
              <p className="text-white/90 text-xl leading-relaxed">{getStepDescription()}</p>
            </div>

            {/* Step 1: Full Name */}
            {currentStep === 1 && (
              <div className="space-y-8">
                <div>
                  <label htmlFor="fullName" className="flex items-center space-x-3 text-lg font-medium text-white/95 mb-4">
                    <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-2 rounded-lg">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <span>Full Name</span>
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => handleChange('fullName', e.target.value)}
                    className={`w-full px-8 py-5 rounded-2xl border-2 focus:outline-none focus:ring-0 transition-all text-xl bg-white/95 backdrop-blur-sm placeholder-gray-500 ${
                      errors.fullName 
                        ? 'border-red-400 focus:border-red-500 shadow-red-200/50' 
                        : 'border-white/40 focus:border-yellow-400 focus:bg-white hover:bg-white shadow-lg'
                    }`}
                    placeholder="Enter your full name"
                  />
                  {errors.fullName && <p className="text-red-200 text-lg mt-3 bg-red-500/30 backdrop-blur-sm p-3 rounded-xl border border-red-400/50">{errors.fullName}</p>}
                </div>
              </div>
            )}

            {/* Step 2: Phone Number with Region */}
            {currentStep === 2 && (
              <div className="space-y-8">
                <div>
                  <label className="flex items-center space-x-3 text-lg font-medium text-white/95 mb-4">
                    <div className="bg-gradient-to-r from-cyan-400 to-blue-500 p-2 rounded-lg">
                      <Globe className="w-6 h-6 text-white" />
                    </div>
                    <span>Select Your Region</span>
                  </label>
                  <select
                    value={formData.region}
                    onChange={(e) => handleChange('region', e.target.value)}
                    className={`w-full px-8 py-5 rounded-2xl border-2 focus:outline-none focus:ring-0 transition-all text-xl bg-white/95 backdrop-blur-sm ${
                      errors.region 
                        ? 'border-red-400 focus:border-red-500 shadow-red-200/50' 
                        : 'border-white/40 focus:border-cyan-400 focus:bg-white hover:bg-white shadow-lg'
                    }`}
                  >
                    <option value="">Choose your country/region</option>
                    {regions.map((region, index) => (
                      <option key={index} value={region.code}>
                        {region.flag} {region.name} ({region.code})
                      </option>
                    ))}
                  </select>
                  {errors.region && <p className="text-red-200 text-lg mt-3 bg-red-500/30 backdrop-blur-sm p-3 rounded-xl border border-red-400/50">{errors.region}</p>}
                </div>

                <div>
                  <label htmlFor="phoneNumber" className="flex items-center space-x-3 text-lg font-medium text-white/95 mb-4">
                    <div className="bg-gradient-to-r from-cyan-400 to-blue-500 p-2 rounded-lg">
                      <Phone className="w-6 h-6 text-white" />
                    </div>
                    <span>Phone Number</span>
                  </label>
                  <div className="flex shadow-lg rounded-2xl overflow-hidden">
                    <div className="bg-white/80 backdrop-blur-sm px-6 py-5 border-2 border-r-0 border-white/40 flex items-center">
                      <span className="text-gray-700 font-bold text-xl">{formData.region || '+--'}</span>
                    </div>
                    <input
                      type="tel"
                      id="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={(e) => handleChange('phoneNumber', e.target.value)}
                      className={`flex-1 px-8 py-5 border-2 focus:outline-none focus:ring-0 transition-all text-xl bg-white/95 backdrop-blur-sm placeholder-gray-500 ${
                        errors.phoneNumber 
                          ? 'border-red-400 focus:border-red-500' 
                          : 'border-white/40 focus:border-cyan-400 focus:bg-white hover:bg-white'
                      }`}
                      placeholder="Enter your phone number"
                    />
                  </div>
                  {errors.phoneNumber && <p className="text-red-200 text-lg mt-3 bg-red-500/30 backdrop-blur-sm p-3 rounded-xl border border-red-400/50">{errors.phoneNumber}</p>}
                </div>
              </div>
            )}

            {/* Step 3: Email and User Type */}
            {currentStep === 3 && (
              <div className="space-y-8">
                <div>
                  <label htmlFor="email" className="flex items-center space-x-3 text-lg font-medium text-white/95 mb-4">
                    <div className="bg-gradient-to-r from-blue-400 to-purple-500 p-2 rounded-lg">
                      <Mail className="w-6 h-6 text-white" />
                    </div>
                    <span>Email Address</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className={`w-full px-8 py-5 rounded-2xl border-2 focus:outline-none focus:ring-0 transition-all text-xl bg-white/95 backdrop-blur-sm placeholder-gray-500 shadow-lg ${
                      errors.email 
                        ? 'border-red-400 focus:border-red-500 shadow-red-200/50' 
                        : 'border-white/40 focus:border-blue-400 focus:bg-white hover:bg-white'
                    }`}
                    placeholder="Enter your email address"
                  />
                  {errors.email && <p className="text-red-200 text-lg mt-3 bg-red-500/30 backdrop-blur-sm p-3 rounded-xl border border-red-400/50">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-lg font-medium text-white/95 mb-6">
                    I am a...
                  </label>
                  <div className="grid grid-cols-1 gap-4">
                    {['Parent', 'Student', 'Guardian'].map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => handleChange('userType', type)}
                        className={`p-6 rounded-2xl border-2 text-left transition-all transform hover:scale-105 backdrop-blur-sm shadow-lg ${
                          formData.userType === type
                            ? 'border-blue-400 bg-gradient-to-r from-blue-500/40 to-purple-500/40 text-white shadow-blue-500/30'
                            : 'border-white/40 bg-white/15 text-white/95 hover:border-white/60 hover:bg-white/25'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xl">{type}</span>
                          {formData.userType === type && (
                            <div className="bg-blue-400 p-1 rounded-full">
                              <Check className="w-5 h-5 text-white" />
                            </div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                  {errors.userType && <p className="text-red-200 text-lg mt-3 bg-red-500/30 backdrop-blur-sm p-3 rounded-xl border border-red-400/50">{errors.userType}</p>}
                </div>
              </div>
            )}

            {/* Step 4: Learning Reasons */}
            {currentStep === 4 && (
              <div className="space-y-8">
                <div>
                  <label className="flex items-center space-x-3 text-lg font-medium text-white/95 mb-6">
                    <div className="bg-gradient-to-r from-purple-400 to-pink-500 p-2 rounded-lg">
                      <MessageSquare className="w-6 h-6 text-white" />
                    </div>
                    <span>Why do you want to learn about AI?</span>
                  </label>
                  <div className="grid grid-cols-1 gap-4 max-h-96 overflow-y-auto pr-2">
                    {learningReasons.map((reason) => (
                      <button
                        key={reason}
                        type="button"
                        onClick={() => handleChange('reason', reason)}
                        className={`p-5 rounded-2xl border-2 text-left transition-all transform hover:scale-105 backdrop-blur-sm shadow-lg ${
                          formData.reason === reason
                            ? 'border-purple-400 bg-gradient-to-r from-purple-500/40 to-pink-500/40 text-white shadow-purple-500/30'
                            : 'border-white/40 bg-white/15 text-white/95 hover:border-white/60 hover:bg-white/25'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-lg">{reason}</span>
                          {formData.reason === reason && (
                            <div className="bg-purple-400 p-1 rounded-full">
                              <Check className="w-5 h-5 text-white" />
                            </div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                  {errors.reason && <p className="text-red-200 text-lg mt-3 bg-red-500/30 backdrop-blur-sm p-3 rounded-xl border border-red-400/50">{errors.reason}</p>}
                </div>

                {formData.reason === 'Others' && (
                  <div>
                    <label htmlFor="customReason" className="block text-lg font-medium text-white/95 mb-4">
                      Please specify your reason
                    </label>
                    <textarea
                      id="customReason"
                      rows={4}
                      value={formData.customReason}
                      onChange={(e) => handleChange('customReason', e.target.value)}
                      className={`w-full px-8 py-5 rounded-2xl border-2 focus:outline-none focus:ring-0 transition-all resize-vertical bg-white/95 backdrop-blur-sm placeholder-gray-500 text-lg shadow-lg ${
                        errors.customReason 
                          ? 'border-red-400 focus:border-red-500 shadow-red-200/50' 
                          : 'border-white/40 focus:border-purple-400 focus:bg-white hover:bg-white'
                      }`}
                      placeholder="Tell us what interests you about AI..."
                    />
                    {errors.customReason && <p className="text-red-200 text-lg mt-3 bg-red-500/30 backdrop-blur-sm p-3 rounded-xl border border-red-400/50">{errors.customReason}</p>}
                  </div>
                )}
              </div>
            )}

            {/* Step 5: Date Selection */}
            {currentStep === 5 && (
              <div className="space-y-8">
                <div>
                  <label className="flex items-center space-x-3 text-lg font-medium text-white/95 mb-6">
                    <div className="bg-gradient-to-r from-green-400 to-emerald-500 p-2 rounded-lg">
                      <Calendar className="w-6 h-6 text-white" />
                    </div>
                    <span>Choose Your Demo Lecture Date</span>
                  </label>
                  <div className="grid grid-cols-1 gap-4">
                    {availableDates.map(date => (
                      <button
                        key={date.value}
                        type="button"
                        onClick={() => handleChange('preferredDate', date.value)}
                        className={`p-6 rounded-2xl border-2 text-left transition-all transform hover:scale-105 backdrop-blur-sm shadow-lg ${
                          formData.preferredDate === date.value
                            ? 'border-green-400 bg-gradient-to-r from-green-500/40 to-emerald-500/40 text-white shadow-green-500/30'
                            : 'border-white/40 bg-white/15 text-white/95 hover:border-white/60 hover:bg-white/25'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-bold text-xl">{date.label}</div>
                            <div className="text-lg text-white/80 mt-1">7:00 PM - 8:00 PM</div>
                          </div>
                          {formData.preferredDate === date.value && (
                            <div className="bg-green-400 p-2 rounded-full">
                              <Check className="w-6 h-6 text-white" />
                            </div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                  {errors.preferredDate && <p className="text-red-200 text-lg mt-3 bg-red-500/30 backdrop-blur-sm p-3 rounded-xl border border-red-400/50">{errors.preferredDate}</p>}
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center pt-10">
              {currentStep > 1 ? (
                <button
                  onClick={handlePrevious}
                  className="flex items-center space-x-3 px-8 py-4 text-white/90 hover:text-white transition-all bg-white/15 backdrop-blur-sm rounded-2xl border border-white/30 hover:bg-white/25 transform hover:scale-105 shadow-lg"
                >
                  <ArrowLeft className="w-6 h-6" />
                  <span className="font-medium text-lg">Previous</span>
                </button>
              ) : (
                <div></div>
              )}

              {currentStep < 5 ? (
                <button
                  onClick={handleNext}
                  className="flex items-center space-x-3 bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 text-white px-10 py-5 rounded-2xl hover:from-yellow-300 hover:via-orange-400 hover:to-pink-400 transition-all transform hover:scale-105 font-bold shadow-2xl text-lg"
                >
                  <span>Next</span>
                  <ArrowRight className="w-6 h-6" />
                </button>
              ) : (
                <div className="space-y-4">
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className={`bg-gradient-to-r from-green-500 via-emerald-600 to-teal-600 text-white px-10 py-5 rounded-2xl hover:from-green-400 hover:via-emerald-500 hover:to-teal-500 transition-all transform hover:scale-105 font-bold shadow-2xl text-lg ${
                      isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {isSubmitting ? 'Saving Registration...' : 'Complete Registration'}
                  </button>
                  
{submissionStatus.type === 'success' && (
  <div className="mt-6 text-center">
    <p className="mb-2 text-green-700 font-semibold">
      Registration complete! 🎉
    </p>
    <a
      href="https://chat.whatsapp.com/XXXXXXXXXXXXXXX" // <-- your group link here
      target="_blank"
      rel="noopener noreferrer"
      className="inline-block bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-lg font-medium"
    >
      Join our WhatsApp class group
    </a>
    <p className="mt-2 text-xs text-gray-500">
      Tap above to join the KOACH AI Learning Platform group for updates and classes.
    </p>
  </div>
)}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;