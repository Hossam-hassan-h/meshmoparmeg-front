import React from 'react';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  ...props
}) => {
  const baseClass =
    'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] select-none';

  const sizeClasses = {
    sm: 'px-3.5 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3.5 text-base',
  };

  const variantClasses = {
    primary:
      'bg-[#2563EB] hover:bg-[#3B82F6] text-white shadow-lg shadow-blue-600/25 hover:shadow-blue-500/40 border border-blue-500/30',
    secondary:
      'bg-[#0F172A] hover:bg-[#1E293B] text-white border border-[#1E293B] shadow-md shadow-slate-950/40',
    accent:
      'bg-[#06B6D4] hover:bg-[#22D3EE] text-slate-950 font-bold shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/35 border border-cyan-400/30',
    outline:
      'bg-[#111827] hover:bg-[#1E293B] text-[#F8FAFC] border border-[#1E293B] hover:border-slate-600 shadow-sm',
    ghost:
      'bg-transparent hover:bg-[#1E293B] text-[#94A3B8] hover:text-[#F8FAFC]',
    danger:
      'bg-[#EF4444] hover:bg-[#F87171] text-white shadow-md shadow-red-500/20 border border-red-500/30',
  };

  return (
    <button
      disabled={disabled}
      className={`${baseClass} ${sizeClasses[size] || sizeClasses.md} ${variantClasses[variant] || variantClasses.primary} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export const Card = ({ children, className = '', hover = false, ...props }) => {
  return (
    <div
      className={`bg-[#111827] border border-[#1E293B] rounded-2xl p-6 shadow-xl ${
        hover ? 'dark-card-hover' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const Badge = ({ children, variant = 'primary', className = '' }) => {
  const variantClasses = {
    primary: 'bg-blue-950/80 text-[#60A5FA] border-blue-500/30',
    accent: 'bg-cyan-950/80 text-[#06B6D4] border-cyan-500/30',
    secondary: 'bg-slate-800/80 text-[#94A3B8] border-[#1E293B]',
    success: 'bg-emerald-950/80 text-[#22C55E] border-emerald-500/30',
    warning: 'bg-amber-950/80 text-[#F59E0B] border-amber-500/30',
    danger: 'bg-red-950/80 text-[#EF4444] border-red-500/30',
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border tracking-wide uppercase ${
        variantClasses[variant] || variantClasses.primary
      } ${className}`}
    >
      {children}
    </span>
  );
};

export const Input = ({ label, error, className = '', ...props }) => {
  return (
    <div className="space-y-1.5 w-full text-left">
      {label && <label className="text-xs font-semibold text-[#94A3B8]">{label}</label>}
      <input
        className={`w-full px-4 py-2.5 rounded-xl bg-[#0F172A] border border-[#1E293B] text-[#F8FAFC] placeholder-slate-500 text-sm focus:bg-[#111827] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-500/20 transition-all ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-[#EF4444] mt-1">{error}</p>}
    </div>
  );
};

export const Textarea = ({ label, error, className = '', ...props }) => {
  return (
    <div className="space-y-1.5 w-full text-left">
      {label && <label className="text-xs font-semibold text-[#94A3B8]">{label}</label>}
      <textarea
        className={`w-full px-4 py-2.5 rounded-xl bg-[#0F172A] border border-[#1E293B] text-[#F8FAFC] placeholder-slate-500 text-sm focus:bg-[#111827] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-500/20 transition-all ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-[#EF4444] mt-1">{error}</p>}
    </div>
  );
};

export const Select = ({ label, options = [], className = '', ...props }) => {
  return (
    <div className="space-y-1.5 w-full text-left">
      {label && <label className="text-xs font-semibold text-[#94A3B8]">{label}</label>}
      <select
        className={`w-full px-4 py-2.5 rounded-xl bg-[#0F172A] border border-[#1E293B] text-[#F8FAFC] text-sm focus:bg-[#111827] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-500/20 transition-all ${className}`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-[#0F172A] text-[#F8FAFC]">
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#020617]/80 backdrop-blur-md animate-fade-in">
      <div className="bg-[#111827] text-[#F8FAFC] rounded-2xl max-w-xl w-full p-6 border border-[#1E293B] shadow-2xl relative space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
          <h3 className="text-lg font-bold text-[#F8FAFC]">{title}</h3>
          <button
            onClick={onClose}
            className="text-[#94A3B8] hover:text-[#F8FAFC] font-bold p-1 rounded-lg hover:bg-[#1E293B]"
          >
            ✕
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};

export const Skeleton = ({ className = '' }) => {
  return <div className={`animate-pulse bg-[#1E293B] rounded-xl ${className}`}></div>;
};
