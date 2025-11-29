"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function DevFormPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [mail, setMail] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isSent, setIsSent] = useState(false);

  // 必須項目のエラー状態
  const [errors, setErrors] = useState({
    name: false,
    mail: false,
    title: false,
    content: false
  });

  // Discord送信
  async function sendToDiscord(name, company, mail, title, content) {
    const WEBHOOK_URL = "【あなたのWebhookURL】";

    const body = {
      content:
        `📩 **新しいお問い合わせが届きました**\n\n` +
        `**お名前:** ${name}\n` +
        `**会社・団体名:** ${company || "（未入力）"}\n` +
        `**メール:** ${mail}\n` +
        `**タイトル:** ${title}\n` +
        `**内容:**\n${content}`
    };

    await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
  }

  // ▼ 確認タブを開く前に必須チェック
  const handleOpenConfirm = () => {
    const newErrors = {
      name: name.trim() === "",
      mail: mail.trim() === "",
      title: title.trim() === "",
      content: content.trim() === ""
    };

    setErrors(newErrors);

    // 1つでもエラーがあればモーダルを開かない
    if (Object.values(newErrors).includes(true)) return;

    setIsConfirmOpen(true);
  };

  const handleCloseConfirm = () => setIsConfirmOpen(false);

  const handleSend = async () => {
    console.log("送信完了(仮)");

    await sendToDiscord(name, company, mail, title, content);
    setIsSent(true);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "40px",
        background: "linear-gradient(to bottom, #FFD4D4 0%, #FFE8F0 100%)",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", "Hiragino Sans", "Hiragino Kaku Gothic ProN", Meiryo, sans-serif',
        position: "relative"
      }}
    >
      <div
        style={{
          margin: "0 auto",
          background: "white",
          borderRadius: "12px",
          padding: "40px",
          maxWidth: "700px",
          boxShadow: "0 4px 14px rgba(0,0,0,0.15)"
        }}
      >
        <h1 style={{ textAlign: "center", marginBottom: "30px" }}>
          意見・質問フォーム
        </h1>

        <FormInput
          label="お名前"
          required
          value={name}
          setValue={setName}
          type="text"
          error={errors.name}
        />

        <FormInput
          label="会社・団体名"
          value={company}
          setValue={setCompany}
          type="text"
        />

        <FormInput
          label="メールアドレス"
          required
          value={mail}
          setValue={setMail}
          type="email"
          error={errors.mail}
        />

        <FormInput
          label="タイトル"
          required
          value={title}
          setValue={setTitle}
          type="text"
          error={errors.title}
        />

        <div style={{ marginBottom: "25px" }}>
          <label
            style={{
              fontWeight: "bold",
              fontSize: "18px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "8px"
            }}
          >
            内容
            {/* 必須マーク */}
            <span
              style={{
                background: "red",
                color: "white",
                padding: "2px 6px",
                borderRadius: "4px",
                fontSize: "12px"
              }}
            >
              必須
            </span>
          </label>

          <textarea
            placeholder="内容を入力"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            style={{
              width: "100%",
              height: "160px",
              padding: "12px",
              fontSize: "16px",
              border: errors.content ? "2px solid red" : "1px solid #ccc",
              borderRadius: "6px",
              resize: "vertical"
            }}
          />

          {errors.content && (
            <p style={{ color: "red", fontSize: "13px", marginTop: "6px" }}>
              こちらの内容は必須項目です
            </p>
          )}
        </div>

        <button
          style={{
            width: "100%",
            background: "#4A79FF",
            color: "white",
            padding: "14px",
            border: "none",
            borderRadius: "8px",
            fontSize: "18px",
            fontWeight: "bold",
            cursor: "pointer",
            marginTop: "10px",
            transition: "opacity 0.2s"
          }}
          onMouseOver={(e) => (e.target.style.opacity = "0.85")}
          onMouseOut={(e) => (e.target.style.opacity = "1")}
          onClick={handleOpenConfirm}
        >
          送信する
        </button>
      </div>

      {/* ▼▼▼ モーダル表示 ▼▼▼ */}
      {isConfirmOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "20px",
            zIndex: 1000
          }}
        >
          <div
            style={{
              background: "white",
              padding: "30px",
              borderRadius: "12px",
              maxWidth: "600px",
              width: "100%",
              boxShadow: "0 8px 20px rgba(0,0,0,0.25)",
              position: "relative"
            }}
          >
            {isSent ? (
              <>
                <h2
                  style={{
                    marginBottom: "20px",
                    fontSize: "22px",
                    textAlign: "center"
                  }}
                >
                  送信が完了しました。
                </h2>

                <p
                  style={{
                    fontSize: "16px",
                    textAlign: "center",
                    lineHeight: "1.8",
                    whiteSpace: "pre-wrap"
                  }}
                >
                  {`数日以内にご返信いたしますので、\nしばらくお待ちください。`}
                </p>

                <button
                  onClick={() => router.push("/feedback")}
                  style={{
                    position: "absolute",
                    right: "20px",
                    bottom: "20px",
                    padding: "10px 26px",
                    background: "#4A79FF",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "16px"
                  }}
                >
                  確認
                </button>
              </>
            ) : (
              <>
                <h2
                  style={{
                    marginBottom: "20px",
                    fontSize: "22px",
                    textAlign: "center"
                  }}
                >
                  こちらの内容でよろしいですか
                </h2>

                <ConfirmItem label="お名前" value={name} />
                <ConfirmItem label="会社・団体名" value={company} />
                <ConfirmItem label="メールアドレス" value={mail} />
                <ConfirmItem label="タイトル" value={title} />
                <ConfirmItem label="内容" value={content} isTextArea />

                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "20px",
                    marginTop: "30px"
                  }}
                >
                  <button
                    onClick={handleCloseConfirm}
                    style={{
                      padding: "12px 30px",
                      background: "white",
                      border: "2px solid #666",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontSize: "16px"
                    }}
                  >
                    修正
                  </button>

                  <button
                    onClick={handleSend}
                    style={{
                      padding: "12px 30px",
                      background: "#4A79FF",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontSize: "16px"
                    }}
                  >
                    送信
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------------------ */
function FormInput({ label, value, setValue, type, required, error }) {
  return (
    <div style={{ marginBottom: "25px" }}>
      <label
        style={{
          fontWeight: "bold",
          fontSize: "18px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginBottom: "8px"
        }}
      >
        {label}
        {required && label !== "会社・団体名" && (
          <span
            style={{
              background: "red",
              color: "white",
              padding: "2px 6px",
              borderRadius: "4px",
              fontSize: "12px"
            }}
          >
            必須
          </span>
        )}
      </label>

      <input
        type={type}
        value={value}
        placeholder={`${label} を入力`}
        onChange={(e) => setValue(e.target.value)}
        style={{
          width: "100%",
          padding: "10px 12px",
          fontSize: "16px",
          border: error ? "2px solid red" : "1px solid #ccc",
          borderRadius: "6px"
        }}
      />

      {error && (
        <p style={{ color: "red", fontSize: "13px", marginTop: "6px" }}>
          こちらの内容は必須項目です
        </p>
      )}
    </div>
  );
}

/* ------------------------ */
function ConfirmItem({ label, value, isTextArea }) {
  return (
    <div style={{ marginBottom: "18px" }}>
      <div
        style={{
          fontWeight: "bold",
          fontSize: "16px",
          marginBottom: "4px"
        }}
      >
        {label}
      </div>

      <div
        style={{
          padding: "10px",
          minHeight: isTextArea ? "80px" : "40px",
          border: "1px solid #aaa",
          borderRadius: "6px",
          background: "#f9f9f9",
          whiteSpace: "pre-wrap"
        }}
      >
        {value || "（未入力）"}
      </div>
    </div>
  );
}
