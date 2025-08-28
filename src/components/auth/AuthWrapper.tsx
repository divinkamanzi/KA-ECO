import React, { useState } from 'react';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';

export function AuthWrapper() {
  const [isLogin, setIsLogin] = useState(true);

  const toggleMode = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="w-full max-w-md">
        {/* Ka-Eco Branding */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-600 text-white">
              <svg
                className="h-8 w-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 7.89a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Ka-Eco</h1>
              <p className="text-sm text-gray-600">Urban Wetlands Monitoring</p>
            </div>
          </div>
          <p className="text-gray-600 max-w-sm mx-auto">
            Monitor, analyze, and visualize real-time environmental data for sustainable wetland management in Rwanda
          </p>
        </div>

        {/* Auth Forms */}
        {isLogin ? (
          <LoginForm onToggleMode={toggleMode} />
        ) : (
          <RegisterForm onToggleMode={toggleMode} />
        )}

        {/* Project Info */}
        <div className="mt-8 text-center text-xs text-gray-500">
          <p>Developed by Kamanzi Divin</p>
          <p>Mount Kenya University</p>
        </div>
      </div>
    </div>
  );
}