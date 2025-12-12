//お問い合わせフォームメインページ

"use client";

import React from "react";
import { useRouter } from "next/navigation";

const OpinionPage = () => {
  const router = useRouter();

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom, #FFD4D4 0%, #FFE8F0 100%)",
        padding: "20px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", "Hiragino Sans", "Hiragino Kaku Gothic ProN", Meiryo, sans-serif'
      }}
    >
      <div
        style={{
          background: "white",
          border: "2px solid #999",
          padding: "40px",
          borderRadius: "12px",
          maxWidth: "700px",
          width: "100%",
          textAlign: "center",
          boxShadow: "0 4px 14px rgba(0,0,0,0.15)"
        }}
      >
        {/* 説明文 */}
        <p
          style={{
            fontSize: "18px",
            lineHeight: "1.8",
            color: "#000",
            marginBottom: "40px"
          }}
        >
          こちらは開発者への意見・質問フォームです。<br />
          ご要望があればこちらよりお問い合わせください。
        </p>

        {/* 記入するボタン（青い長方形 ＋ 白文字） */}
        <button
          onClick={() => router.push("/feedback/form")}
          style={{
            background: "#4A79FF",
            color: "white",
            border: "none",
            fontSize: "20px",
            padding: "14px 40px",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "bold",
            transition: "opacity 0.2s"
          }}
          onMouseOver={(e) => (e.target.style.opacity = "0.85")}
          onMouseOut={(e) => (e.target.style.opacity = "1")}
        >
          記入する
        </button>
      </div>
    </div>
  );
};

export default OpinionPage;