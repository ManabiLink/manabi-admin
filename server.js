const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

app.post("/api/webhook", async (req, res) => {
  console.log("POST /api/webhook received"); // ←デバッグログ
  const { title, kind, content, email, name } = req.body;

  const webhookUrl = process.env.WEBHOOK_URL;

  try {
    const discordRes = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: `タイトル: ${title}\n種別: ${kind}\n内容: ${content}\nメール: ${email}\n名前: ${name}`
      })
    });

    if (!discordRes.ok) {
      console.log("Discord returned error:", discordRes.status);
      return res.status(500).json({ error: "Discord failed" });
    }

    res.json({ ok: true });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: "Server crashed" });
  }
});

app.listen(3001, () => {
  console.log("Running http://localhost:3001/");
});

// 管理用：記事審査通知を Discord 管理WebHookへ送信
app.post("/api/admin/article-review", async (req, res) => {
  try {
    const { id, title, status, author, moderator } = req.body || {};
    if (!id || !title || !status) return res.status(400).json({ error: "Missing fields" });

    const webhookTarget = WEBHOOK_URL_ADMIN || process.env.WEBHOOK_URL;
    if (!webhookTarget) return res.status(500).json({ error: "Admin webhook not configured" });

    const content = [
      "📣 管理者向け通知 — 記事審査",
      `記事ID: ${id}`,
      `タイトル: ${title}`,
      `投稿者: ${author || "不明"}`,
      `審査結果: ${status}`,
      `実行者: ${moderator || "不明"}`,
      `日時: ${new Date().toISOString()}`
    ].join("\n");

    const discordRes = await fetch(webhookTarget, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });

    if (!discordRes.ok) {
      const txt = await discordRes.text().catch(() => "");
      console.error("Discord admin webhook error:", discordRes.status, txt);
      return res.status(502).json({ error: "Failed to send to admin webhook" });
    }

    return res.json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});
