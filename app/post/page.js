// 記事投稿画面

"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import ProtectedLink from "../components/ProtectedLink";

export default function ArticleNew() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isPostingPhase, setIsPostingPhase] = useState(false);
  const [countdown, setCountdown] = useState();
  const countdownRef = useRef(null);
  const [progressPercent, setProgressPercent] = useState(100);

  const isFormValid = title.trim().length > 0 && content.trim().length > 0;

  const handleCancel = () => {
    router.push("/");
  };

  const handleConfirm = () => {
    if (!isFormValid) return;
    setIsPostingPhase(false);
    setCountdown(5);
    setProgressPercent(100);
    setIsConfirmModalOpen(true);
  };

  const handleEdit = () => {
    clearCountdown();
    setIsPostingPhase(false);
    setIsConfirmModalOpen(false);
  };

  const handlePost = () => {
    setIsPostingPhase(true);
    setCountdown(5);
    setProgressPercent(100);
  };

  useEffect(() => {
    if (!isPostingPhase) return;

    const totalMs = 4000;
    const tickMs = 30;
    let elapsed = 0;

    countdownRef.current = window.setInterval(() => {
      elapsed += 1;
      const remainingMs = Math.max(totalMs - elapsed * tickMs, 0);
      const remainingSeconds = Math.ceil(remainingMs / 1000);

      setCountdown(remainingSeconds);
      setProgressPercent((remainingMs / totalMs) * 100);

      if (remainingMs <= 0) {
        clearCountdown();
        router.push("/");
      }
    }, tickMs);

    return () => clearCountdown();
  }, [isPostingPhase]);

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
      <h1 className="text-3xl font-bold mb-8">記事投稿</h1>

      <div className="w-full max-w-2xl flex flex-col gap-6">
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
                (isFormValid ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-300 cursor-not-allowed")
              }
            >
              確認
            </button>
          </div>
        </div>
      </div>

      {isConfirmModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" role="dialog" aria-modal="true">
          {/* ★ 修正：最大高さを固定し、内部スクロール可能に変更 ★ */}
          <div className="bg-white w-full max-w-xl rounded-lg shadow-xl p-6 mx-4 max-h-[80vh] overflow-y-auto">
            {!isPostingPhase ? (
              <div className="flex flex-col gap-4">
                <h2 className="text-lg font-medium">記事はまだ投稿されていません</h2>
                <p className="text-sm text-gray-600">内容を確認し問題なければ「投稿」を押してください。</p>

                <div>
                  <h3 className="font-semibold mt-5">タイトル</h3>
                  <p className="text-gray-700 whitespace-pre-wrap break-words">{title || "（未入力）"}</p>
                </div>

                <div>
                  <h3 className="font-semibold mt-5">内容</h3>
                  <p className="text-gray-700 whitespace-pre-wrap break-words">{content || "（未入力）"}</p>
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
                    disabled={!isFormValid}
                    className={
                      "inline-block px-4 py-2 rounded-md text-white transition-colors " +
                      (isFormValid ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-300 cursor-not-allowed")
                    }
                  >
                    投稿
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <div className="text-center">
                  <h2 className="text-xl font-semibold">ありがとうございます。</h2>
                  <p className="mt-2">投稿が完了しました。</p>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className="h-full bg-blue-500 transition-all duration-100 linear"
                    style={{ width: `${progressPercent}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
