"use client";

import { useState } from "react";
import Link from "next/link";
import supabase from "@/lib/supabaseClient";

export default function ExpertRequestPage() {
	const [name, setName] = useState("");
	const [affiliation, setAffiliation] = useState("");
	const [email, setEmail] = useState("");
	const [message, setMessage] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [notice, setNotice] = useState(null);
	const [submitted, setSubmitted] = useState(false);
	const [submittedMessage, setSubmittedMessage] = useState("");

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError(null);
		setNotice(null);

		if (!name.trim()) {
			setError("名前を入力してください。");
			return;
		}
		if (!email.trim()) {
			setError("メールアドレスを入力してください。");
			return;
		}
		if (!message.trim()) {
			setError("メッセージを入力してください。");
			return;
		}

		setLoading(true);
		try {
			const payload = {
				name: name.trim(),
				affiliation: affiliation.trim() || null,
				email: email.trim(),
				message: message.trim(),
			};

			// 既に同じメールでリクエストが存在するか確認
			const { data: existing, error: fetchError } = await supabase
				.from("expert_requests")
				.select("id,status,created_at")
				.eq("email", payload.email)
				.maybeSingle();

			if (fetchError) {
				setError(fetchError.message || "既存チェックに失敗しました。");
				setLoading(false);
				return;
			}

			if (existing) {
				// 既にリクエスト済みの場合はフォームを隠して案内を表示
				setSubmittedMessage("このメールアドレスですでにリクエストが送信されています。確認のため少々お待ちください。");
				setSubmitted(true);
				setLoading(false);
				return;
			}

			const { error: supaError } = await supabase
				.from("expert_requests")
				.insert([payload]);

			if (supaError) {
				setError(supaError.message || "送信に失敗しました。");
			} else {
				// 成功時はサンクス画面を表示（検証に時間がかかる旨を案内）
				setSubmittedMessage("ご登録ありがとうございます。本人確認のため１週間ほどお時間を頂戴いたします。");
				setSubmitted(true);
				setName("");
				setAffiliation("");
				setEmail("");
				setMessage("");
			}
		} catch (err) {
			setError(err.message || "予期せぬエラーが発生しました。");
		} finally {
			setLoading(false);
		}
	};

	if (submitted) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-zinc-50 font-sans p-8">
				<div className="w-full max-w-md border-2 border-black rounded-md bg-white p-6">
					<h1 className="text-2xl font-semibold mb-4">送信完了</h1>
					<p className="text-sm text-gray-700 mb-4">{submittedMessage}</p>
					<div className="flex justify-end">
						<Link href="/" className="text-sm text-blue-600 hover:underline">ホームへ戻る</Link>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-zinc-50 font-sans p-8">
			<div className="w-full max-w-md border-2 border-black rounded-md bg-white p-6">
				<h1 className="text-2xl font-semibold mb-4">専門家リクエスト</h1>

				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label className="block text-sm font-medium mb-1">お名前</label>
						<input
							value={name}
							onChange={(e) => setName(e.target.value)}
							className="w-full px-3 py-2 border rounded-md focus:outline-none"
							placeholder="例：山田 太郎"
						/>
					</div>

					<div>
						<label className="block text-sm font-medium mb-1">所属（任意）</label>
						<input
							value={affiliation}
							onChange={(e) => setAffiliation(e.target.value)}
							className="w-full px-3 py-2 border rounded-md focus:outline-none"
							placeholder="例：○○大学 / △△研究所"
						/>
					</div>

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
						<label className="block text-sm font-medium mb-1">メッセージ</label>
						<textarea
							value={message}
							onChange={(e) => setMessage(e.target.value)}
							className="w-full px-3 py-2 border rounded-md focus:outline-none"
							placeholder="ご希望の内容や自己紹介などを入力してください。"
							rows={5}
						/>
					</div>

					{error && <div className="text-red-600 text-sm">{error}</div>}
					{notice && <div className="text-green-600 text-sm">{notice}</div>}

					<div className="flex items-center justify-between">
						<button
							type="submit"
							className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
							disabled={loading}
						>
							{loading ? "送信中…" : "リクエストを送信する"}
						</button>
						<Link href="/" className="text-sm text-blue-600 hover:underline">
							ホームへ戻る
						</Link>
					</div>
				</form>
			</div>
		</div>
	);
}

