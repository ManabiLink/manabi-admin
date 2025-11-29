# manabi-admin（日本語補足）

このファイルは `README.md` の補足として、ローカルでの起動方法や `server.js` の使い方、Supabase の導入手順を日本語でまとめたものです。

---

## 1) ローカルでの基本手順

1. 依存関係をインストール

```bash
npm install
```

2. 開発サーバーを起動

```bash
npm run dev
```

3. ブラウザで開く

```
http://localhost:3000
```

---

## 2) `server.js` の使い方

- リポジトリルートに `server.js` がある場合、カスタムサーバーとして使われることがあります。基本的な起動は:

```bash
node server.js
```

- `server.js` の中でポートやオプションを参照していることがあるため、必要に応じて中身を確認してください。

---

## 3) Supabase の依存追加と設定

Supabase を使う場合はクライアントライブラリを追加します。

```bash
npm install @supabase/supabase-js
```

### 環境変数の設定

`.env.local` に次を追加してください（値は Supabase のダッシュボードで取得）。

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### クライアント初期化例 (`lib/supabaseClient.js`)

```javascript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
```

アプリ内では `import supabase from '@/lib/supabaseClient'` のように利用します。

---

## 4) Supabase Auth の利用に関する注意

- クライアント側でログインやユーザー取得を行う際は `supabase.auth` を使用します。
- サービスロールキーや管理者権限が必要な処理はサーバー側（API route）で実行してください。

---

## 5) よく使うコマンド

- 依存インストール: `npm install`
- 開発サーバー: `npm run dev`
- ビルド: `npm run build`
- 本番開始: `npm start`（`package.json` に依存）

---

## 6) テーブル例（参考）

今回の `expert_requests` テーブルの例:

```sql
create table expert_requests (
  id bigint generated always as identity primary key,
  name text not null,
  affiliation text,
  email text not null,
  message text,
  status text default 'pending',
  created_at timestamp default now()
);
```

---

## 7) 追加サポート

- `server.js` の中身を共有いただければ、README 本体に具体例を追記します。
- Supabase の RLS、承認フロー、通知（メール/Discord）などの運用フロー実装も支援できます。
