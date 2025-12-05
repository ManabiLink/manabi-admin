'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import supabase from '@/lib/supabaseClient';

export default function Header() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (mounted) {
          setUser(data?.session?.user || null);
          setLoading(false);
        }
      } catch (err) {
        console.error('Header auth check:', err);
        if (mounted) setLoading(false);
      }
    })();

    const { data: { subscription } = {} } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) setUser(session?.user || null);
    });

    return () => {
      mounted = false;
      if (subscription?.unsubscribe) subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.push('/login');
    } catch (err) {
      console.error('Logout error:', err);
      alert('ログアウトに失敗しました。');
    }
  };

  return (
    <header style={{ padding: "1rem", background: "#1a1a1a", display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <h1 className="text-white">Manabi Admin</h1>
      {user && !loading && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span className="text-white text-sm">{user.email}</span>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors font-semibold"
          >
            ログアウト
          </button>
        </div>
      )}
    </header>
  );
}