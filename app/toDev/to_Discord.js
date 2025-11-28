"use client";

import React, { useState } from "react";

export default function SendToDiscordPage() {
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  const sendToDiscord = async () => {
    if (!message.trim()) {
      alert("メッセージを入力してください");
      return;
    }

    setStatus("送信中...");

    const res = await fetch("/api/sendDiscord", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    const data = await res.json();

    if (res.ok) {
      setStatus("送信完了！");
      setMessage("");
    } else {
      setStatus("エラー: " + data.error);
    }
  };

  return (
    <div style={{ padding: "40px", fontFamily: "sans-serif" }}>
      <h1>Discord 通知テスト</h1>
      
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Discord に送るメッセージ"
        style={{
          width: "100%",
          height: "150px",
          fontSize: "16px",
          padding: "10px",
          marginBottom: "20px",
        }}
      />

      <button
        onClick={sendToDiscord}
        style={{
          padding: "14px 32px",
          background: "linear-gradient(135deg, #6B4CE6 0%, #4A2FBD 100%)",
          color: "white",
          border: "none",
          cursor: "pointer",
          fontSize: "16px"
        }}
      >
        送信
      </button>

      <p style={{ marginTop: "20px", color: "#333" }}>{status}</p>
    </div>
  );
}
