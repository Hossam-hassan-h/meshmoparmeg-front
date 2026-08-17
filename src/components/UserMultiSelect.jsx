import React, { useState, useMemo } from 'react';
import { Search, X, Check, Users, UserCheck } from 'lucide-react';

const getInitials = (name = '') => {
  const parts = name.trim().split(' ').filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const getAvatarColor = (name = '') => {
  const colors = [
    'from-blue-600 to-indigo-600',
    'from-purple-600 to-pink-600',
    'from-emerald-600 to-teal-600',
    'from-cyan-600 to-blue-600',
    'from-amber-600 to-orange-600',
    'from-rose-600 to-red-600',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

export const UserMultiSelect = ({
  users = [],
  selectedUserIds = [],
  onChange,
  label = 'Select Allowed Students',
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter users by search term (search by name or email)
  const filteredUsers = useMemo(() => {
    if (!searchTerm.trim()) return users;
    const term = searchTerm.toLowerCase().trim();
    return users.filter(
      (u) =>
        (u.name && u.name.toLowerCase().includes(term)) ||
        (u.email && u.email.toLowerCase().includes(term))
    );
  }, [users, searchTerm]);

  // Selected user objects
  const selectedUsers = useMemo(() => {
    return users.filter((u) => selectedUserIds.includes(u._id));
  }, [users, selectedUserIds]);

  const toggleUser = (userId) => {
    if (selectedUserIds.includes(userId)) {
      onChange(selectedUserIds.filter((id) => id !== userId));
    } else {
      onChange([...selectedUserIds, userId]);
    }
  };

  const removeUser = (userId) => {
    onChange(selectedUserIds.filter((id) => id !== userId));
  };

  const selectAllFiltered = () => {
    const filteredIds = filteredUsers.map((u) => u._id);
    const combined = Array.from(new Set([...selectedUserIds, ...filteredIds]));
    onChange(combined);
  };

  const clearAll = () => {
    onChange([]);
  };

  return (
    <div className="space-y-3 w-full text-left">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-[#94A3B8] flex items-center space-x-1.5">
          <Users className="w-4 h-4 text-[#3B82F6]" />
          <span>{label}</span>
        </label>
        <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full bg-[#1E293B] text-[#60A5FA]">
          {selectedUserIds.length} selected
        </span>
      </div>

      {/* Selected Users Chips (Slack / GitHub member picker style) */}
      {selectedUsers.length > 0 && (
        <div className="p-2.5 rounded-xl bg-[#0F172A] border border-[#1E293B] flex flex-wrap gap-2 max-h-36 overflow-y-auto">
          {selectedUsers.map((user) => (
            <span
              key={user._id}
              className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-[#1E293B] text-slate-200 text-xs border border-[#334155] shadow-sm animate-fade-in group hover:border-[#3B82F6] transition-colors"
            >
              <span
                className={`w-5 h-5 rounded-full bg-gradient-to-tr ${getAvatarColor(
                  user.name
                )} text-[10px] font-bold text-white flex items-center justify-center shrink-0 shadow`}
              >
                {getInitials(user.name)}
              </span>
              <span className="font-medium max-w-[120px] truncate">{user.name}</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeUser(user._id);
                }}
                className="p-0.5 rounded text-slate-400 hover:text-red-400 hover:bg-[#334155]/60 transition-colors"
                title={`Remove ${user.name}`}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          ))}

          <button
            type="button"
            onClick={clearAll}
            className="text-[11px] text-slate-400 hover:text-red-400 font-semibold px-2 py-1 underline transition-colors"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          placeholder="Search by student name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#0F172A] border border-[#1E293B] text-[#F8FAFC] placeholder-slate-500 text-xs focus:bg-[#111827] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-500/20 transition-all"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={() => setSearchTerm('')}
            className="p-1 text-slate-400 hover:text-slate-200 absolute right-3 top-1/2 -translate-y-1/2"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* User Candidate List */}
      <div className="border border-[#1E293B] rounded-xl bg-[#0B1120] max-h-52 overflow-y-auto divide-y divide-[#1E293B]/60 shadow-inner">
        {filteredUsers.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-400 space-y-1">
            <p className="font-semibold text-slate-300">No students match your search</p>
            <p className="text-[11px] text-slate-500">Try searching for a different name or email address.</p>
          </div>
        ) : (
          <>
            <div className="px-3 py-1.5 bg-[#0F172A]/80 flex items-center justify-between text-[11px] text-slate-400">
              <span>{filteredUsers.length} student{filteredUsers.length !== 1 ? 's' : ''} available</span>
              {filteredUsers.length > 1 && (
                <button
                  type="button"
                  onClick={selectAllFiltered}
                  className="text-[#60A5FA] hover:text-[#93C5FD] font-semibold hover:underline"
                >
                  Select all matching
                </button>
              )}
            </div>

            {filteredUsers.map((user) => {
              const isSelected = selectedUserIds.includes(user._id);

              return (
                <div
                  key={user._id}
                  onClick={() => toggleUser(user._id)}
                  className={`flex items-center justify-between px-3.5 py-2.5 cursor-pointer select-none transition-colors ${
                    isSelected
                      ? 'bg-blue-950/40 hover:bg-blue-900/50 text-white'
                      : 'hover:bg-[#1E293B]/60 text-slate-300'
                  }`}
                >
                  <div className="flex items-center space-x-3 min-w-0 flex-1 mr-3">
                    <div
                      className={`w-8 h-8 rounded-full bg-gradient-to-tr ${getAvatarColor(
                        user.name
                      )} text-xs font-bold text-white flex items-center justify-center shrink-0 shadow-md`}
                    >
                      {getInitials(user.name)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-xs text-[#F8FAFC] truncate">
                          {user.name}
                        </span>
                        {user.role === 'admin' && (
                          <span className="text-[9px] uppercase font-mono px-1.5 py-0.2 rounded bg-purple-950 text-purple-300 border border-purple-500/30">
                            Admin
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-400 truncate block">
                        {user.email}
                      </span>
                    </div>
                  </div>

                  <div
                    className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 border transition-all ${
                      isSelected
                        ? 'bg-[#2563EB] border-[#3B82F6] text-white shadow'
                        : 'border-[#334155] bg-[#0F172A] text-transparent hover:border-slate-400'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
};

export default UserMultiSelect;
