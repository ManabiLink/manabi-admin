"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import supabase from "../../lib/supabaseClient";

export default function RegisterPage() {
	const router = useRouter();
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirm, setShowConfirm] = useState(false);
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState(null);
	const [error, setError] = useState(null);
	
	// パスワード要件チェック: 大文字・小文字・数字・記号を各1文字以上含むこと
	const passwordRequirements = (pwd) => {
		const checks = {
			hasLower: /[a-z]/.test(pwd),
			hasUpper: /[A-Z]/.test(pwd),
			hasDigit: /\d/.test(pwd),
			hasSymbol: /[!@#$%^&*()\-_=+\[\]{};:'",.<>/?\\|`~]/.test(pwd),
			minLength: pwd.length >= 6,
		};
		return checks;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError(null);
		setMessage(null);

		if (!email) {
			setError("メールアドレスを入力してください。");
			return;
		}
		if (!name) {
			setError("名前を入力してください。");
			return;
		}
		const checks = passwordRequirements(password);
		const missing = [];
		if (!checks.minLength) missing.push("6文字以上");
		if (!checks.hasUpper) missing.push("大文字");
		if (!checks.hasLower) missing.push("小文字");
		if (!checks.hasDigit) missing.push("数字");
		if (!checks.hasSymbol) missing.push("記号");
		if (missing.length) {
			setError(
				`パスワードは次を満たす必要があります: ${missing.join("、")}。`
			);
			return;
		}
		if (password !== confirmPassword) {
			setError("パスワードが一致していません。");
			return;
		}

		setLoading(true);
		try {
			const { error: supaError } = await supabase.auth.signUp(
				{ email, password },
				{ data: { full_name: name } }
			);

			if (supaError) {
				setError(supaError.message || "登録に失敗しました。");
			} else {
				setMessage(
					"登録メールを送信しました。メールのリンクで確認してください。ログイン画面へ移動します。"
				);
				setTimeout(() => router.push("/login"), 1800);
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
				<h1 className="text-2xl font-semibold mb-4">新規登録</h1>

				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label className="block text-sm font-medium mb-1">お名前（任意）</label>
						<input
							value={name}
							onChange={(e) => setName(e.target.value)}
							className="w-full px-3 py-2 border rounded-md focus:outline-none"
							placeholder="例：山田 太郎"
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
						<label className="block text-sm font-medium mb-1">パスワード（再）</label>
						<div className="flex items-center gap-2">
							<input
								type={showConfirm ? "text" : "password"}
								value={confirmPassword}
								onChange={(e) => setConfirmPassword(e.target.value)}
								className="flex-1 px-3 py-2 border rounded-md focus:outline-none"
								placeholder="パスワード（確認）"
							/>
							<button
								type="button"
								onClick={() => setShowConfirm((s) => !s)}
								className="px-3 py-2 border rounded-md text-sm bg-gray-100 hover:bg-gray-200"
								aria-label={showConfirm ? "確認用パスワードを非表示" : "確認用パスワードを表示"}
							>
								{showConfirm ? "非表示" : "表示"}
							</button>
						</div>
					</div>

					<div>
						<label className="block text-sm font-medium mb-1">パスワード</label>
						<div className="text-xs text-gray-600 mb-2">
							※パスワードは6文字以上で、英大文字・英小文字・数字・記号をそれぞれ1文字以上含めてください。
						</div>
						<div className="flex items-center gap-2">
							<input
								type={showPassword ? "text" : "password"}
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								className="flex-1 px-3 py-2 border rounded-md focus:outline-none"
								placeholder="6文字以上のパスワード"
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
							{loading ? "登録中…" : "登録する"}
						</button>
						<Link href="/login" className="text-sm text-blue-600 hover:underline">
							ログインはこちら
						</Link>
					</div>
				</form>
			</div>
		</div>
	);
}

