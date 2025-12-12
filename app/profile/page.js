//プロフィール設定画面

"use client";

import { useEffect, useState } from "react";
import supabase from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState({
    full_name: "",
    display_name: "",
    affiliation: "",
    role_title: "",
    specialty: "",
    experience_years: "",
    qualifications: "",
    bio: "",
    contact_public: "",
  });

  useEffect(() => {
    async function loadProfile() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          router.push("/login");
          return;
        }

        const { data, error } = await supabase
          .from("profiles")
          .select("full_name, display_name, affiliation, role_title, specialty, experience_years, qualifications, bio, contact_public")
          .eq("id", user.id)
          .single();

        if (error && error.code !== "PGRST116") {
          // PGRST116 means no rows — ignore
          setError(error.message);
        }

        if (data) setProfile(prev => ({ ...prev, ...data }));
      } catch (err) {
        console.error(err);
        setError(err.message || String(err));
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [router]);

  async function handleSave(e) {
    e?.preventDefault();
    setSaving(true);
    setError(null);
    setMessage(null);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("ユーザーが見つかりません。ログインし直してください。");

      const payload = {
        id: user.id,
        ...profile,
      };

      const { error } = await supabase.from("profiles").upsert(payload, { returning: "minimal" });
      if (error) throw error;

      // プロフィール保存は成功 -> 認証ユーザーの表示名も同期する
      let authUpdateError = null;
      try {
        // Supabase Auth v2: updateUser にメタデータを渡す
        const { error: updateErr } = await supabase.auth.updateUser({ data: { display_name: profile.display_name } });
        if (updateErr) authUpdateError = updateErr;
      } catch (e) {
        authUpdateError = e;
      }

      if (authUpdateError) {
        // プロフィールは保存済みだが、表示名同期だけ失敗した場合はユーザーに伝える
        setMessage("プロフィールを保存しました（表示名の同期に失敗しました）。");
        console.error("display_name sync failed:", authUpdateError);
      } else {
        setMessage("プロフィールを保存しました。");
      }
    } catch (err) {
      console.error(err);
      setError(err.message || String(err));
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center">ロード中…</div>;

  return (
    <main className="max-w-3xl mx-auto p-6">
      <div className="bg-white border rounded-lg shadow p-6">
        <h1 className="text-2xl font-semibold mb-4">専門家プロフィール</h1>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">氏名（実名）</label>
            <input
              className="mt-1 block w-full rounded border px-3 py-2"
              value={profile.full_name}
              onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">表示名（公開用・省略可）</label>
            <input
              className="mt-1 block w-full rounded border px-3 py-2"
              value={profile.display_name}
              onChange={(e) => setProfile({ ...profile, display_name: e.target.value })}
              placeholder="例：山田太郎（やまだ）"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">所属</label>
              <input
                className="mt-1 block w-full rounded border px-3 py-2"
                value={profile.affiliation}
                onChange={(e) => setProfile({ ...profile, affiliation: e.target.value })}
                placeholder="例：◯◯大学、◯◯クリニック"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">役職・肩書</label>
              <input
                className="mt-1 block w-full rounded border px-3 py-2"
                value={profile.role_title}
                onChange={(e) => setProfile({ ...profile, role_title: e.target.value })}
                placeholder="例：臨床心理士、主任相談員"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium">専門領域（カンマ区切りで複数可）</label>
            <input
              className="mt-1 block w-full rounded border px-3 py-2"
              value={profile.specialty}
              onChange={(e) => setProfile({ ...profile, specialty: e.target.value })}
              placeholder="例：発達障害, 言語療法"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">実務経験（年）</label>
              <input
                type="number"
                min="0"
                className="mt-1 block w-full rounded border px-3 py-2"
                value={profile.experience_years}
                onChange={(e) => setProfile({ ...profile, experience_years: e.target.value })}
                placeholder="例：5"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">資格（カンマ区切り）</label>
              <input
                className="mt-1 block w-full rounded border px-3 py-2"
                value={profile.qualifications}
                onChange={(e) => setProfile({ ...profile, qualifications: e.target.value })}
                placeholder="例：臨床心理士, 保健師"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium">自己紹介／専門的な経歴（200〜500字推奨）</label>
            <textarea
              className="mt-1 block w-full rounded border px-3 py-2 min-h-[120px]"
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium">公開連絡先（任意・公開可否を選択）</label>
            <input
              className="mt-1 block w-full rounded border px-3 py-2"
              value={profile.contact_public}
              onChange={(e) => setProfile({ ...profile, contact_public: e.target.value })}
              placeholder="例：メールアドレスや問い合わせフォームのURL"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-60"
              disabled={saving}
            >
              {saving ? "保存中…" : "保存する"}
            </button>

            <button
              type="button"
              className="px-4 py-2 border rounded"
              onClick={() => router.push('/')}
            >
              戻る
            </button>
          </div>

          {message && <p className="text-green-600">{message}</p>}
          {error && <p className="text-red-600">{error}</p>}
        </form>
      </div>

      <div className="text-sm text-gray-500 mt-4">
        <p>※ 資格証や所属証明のアップロード機能を追加できます。運営側での承認フローと連携可能です。</p>
      </div>
    </main>
  );
}
