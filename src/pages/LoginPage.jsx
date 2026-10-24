import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Sparkles, Shield } from 'lucide-react';
import { useWellness } from '../context/WellnessContext';
import { StickerCard, StickerButton } from '../components/ui';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { dispatchToast, login } = useWellness();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in both email and password.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const data = await login(email, password, rememberMe);
      setLoading(false);
      dispatchToast({
        title: `Welcome Back, ${data.user?.fullName?.split(' ')[0] || 'there'}! 👋`,
        message: "Successfully signed into WellnessAtWork.",
        type: "success"
      });
      if (data.user?.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Invalid email or password.');
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-6">
      <div className="w-full max-w-md">
        <StickerCard tone="white" shadow="sticker-lg" className="p-6 sm:p-8">
          {/* Header */}
          <div className="text-center space-y-2 mb-6">
            <div className="w-12 h-12 border-[3px] border-ink bg-butter flex items-center justify-center mx-auto shadow-[3px_3px_0_#111]">
              <Sparkles className="w-6 h-6 text-ink stroke-[2]" />
            </div>
            <h2 className="text-2xl font-display font-bold text-ink">
              Sign in to WellnessAtWork
            </h2>
            <p className="text-xs text-muted font-medium">
              Enter your corporate credentials to continue your wellness journey
            </p>
          </div>

          {/* SSO Options */}
          <div className="space-y-2 mb-3">
            <button
              type="button"
              disabled
              aria-disabled="true"
              title="Enterprise Google Workspace SSO requires corporate SAML/OAuth configuration."
              className="w-full py-2.5 px-4 border-[2px] border-ink bg-stone-100 text-xs font-display font-bold text-ink/60 flex items-center justify-between opacity-70 cursor-not-allowed select-none"
            >
              <div className="flex items-center gap-3">
                <svg className="w-4 h-4 opacity-75" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.04h3.88c2.28-2.09 3.66-5.17 3.66-9.14z"/>
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.04c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.13C3.27 21.43 7.35 24 12 24z"/>
                  <path fill="#FBBC05" d="M5.28 14.28c-.25-.72-.38-1.49-.38-2.28s.13-1.56.38-2.28V6.59H1.25C.45 8.19 0 10.03 0 12s.45 3.81 1.25 5.41l4.03-3.13z"/>
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.27 2.57 1.25 6.59l4.03 3.13c.95-2.83 3.6-4.97 6.72-4.97z"/>
                </svg>
                <span>Continue with Google Workspace</span>
              </div>
              <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 border border-ink/40 bg-white text-muted">
                IdP Required
              </span>
            </button>

            <button
              type="button"
              disabled
              aria-disabled="true"
              title="Enterprise Microsoft 365 SSO requires corporate Azure AD/Entra ID configuration."
              className="w-full py-2.5 px-4 border-[2px] border-ink bg-stone-100 text-xs font-display font-bold text-ink/60 flex items-center justify-between opacity-70 cursor-not-allowed select-none"
            >
              <div className="flex items-center gap-3">
                <svg className="w-4 h-4 opacity-75" viewBox="0 0 21 21">
                  <rect x="1" y="1" width="9" height="9" fill="#f25022"/>
                  <rect x="11" y="1" width="9" height="9" fill="#7fba00"/>
                  <rect x="1" y="11" width="9" height="9" fill="#00a4ef"/>
                  <rect x="11" y="11" width="9" height="9" fill="#ffb900"/>
                </svg>
                <span>Continue with Microsoft 365</span>
              </div>
              <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 border border-ink/40 bg-white text-muted">
                IdP Required
              </span>
            </button>
            <p className="text-[10px] text-muted text-center pt-1 font-medium">
              Enterprise SSO is currently disabled (Corporate IdP required). Please sign in with your corporate email below.
            </p>
          </div>

          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-[2px] border-dashed border-ink/40" />
            </div>
            <div className="relative flex justify-center text-[10px] font-display uppercase tracking-wider font-bold">
              <span className="bg-white px-3 text-muted">
                Or sign in with work email
              </span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            {error && (
              <div className="p-3 border-[2px] border-ink bg-rose text-ink text-xs font-display font-bold">
                {error}
              </div>
            )}

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
              <div className="flex items-center justify-between mb-1.5">
                <label className="font-display text-xs font-bold uppercase tracking-wider text-ink">
                  Password
                </label>
                <a
                  href="#forgot"
                  onClick={(e) => {
                    e.preventDefault();
                    dispatchToast({
                      title: "Password Reset Requested",
                      message: "Password reset instructions sent to your corporate email.",
                      type: "info"
                    });
                  }}
                  className="font-display text-[11px] font-bold text-ink underline hover:text-indigo"
                >
                  Forgot Password?
                </a>
              </div>
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

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-ink font-medium">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 border-2 border-ink"
                />
                <span>Remember on this device</span>
              </label>

              <span className="font-display text-[11px] text-ink font-bold flex items-center gap-1">
                <Shield className="w-3.5 h-3.5" />
                SSO Encrypted
              </span>
            </div>

            <StickerButton
              type="submit"
              variant="primary"
              disabled={loading}
              className="w-full text-xs sm:text-sm py-3 mt-2"
            >
              {loading ? (
                <span>Signing in...</span>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </StickerButton>
          </form>

          {/* Footer link to register */}
          <p className="text-center font-display text-xs text-muted mt-5">
            New employee?{' '}
            <Link to="/register" className="font-bold text-ink underline hover:text-indigo">
              Create an Account
            </Link>
          </p>
        </StickerCard>
      </div>
    </div>
  );
};

export default LoginPage;
