# 開発中のエラー検知機能について

このドキュメントでは、manabi-admin プロジェクトで実装されている開発中のエラー検知機能について説明します。

## 概要

このプロジェクトは、開発中に可能な限りエラーを早期に検知し、コード品質を向上させるための設定が施されています。

## エラー検知の仕組み

### 1. TypeScript による厳密な型チェック

`tsconfig.json` で以下の厳密な設定を有効化しています：

```json
{
  "strict": true,
  "noUnusedLocals": true,
  "noUnusedParameters": true,
  "noFallthroughCasesInSwitch": true,
  "noUncheckedIndexedAccess": true,
  "noImplicitReturns": true,
  "forceConsistentCasingInFileNames": true,
  "exactOptionalPropertyTypes": true
}
```

#### 検知されるエラーの例

**未使用の変数やパラメータ:**

```typescript
function example(param: string) {
  const unused = "test"; // エラー: 'unused' is declared but its value is never read.
  return "hello";
}
```

**配列やオブジェクトの安全でないインデックスアクセス:**

```typescript
const items = ["a", "b", "c"];
const item = items[10]; // item は string | undefined 型として扱われる
```

**関数の暗黙的な返り値:**

```typescript
function getValue(flag: boolean): string {
  if (flag) {
    return "yes";
  }
  // エラー: Not all code paths return a value.
}
```

### 2. ESLint によるコード品質チェック

`eslint.config.mjs` で以下のルールを設定しています：

#### TypeScript 関連

- `@typescript-eslint/no-unused-vars`: 未使用変数の検知（`_` で始まる変数は除外）
- `@typescript-eslint/no-explicit-any`: `any` 型の使用を警告

#### React 関連

- `react-hooks/rules-of-hooks`: React Hooks のルールを厳密にチェック
- `react-hooks/exhaustive-deps`: useEffect などの依存配列の正確性をチェック

#### 一般的なエラー検知

- `no-console`: console.log の使用を警告（warn と error は許可）
- `prefer-const`: 再代入されない変数は const を使用
- `no-var`: var の使用を禁止

#### 検知されるエラーの例

**React Hooks のルール違反:**

```typescript
function Component({ condition }: { condition: boolean }) {
  if (condition) {
    const [state, setState] = useState(0); // エラー: Hooks はトップレベルでのみ呼び出せます
  }
}
```

**依存配列の不足:**

```typescript
function Component() {
  const [count, setCount] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setTotal(count * 2);
    // 警告: React Hook useEffect has a missing dependency: 'count'
  }, []);
}
```

### 3. Prettier によるコードフォーマット

`.prettierrc` でコードフォーマットルールを定義しています。一貫したコードスタイルを保つことで、不要な差分やスタイル関連のミスを防ぎます。

### 4. Next.js の設定

`next.config.ts` で以下を設定：

- **React Strict Mode**: React の厳密モードを有効化し、潜在的な問題を検知
- **TypeScript Build Errors**: ビルド時に型エラーがあれば失敗させる

### 5. VS Code 統合

`.vscode/settings.json` により、VS Code で以下が自動実行されます：

- ファイル保存時の自動フォーマット
- ファイル保存時の ESLint 自動修正
- TypeScript のリアルタイムエラー表示

## 利用方法

### 開発中のエラー検知

開発サーバーを起動すると、コードを編集するたびに自動的にエラーがチェックされます：

```bash
npm run dev
```

### 手動でのチェック

#### すべてのチェックを実行

```bash
npm run check
```

これは以下を順番に実行します：

1. `npm run type-check` - TypeScript の型チェック
2. `npm run lint` - ESLint によるコード品質チェック
3. `npm run format:check` - Prettier によるフォーマットチェック

#### 個別のチェック

```bash
# 型チェックのみ
npm run type-check

# リントのみ
npm run lint

# リントエラーを自動修正
npm run lint:fix

# コードフォーマット
npm run format

# フォーマットチェックのみ
npm run format:check
```

### ビルド時のエラー検知

本番ビルド時にも自動的にチェックが実行されます：

```bash
npm run build
```

ビルド中に以下がチェックされます：

- TypeScript の型エラー
- ESLint のエラー

エラーがある場合、ビルドは失敗します。

## CI/CD への統合

CI/CD パイプラインで以下のコマンドを実行することを推奨します：

```bash
# すべてのチェックを実行
npm run check

# ビルドを実行（型チェックとリントも含まれる）
npm run build
```

## まとめ

このプロジェクトでは、以下の方法で開発中のエラーを検知しています：

1. **TypeScript**: 型システムによる静的解析
2. **ESLint**: コード品質とベストプラクティスのチェック
3. **Prettier**: コードスタイルの一貫性
4. **React Strict Mode**: React 特有の問題の検知
5. **VS Code 統合**: リアルタイムのフィードバック

これらの設定により、バグを早期に発見し、高品質なコードを維持することができます。
