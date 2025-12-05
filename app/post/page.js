// 記事投稿画面
"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import ProtectedLink from "../components/ProtectedLink";

export default function ArticleNew() {
  const router = useRouter();

  // form state
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // モーダル表示管理
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  // 投稿処理フロー（モーダル内）
  const [isPostingPhase, setIsPostingPhase] = useState(false); // true -> 成功メッセージ表示＆カウント開始
  const [countdown, setCountdown] = useState(); // 秒

  // ❌ useRef<number | null> は JS ではエラーになる → 修正
  const countdownRef = useRef(null);

  // プログレス（パーセンテージ）
  const [progressPercent, setProgressPercent] = useState(100);

  // バリデーション
  const isFormValid = title.trim().length > 0 && content.trim().length > 0;

  // Cancel ボタン: /app に遷移
  const handleCancel = () => {
    router.push("/app"); // ← リダイレクト先指定
  };

  // 確認ボタン
  const handleConfirm = () => {
    if (!isFormValid) return;
    setIsPostingPhase(false);
    setCountdown(5);
    setProgressPercent(100);
    setIsConfirmModalOpen(true);
  };

  // 修正ボタン
  const handleEdit = () => {
    clearCountdown();
    setIsPostingPhase(false);
    setIsConfirmModalOpen(false);
  };

  // 投稿ボタン
  const handlePost = () => {
    setIsPostingPhase(true);
    setCountdown(5);
    setProgressPercent(100);
  };

  // カウントダウン処理
  useEffect(() => {
    if (!isPostingPhase) return;

    const totalMs = 5000;
    const tickMs = 100;
    let elapsed = 0;

    countdownRef.current = window.setInterval(() => {
      elapsed += 1;
      const remainingMs = Math.max(totalMs - elapsed * tickMs, 0);
      const remainingSeconds = Math.ceil(remainingMs / 1000);

      setCountdown(remainingSeconds);
      setProgressPercent((remainingMs / totalMs) * 100);

      // 0 秒でリダイレクト
      if (remainingMs <= 0) {
        clearCountdown();

        // ここでリダイレクト（/app 固定）
        router.push("/app"); // ←★★ リダイレクト先を /app に指定 ★★
      }
    }, tickMs);

    return () => clearCountdown();
  }, [isPostingPhase]);

  // interval 停止
  const clearCountdown = () => {
    if (countdownRef.current !== null) {
      window.clearInterval(countdownRef.current);
      countdownRef.current = null;
    }
  };

  useEffect(() => {
    return () => clearCountdown();
  }, []);

  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-white text-black px-6 py-10">
      {/* 一番上のタイトル */}
      <h1 className="text-3xl font-bold mb-8">記事投稿</h1>

      <div className="w-full max-w-2xl flex flex-col gap-6">

        {/* タイトル入力 */}
        <div className="flex flex-col gap-2">
          <label className="text-lg font-medium">タイトル</label>
          <input
            type="text"
            placeholder="タイトルを入力"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border border-gray-400 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* 内容入力 */}
        <div className="flex flex-col gap-2">
          <label className="text-lg font-medium">内容</label>
          <textarea
            placeholder="内容を入力"
            rows={8}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="border border-gray-400 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* ボタン群 */}
        <div className="flex justify-end">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleCancel}
              className="inline-block px-4 py-2 bg-white text-black border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              キャンセル
            </button>

            <button
              type="button"
              onClick={handleConfirm}
              disabled={!isFormValid}
              className={
                "inline-block px-4 py-2 rounded-md text-white transition-colors " +
                (isFormValid
                  ? "bg-blue-500 hover:bg-blue-600"
                  : "bg-gray-300 cursor-not-allowed")
              }
            >
              確認
            </button>
          </div>
        </div>
      </div>

      {/* モーダル */}
      {isConfirmModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white w-full max-w-xl rounded-lg shadow-xl p-6 mx-4">
            {!isPostingPhase ? (
              <div className="flex flex-col gap-4">
                <h2 className="text-lg font-medium">まだ記事は投稿されていません</h2>

                <div>
                  <h3 className="font-semibold">タイトル</h3>
                  <p className="mt-1 text-gray-700 whitespace-pre-wrap">{title || "（未入力）"}</p>
                </div>

                <div>
                  <h3 className="font-semibold">内容</h3>
                  <p className="mt-1 text-gray-700 whitespace-pre-wrap">{content || "（未入力）"}</p>
                </div>

                <div className="flex justify-end gap-3 mt-4">
                  <button
                    type="button"
                    onClick={handleEdit}
                    className="inline-block px-4 py-2 bg-white text-black border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    修正
                  </button>

                  <button
                    type="button"
                    onClick={handlePost}
                    className={
                      "inline-block px-4 py-2 rounded-md text-white transition-colors " +
                      (isFormValid ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-300 cursor-not-allowed")
                    }
                    disabled={!isFormValid}
                  >
                    投稿
                  </button>
                </div>
              </div>
            ) : (
              // 投稿完了 → カウントダウン → /app リダイレクト
              <div className="flex flex-col gap-4">
                <div className="text-center">
                  <h2 className="text-xl font-semibold">ありがとうございます。</h2>
                  <p className="mt-2">投稿が完了しました。</p>
                </div>

                <div className="text-center text-sm text-gray-600">
                  リダイレクトまであと {countdown} 秒
                </div>

                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className="h-full bg-blue-500 transition-all duration-100 linear"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
