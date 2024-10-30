"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const username = formData.get('username');
    const password = formData.get('password');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        router.push('/mmm/dashboard');
      } else {
        setError('Invalid credentials');
      }
    } catch {
      setError('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--smoky-black)]">
      <div className="w-full max-w-md p-8 bg-[var(--eerie-black-2)] rounded-xl border border-[var(--jet)]">
        <h2 className="text-2xl font-bold mb-6 text-[var(--white-2)]">Admin Login</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500 rounded text-red-500">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              name="username"
              placeholder="Username"
              required
              className="w-full p-3 bg-[var(--onyx)] border border-[var(--jet)] rounded-lg 
              text-[var(--white-2)] placeholder-[var(--light-gray-70)]
              focus:outline-none focus:border-[var(--orange-yellow-crayola)]"
            />
          </div>
          
          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              required
              className="w-full p-3 bg-[var(--onyx)] border border-[var(--jet)] rounded-lg 
              text-[var(--white-2)] placeholder-[var(--light-gray-70)]
              focus:outline-none focus:border-[var(--orange-yellow-crayola)]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full p-3 rounded-lg bg-gradient-to-r from-[var(--orange-yellow-crayola)] 
            to-[var(--vegas-gold)] text-[var(--smoky-black)] font-medium
            hover:opacity-90 transition-opacity
            disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {loading ? 'Loading...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}