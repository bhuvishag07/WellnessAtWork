import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Building, Lock, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { useWellness } from '../context/WellnessContext';
import { StickerCard, StickerButton, Pill } from '../components/ui';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, dispatchToast } = useWellness();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('Engineering (Frontend)');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreedPrivacy, setAgreedPrivacy] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Password strength calculation
  const calculateStrength = (pwd) => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return score;
  };

  const strength = calculateStrength(password);
  const strengthLabels = ['Too Weak', 'Weak', 'Fair', 'Strong'];
  const strengthColors = ['bg-rose', 'bg-butter', 'bg-peri', 'bg-sage'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fullName || !email || !department || !password) {
      setError('Please complete all required fields.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!agreedPrivacy) {
      setError('You must agree to the employee confidentiality and privacy fence.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await register({
        fullName,
        email,
        department,
        password
      });

      setLoading(false);
      dispatchToast({
        title: "Account Created! 🎉",
        message: `Welcome to WellnessAtWork, ${fullName.split(' ')[0]}!`,
        type: "success"
      });

      navigate('/dashboard');
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Registration failed. Email may already be in use.');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-6">
      <div className="w-full max-w-lg">
        <StickerCard tone="white" shadow="sticker-lg" className="p-6 sm:p-8 text-left">
          {/* Header */}
          <div className="text-center space-y-2 mb-6">
            <div className="w-12 h-12 border-[3px] border-ink bg-butter flex items-center justify-center mx-auto shadow-[3px_3px_0_#111]">
              <Sparkles className="w-6 h-6 text-ink stroke-[2]" />
            </div>
            <h2 className="text-2xl font-display font-bold text-ink">
              Join WellnessAtWork
            </h2>
            <p className="text-xs text-muted font-medium">
              Empower your workday with healthy micro-habits and team challenges
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 border-[2px] border-ink bg-rose text-ink text-xs font-display font-bold shadow-sticker-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block font-display text-xs font-bold uppercase tracking-wider text-ink mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-ink absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Bhuvisha Manish Gohil"
                  className="w-full pl-10 pr-4 py-2.5 border-[3px] border-ink bg-white shadow-sticker-sm text-xs font-bold text-ink focus:outline-none focus:ring-2 focus:ring-indigo"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-display text-xs font-bold uppercase tracking-wider text-ink mb-1.5">
                  Work Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-ink absolute left-3.5 top-3" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full pl-10 pr-4 py-2.5 border-[3px] border-ink bg-white shadow-sticker-sm text-xs font-bold text-ink focus:outline-none focus:ring-2 focus:ring-indigo"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-display text-xs font-bold uppercase tracking-wider text-ink mb-1.5">
                  Department
                </label>
                <div className="relative">
                  <Building className="w-4 h-4 text-ink absolute left-3.5 top-3" />
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border-[3px] border-ink bg-white shadow-sticker-sm text-xs font-bold text-ink focus:outline-none focus:ring-2 focus:ring-indigo cursor-pointer"
                    required
                  >
                    <option value="Engineering (Frontend)">Engineering (Frontend)</option>
                    <option value="Engineering (Backend)">Engineering (Backend)</option>
                    <option value="Product & Design">Product & Design</option>
                    <option value="Human Resources">Human Resources</option>
                    <option value="Marketing & Growth">Marketing & Growth</option>
                    <option value="Finance & Operations">Finance & Operations</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-display text-xs font-bold uppercase tracking-wider text-ink mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-ink absolute left-3.5 top-3" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-4 py-2.5 border-[3px] border-ink bg-white shadow-sticker-sm text-xs font-bold text-ink focus:outline-none focus:ring-2 focus:ring-indigo"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-display text-xs font-bold uppercase tracking-wider text-ink mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-ink absolute left-3.5 top-3" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-4 py-2.5 border-[3px] border-ink bg-white shadow-sticker-sm text-xs font-bold text-ink focus:outline-none focus:ring-2 focus:ring-indigo"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Password strength meter */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-[11px] font-display font-bold">
                <span className="text-muted">Password Strength</span>
                <span className="text-ink">{strengthLabels[Math.max(0, strength - 1)] || 'Too Weak'}</span>
              </div>
              <div className="grid grid-cols-4 gap-2 h-2.5">
                {[1, 2, 3, 4].map((step) => (
                  <div
                    key={step}
                    className={`border border-ink transition-all duration-300 ${
                      step <= strength ? strengthColors[strength - 1] : 'bg-paper'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Privacy Fence Agreement */}
            <div className="p-3.5 border-[2px] border-ink bg-butter space-y-2 mt-4 shadow-sticker-sm">
              <label className="flex items-start gap-2.5 cursor-pointer text-xs text-ink">
                <input
                  type="checkbox"
                  checked={agreedPrivacy}
                  onChange={(e) => setAgreedPrivacy(e.target.checked)}
                  className="w-4 h-4 border-2 border-ink mt-0.5"
                />
                <span className="leading-relaxed">
                  I agree to the <strong>Employee Confidentiality Charter</strong>. My personal counseling notes and mental health logs remain strictly isolated and can never be accessed by HR or management.
                </span>
              </label>

              <div className="flex items-center gap-1.5 font-display text-[11px] font-bold text-ink pl-6">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>HR-Independent Privacy Guarantee Active</span>
              </div>
            </div>

            <StickerButton
              type="submit"
              variant="primary"
              disabled={loading}
              className="w-full text-xs sm:text-sm py-3 mt-4"
            >
              {loading ? (
                <span>Creating Account...</span>
              ) : (
                <>
                  <span>Create Account & Join Platform</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </StickerButton>
          </form>

          {/* Footer link to login */}
          <p className="text-center font-display text-xs text-muted mt-5">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-ink underline hover:text-indigo">
              Sign In here
            </Link>
          </p>
        </StickerCard>
      </div>
    </div>
  );
};

export default RegisterPage;
