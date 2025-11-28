"use client";

import { useState } from "react";

export default function ContactPage() {
  const [feedback, setFeedback] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback("");

    const data = {
      role: "user", // ★ユーザー/管理者を切り替えられる
      title: e.target.title.value,
      kind: e.target.kind.value,
      content: e.target.content.value,
      email: e.target.email.value,
      name: e.target.name.value || "匿名",
    };

    try {
      const res = await fetch("http://localhost:3001/api/webhook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setFeedback("♡ 送信完了！Discordに届いたよ ♡");
        e.target.reset();
      } else {
        setFeedback("サーバー通知に失敗しました💦");
      }
    } catch (err) {
      console.error(err);
      setFeedback("通信エラーが発生しました💦");
    }
  };

  return (
    <div style={styles.body}>
      <div style={styles.container}>
        <h1 style={styles.h1}>きゅるん♡お問い合わせ</h1>

        <form onSubmit={handleSubmit}>
          <div style={styles.group}>
            <label style={styles.label}>タイトル</label>
            <input type="text" name="title" required placeholder="タイトルを入力してね♡" style={styles.input} />
          </div>

          <div style={styles.group}>
            <label style={styles.label}>種別</label>
            <select name="kind" required style={styles.input}>
              <option value="">選択してね♡</option>
              <option value="質問">💬 質問</option>
              <option value="要望">🌈 要望</option>
              <option value="不具合報告">🐞 不具合報告</option>
              <option value="その他">🎀 その他</option>
            </select>
          </div>

          <div style={styles.group}>
            <label style={styles.label}>本文</label>
            <textarea name="content" required placeholder="本文を入力してね♡" style={styles.textarea}></textarea>
          </div>

          <div style={styles.group}>
            <label style={styles.label}>メールアドレス</label>
            <input type="email" name="email" required placeholder="example@mail.com" style={styles.input} />
          </div>

          <div style={styles.group}>
            <label style={styles.label}>名前（任意）</label>
            <input type="text" name="name" placeholder="匿名でもOK♡" style={styles.input} />
          </div>

          <button type="submit" style={styles.button}>💌 送信する</button>

          <p style={{ ...styles.feedback, color: "#ff69b4" }}>{feedback}</p>
        </form>
      </div>
    </div>
  );
}

// 🎀 インライン CSS（HTML の style をそのまま移植）
const styles = {
  body: {
    margin: 0,
    fontFamily: '"Zen Maru Gothic","Noto Sans JP",sans-serif',
    background: "linear-gradient(180deg,#ffeaf5,#fff5f8,#fff)",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    background: "rgba(255,255,255,0.95)",
    borderRadius: "25px",
    padding: "40px 50px",
    width: "90%",
    maxWidth: "520px",
    boxShadow: "0 8px 30px rgba(255,150,180,0.25)",
  },
  h1: {
    color: "#ff69b4",
    textAlign: "center",
    marginBottom: "15px",
  },
  group: { marginBottom: "15px" },
  label: { display: "block", fontWeight: "bold", color: "#ff5fa0", marginBottom: "5px" },
  input: {
    width: "100%",
    padding: "10px",
    borderRadius: "12px",
    border: "2px solid #ffd6e8",
    fontSize: "1rem",
    transition: "0.2s",
  },
  textarea: {
    width: "100%",
    padding: "10px",
    height: "100px",
    borderRadius: "12px",
    border: "2px solid #ffd6e8",
    fontSize: "1rem",
    resize: "none",
  },
  button: {
    background: "linear-gradient(180deg,#ffb7e2,#ff7ecf)",
    color: "white",
    fontWeight: "bold",
    padding: "12px",
    border: "none",
    borderRadius: "20px",
    width: "100%",
    fontSize: "1.1rem",
    cursor: "pointer",
  },
  feedback: {
    marginTop: "10px",
    textAlign: "center",
    minHeight: "20px",
    fontWeight: "bold",
  },
};
