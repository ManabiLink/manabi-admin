import Image from "next/image";
import ProtectedLink from "./components/ProtectedLink";

export default function Home() {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-zinc-50 font-sans bg-white text-black text-aligen center">
      {/* 問い合わせボタンを追加 */}
      <div className="absolute top-4 right-4">
        <ProtectedLink
          href="/feedback"
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          お問い合わせ
        </ProtectedLink>
      </div>
      
      <main className="flex flex-row w-full gap-4 py-32 px-16 bg-white">
        {/* 最近の投稿 */}
        <div className="flex-1 h-[60vh] min-h-[40vh] border-2 border-black rounded-md p-4 flex flex-col justify-between shadow-lg">
          <div>
            <h2 className="text-black text-2xl font-bold border-b pb-2 mb-3">最近の投稿</h2>
            <p className="text-black">ここに最近の投稿が表示されます。</p>
          </div>

          <div className="flex flex-col gap-2">
            <ProtectedLink
              href="/post"
              className="inline-block px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-center"
            >
              記事投稿画面へ
            </ProtectedLink>
          
            <ProtectedLink
              href="/article"
              className="inline-block px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-center"
            >
              申請記事一覧へ
            </ProtectedLink>
          </div>
        </div>

        {/* 新着の質問 */}
        <div className="flex-1 h-[60vh] min-h-[40vh] border-2 border-black rounded-md p-4 flex flex-col justify-between shadow-lg">
          <div>
            <h2 className="text-black text-2xl font-bold border-b pb-2 mb-3">新着の質問</h2>
            <p className="text-black">ここに最近の投稿が表示されます。</p>
          </div>
          <ProtectedLink
            href="/question"
            className="inline-block px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-center"
          >
            質問一覧へ
          </ProtectedLink>
        </div>
        
        {/* 医療関係 */}
        <div className="flex-1 h-[60vh] min-h-[40vh] border-2 border-black rounded-md p-4 flex flex-col justify-between shadow-lg">
          <div>
            <h2 className="text-black text-2xl font-bold border-b pb-2 mb-3">医療関係</h2>
            <p className="text-black">ここに最近の投稿が表示されます。</p>
          </div>
          <ProtectedLink
            href="/medical"
            className="inline-block px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-center"
          >
            医療関係の方はこちら
          </ProtectedLink>
        </div>
      </main>
    </div>
  );
}
