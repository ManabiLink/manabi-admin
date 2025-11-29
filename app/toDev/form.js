//回答フォーム
"use client";

import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";

export default function ContactRouterPage() {
  const pathname = usePathname(); // 現在のURL
  const router = useRouter();

  const [message, setMessage] = useState("");
  const [result, setResult] = useState("");

  // ① /contact → メインページ
  if (pathname === "/contact") {
    return (
      <div style={{ padding: "40px" }}>
        <h1>Contact メインページ</h1>

        <button
          onClick={() => router.push("/contact/to_Discord")}
          style={{
            padding: "12px 24px",
            background: "linear-gradient(135deg, #6B4CE6 0%, #4A2FBD 100%)",
            color: "white",
            border: "none",
            cursor: "pointer",
            marginTop: "20px"
          }}>
          Discord 通知ページへ
        </button>
      </div>
    );
  }

  // ② /contact/to_Discord → Discord通知ページ
  if (pathname === "/contact/to_Discord") {
    const send = () => {
      if (!message.trim()) {
        alert("メッセージを入力してください");
        return;
      }
      setResult("（※ここでDiscordに送信される想定）\n" + message);
      setMessage("");
    };

    return (
      <div style={{ padding: "40px" }}>
        <h1>Discord 通知ページ</h1>

        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Discord に送るメッセージ"
          style={{
            width: "100%",
            height: "150px",
            padding: "10px",
            fontSize: "16px",
            marginTop: "20px",
          }}
        />

        <button
          onClick={send}
          style={{
            padding: "12px 24px",
            marginTop: "20px",
            background: "linear-gradient(135deg, #6B4CE6 0%, #4A2FBD 100%)",
            color: "white",
            border: "none",
            cursor: "pointer"
          }}>
          送信
        </button>

        <button
          onClick={() => router.push("/contact")}
          style={{
            padding: "12px 24px",
            marginTop: "20px",
            marginLeft: "12px",
            background: "white",
            border: "2px solid #999",
            cursor: "pointer"
          }}>
          戻る
        </button>

        <pre style={{ marginTop: "30px", color: "#333" }}>
          {result}
        </pre>
      </div>
    );
  }

  return <div>404 Not Found</div>;
}
