import React, { useState } from 'react';
import { Menu, X, Leaf, LogIn, LogOut, BookmarkCheck, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isBackendConnected: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  isBackendConnected
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, signInWithGoogle, signOutUser, loading: authLoading } = useAuth();

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'identify', label: 'Identify' },
    { id: 'plants', label: 'Medicinal Plants' },
    { id: 'garden', label: 'My Herbarium' },
    { id: 'architecture', label: 'How It Works' }
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-6">
          
          {/* Zone 1: Single text element wordmark */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2.5 text-left group whitespace-nowrap shrink-0"
          >
            <div className="w-9 h-9 rounded-lg bg-emerald-800 text-white flex items-center justify-center shadow-xs group-hover:bg-emerald-700 transition-colors">
              <Leaf className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-stone-900 group-hover:text-emerald-800 transition-colors">
                HerbVision AI
              </span>
            </div>
          </button>

          {/* Zone 2: Navigation links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-stone-600">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`relative py-1 whitespace-nowrap shrink-0 transition-colors ${
                    isActive
                      ? 'text-emerald-900 font-semibold'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-700 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Firebase Auth & Actions */}
          <div className="hidden sm:flex items-center gap-3 shrink-0">
            <div className="hidden xl:flex items-center gap-1.5 text-xs text-stone-500 font-mono">
              <span className={`w-2 h-2 rounded-full ${isBackendConnected ? 'bg-emerald-500' : 'bg-emerald-400'}`} />
              <span>Firebase Cloud Ready</span>
            </div>

            {/* Google Auth Button or User Menu */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 p-1 pl-2 pr-3 bg-stone-100 hover:bg-stone-200/80 rounded-full border border-stone-200 transition text-xs font-semibold text-stone-800"
                >
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || 'User'}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-emerald-800 text-white flex items-center justify-center text-[10px] font-bold">
                      {user.displayName ? user.displayName[0].toUpperCase() : 'U'}
                    </div>
                  )}
                  <span className="max-w-[100px] truncate">{user.displayName?.split(' ')[0] || 'User'}</span>
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-stone-200 py-2 z-50 text-xs">
                    <div className="px-3 py-2 border-b border-stone-100">
                      <p className="font-semibold text-stone-900 truncate">{user.displayName}</p>
                      <p className="text-[11px] text-stone-500 truncate">{user.email}</p>
                    </div>
                    <button
                      onClick={() => handleNavClick('garden')}
                      className="w-full text-left px-3 py-2 hover:bg-stone-50 flex items-center gap-2 text-stone-700"
                    >
                      <BookmarkCheck className="w-3.5 h-3.5 text-emerald-700" />
                      <span>My Garden & History</span>
                    </button>
                    <button
                      onClick={() => {
                        signOutUser();
                        setUserMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-rose-50 flex items-center gap-2 text-rose-600"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={signInWithGoogle}
                disabled={authLoading}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign in</span>
              </button>
            )}

            <button
              onClick={() => handleNavClick('identify')}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-800 rounded-lg hover:bg-emerald-700 active:scale-98 transition shadow-xs whitespace-nowrap"
            >
              Identify Leaf
            </button>
          </div>

          {/* Mobile hamburger */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-stone-200 bg-white px-4 pt-3 pb-6 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-base font-medium transition-colors ${
                activeTab === item.id
                  ? 'bg-emerald-50 text-emerald-900 font-semibold'
                  : 'text-stone-700 hover:bg-stone-50'
              }`}
            >
              {item.label}
            </button>
          ))}
          <div className="pt-3 border-t border-stone-100 flex flex-col gap-2">
            {user ? (
              <div className="flex items-center justify-between p-2 bg-stone-50 rounded-lg">
                <span className="text-xs font-semibold text-stone-800 truncate">{user.displayName || user.email}</span>
                <button
                  onClick={signOutUser}
                  className="text-xs text-rose-600 font-semibold hover:underline"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={signInWithGoogle}
                className="w-full py-2.5 text-center text-sm font-semibold text-stone-800 bg-stone-100 hover:bg-stone-200 rounded-lg flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign in with Google</span>
              </button>
            )}
            <button
              onClick={() => handleNavClick('identify')}
              className="w-full py-2.5 text-center text-sm font-semibold text-white bg-emerald-800 rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Identify Leaf Now
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
