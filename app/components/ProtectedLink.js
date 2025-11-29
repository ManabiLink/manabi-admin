"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import supabase from "@/lib/supabaseClient";

export default function ProtectedLink({ href, className = "", children, ...props }) {
  const [isAuth, setIsAuth] = useState(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data } = await supabase.auth.getUser();
        if (!mounted) return;
        setIsAuth(!!data?.user);
      } catch (e) {
          if (!mounted) return;
        setIsAuth(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const handleClick = (e) => {
      if (e) e.preventDefault();
    // 認証済みなら目的地へ
    if (isAuth) {
      router.push(href);
      return;
    }

    // 未ログイン時のリダイレクトルール:
    // - ホーム (`/`) からの遷移 -> `/login`
    // - それ以外 -> `/`
    if (pathname !== "/" && pathname !== "/login" && pathname !== "/register") {
      router.push("/");
    } else {
      router.push("/login");
    }
  };

  const disabledClass = "grayscale opacity-70 pointer-events-auto"; // pointer-events-auto so button still clickable
  const combinedClass = `${className} ${isAuth === false ? disabledClass : ""}`.trim();

  if (isAuth) {
    return (
      <Link href={href} className={className} {...props}>
        {children}
      </Link>
    );
  }

  // 未ログイン: 見た目はグレースケールだがクリックでリダイレクト
  return (
    <button type="button" onClick={handleClick} className={combinedClass} {...props}>
      {children}
    </button>
  );
}
