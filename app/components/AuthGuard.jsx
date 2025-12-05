'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import supabase from '@/lib/supabaseClient';

export default function AuthGuard({ children }) {
const router = useRouter();
const pathname = usePathname();
const [checked, setChecked] = useState(false);

  // ログイン不要の公開パス（必要なら追加）
const publicPaths = ['/login', '/register', '/contact'];

useEffect(() => {
    let mounted = true;

    (async () => {
    try {
        const { data } = await supabase.auth.getSession();
        const session = data?.session ?? null;

        // 公開パスならチェック不要
        const isPublic = publicPaths.some(p => pathname?.startsWith(p));

        if (!session && !isPublic) {
          router.push('/login');
          return;
        }

        if (mounted) setChecked(true);
      } catch (err) {
        console.error('AuthGuard error:', err);
        // 問題が起きてもログイン画面へ誘導（安全策）
        if (!publicPaths.some(p => pathname?.startsWith(p))) router.push('/login');
      }
    })();

    // 認証状態の変化を監視（ログアウト時に即リダイレクト）
    const { data: { subscription } = {} } = supabase.auth.onAuthStateChange((event, session) => {
      const isPublic = publicPaths.some(p => pathname?.startsWith(p));
      if (!session && !isPublic) {
        router.push('/login');
      }
    });

    return () => {
      mounted = false;
      if (subscription?.unsubscribe) subscription.unsubscribe();
    };
  }, [pathname, router]);

  // 認証チェック中は何もレンダーしない（必要ならローディングUIに置換）
  if (!checked) return null;

  return <>{children}</>;
}