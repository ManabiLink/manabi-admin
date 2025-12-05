"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import supabase from "@/lib/supabaseClient";

export default function ProtectedLink({ href, children, className = "" }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (mounted) {
          setIsAuthenticated(!!data?.session);
          setLoading(false);
        }
      } catch (err) {
        console.error("Auth check error:", err);
        if (mounted) {
          setIsAuthenticated(false);
          setLoading(false);
        }
      }
    })();

    const { data: { subscription } = {} } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) setIsAuthenticated(!!session);
    });

    return () => {
      mounted = false;
      if (subscription?.unsubscribe) subscription.unsubscribe();
    };
  }, []);

  const handleClick = (e) => {
    if (!isAuthenticated && !loading) {
      e.preventDefault();
      router.push("/"); // ← ここを /login から / に変更
      return;
    }
  };

  if (loading) return <Link href={href} className={className}>{children}</Link>;

  return (
    <Link href={href} onClick={handleClick} className={className}>
      {children}
    </Link>
  );
}
