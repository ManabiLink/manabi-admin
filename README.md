# manabi-admin
まなびリンク管理者画面

This is a [Next.js](https://nextjs.org) project with enhanced development error detection.

## 開発中のエラー検知機能

このプロジェクトは、開発中に可能な限りエラーを早期に検知するための設定が施されています。

### 追加された設定ファイル

#### 1. `tsconfig.json`
TypeScriptの厳密な型チェック設定を追加：
- `noUnusedLocals`: 未使用のローカル変数を検知
- `noUnusedParameters`: 未使用のパラメータを検知
- `noFallthroughCasesInSwitch`: switch文のfall-throughを検知
- `noUncheckedIndexedAccess`: インデックスアクセスの安全性チェック
- `noImplicitReturns`: 暗黙的なreturnの検知
- `exactOptionalPropertyTypes`: オプショナルプロパティの厳密なチェック

#### 2. `eslint.config.mjs`
ESLintルールを強化：
- TypeScript関連のエラー検知
- React Hooksのルール検証
- 未使用変数の検知
- コンソールログの警告

#### 3. `.prettierrc`
コードフォーマットの一貫性を保つ設定

#### 4. `.vscode/settings.json`
VS Code での自動保存時のフォーマットとリント実行

#### 5. `next.config.ts`
- React Strict Modeの有効化
- TypeScriptビルドエラーでビルドを停止

### 利用可能なコマンド

```bash
# 開発サーバーの起動
npm run dev

# 型チェックの実行
npm run type-check

# リントの実行
npm run lint

# リントエラーの自動修正
npm run lint:fix

# コードフォーマットの実行
npm run format

# コードフォーマットのチェック
npm run format:check

# すべてのチェックを実行（型チェック + リント + フォーマットチェック）
npm run check

# 本番ビルド
npm run build

# 本番サーバーの起動
npm run start
```

## Getting Started

First, install dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

開発中は常に型チェックとリントが実行され、エラーがあればコンソールに表示されます。

## VS Code Extensions

以下の拡張機能のインストールを推奨します：
- ESLint
- Prettier - Code formatter
- Tailwind CSS IntelliSense

`.vscode/extensions.json` に推奨拡張機能が定義されています。

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [ESLint Documentation](https://eslint.org/docs/latest/)
- [Prettier Documentation](https://prettier.io/docs/en/)
