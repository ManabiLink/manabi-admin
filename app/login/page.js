"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import supabase from "@/lib/supabaseClient";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (!email) {
      setError("メールアドレスを入力してください。");
      return;
    }
    if (!password) {
      setError("パスワードを入力してください。");
      return;
    }

    setLoading(true);
    try {
      // Supabase v2: signInWithPassword
      const { data, error: supaError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (supaError) {
        setError(supaError.message || "ログインに失敗しました。");
      } else if (data?.user) {
        setMessage("ログインしました。リダイレクトしています…");
        setTimeout(() => router.push("/"), 600);
      } else {
        setError("ログインできませんでした。メール確認が必要な場合があります。");
      }
    } catch (err) {
      setError(err.message || "予期せぬエラーが発生しました。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 font-sans p-8">
      <div className="w-full max-w-md border-2 border-black rounded-md bg-white p-6">
        <h1 className="text-2xl font-semibold mb-4">ログイン</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">メールアドレス</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">パスワード</label>
            <div className="flex items-center gap-2">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="flex-1 px-3 py-2 border rounded-md focus:outline-none"
                placeholder="パスワード"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="px-3 py-2 border rounded-md text-sm bg-gray-100 hover:bg-gray-200"
                aria-label={showPassword ? "パスワードを非表示" : "パスワードを表示"}
              >
                {showPassword ? "非表示" : "表示"}
              </button>
            </div>
          </div>

          {error && <div className="text-red-600 text-sm">{error}</div>}
          {message && <div className="text-green-600 text-sm">{message}</div>}

          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              disabled={loading}
            >
              {loading ? "ログイン中…" : "ログイン"}
            </button>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => router.push('/register')}
                className="px-3 py-2 border rounded-md text-sm bg-gray-50 hover:bg-gray-100"
              >
                新規登録へ
              </button>
              {/* <div className="text-sm">
                <Link href="/contact" className="text-blue-600 hover:underline">
                  パスワード再発行
                </Link>
              </div> */}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
