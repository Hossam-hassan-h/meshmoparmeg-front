import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button, Card, Input } from '../components/UI';
import { Lock, Mail, User, ShieldAlert, LogIn, UserPlus } from 'lucide-react';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const user = await login(email, password);
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/student/dashboard');
      }
    } catch (err) {
      // Error handled in AuthContext toast
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-[#020617] bg-grid-pattern">
      <Card className="w-full max-w-md space-y-6 !p-8 border-[#1E293B]">
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-2xl bg-blue-950/80 text-[#2563EB] border border-blue-500/30 mb-1">
            <LogIn className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-[#F8FAFC]">Welcome Back</h2>
          <p className="text-xs text-[#94A3B8]">Sign in to access your Baccalaureate courses &amp; workspace</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="student@bacdev.edu"
          />

          <Input
            label="Password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />

          <Button variant="primary" size="lg" disabled={submitting} type="submit" className="w-full">
            {submitting ? 'Authenticating...' : 'Sign In'}
          </Button>
        </form>

        <div className="text-center pt-3 border-t border-[#1E293B]">
          <p className="text-xs text-[#94A3B8]">
            Don't have an account?{' '}
            <Link to="/register" className="text-[#06B6D4] font-bold hover:underline">
              Create student account
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
};

export const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await register(name, email, password);
      navigate('/student/dashboard');
    } catch (err) {
      // Error handled in AuthContext toast
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-[#020617] bg-grid-pattern">
      <Card className="w-full max-w-md space-y-6 !p-8 border-[#1E293B]">
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-2xl bg-cyan-950/80 text-[#06B6D4] border border-cyan-500/30 mb-1">
            <UserPlus className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-[#F8FAFC]">Create Student Account</h2>
          <p className="text-xs text-[#94A3B8]">Sign up for Baccalaureate CS programming courses</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Alex Dev"
          />

          <Input
            label="Email Address"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="student@bacdev.edu"
          />

          <Input
            label="Password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />

          <Button variant="primary" size="lg" disabled={submitting} type="submit" className="w-full">
            {submitting ? 'Creating Account...' : 'Register Account'}
          </Button>
        </form>

        <div className="text-center pt-3 border-t border-[#1E293B]">
          <p className="text-xs text-[#94A3B8]">
            Already registered?{' '}
            <Link to="/login" className="text-[#06B6D4] font-bold hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
};
