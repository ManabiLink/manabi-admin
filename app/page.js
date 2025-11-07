import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-zinc-50 font-sans bg-white text-black text-aligen center">
      {/* 問い合わせボタンを追加 */}
      <div className="absolute top-4 right-4">
        <Link 
          href="/contact" 
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          お問い合わせ
        </Link>
      </div>
      
      <main className="flex flex-row w-full gap-4 py-32 px-16 bg-white">
        <div className="flex-1 h-[60vh] min-h-[40vh] border-2 border-black rounded-md p-4 flex flex-col justify-between">
          <div>
            <h2>最近の投稿</h2>
            <p>ここに最近の投稿が表示されます。</p>
          </div>
          <Link 
            href="/article" 
            className="inline-block px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-center"
          >
            記事一覧へ
          </Link>
        </div>
        
        <div className="flex-1 h-[60vh] min-h-[40vh] border-2 border-black rounded-md p-4 flex flex-col justify-between">
          <div>
            <h2>新着の質問</h2>
            <p>ここに最近の投稿が表示されます。</p>
          </div>
          <Link 
            href="/question" 
            className="inline-block px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-center"
          >
            質問一覧へ
          </Link>
        </div>
        
        <div className="flex-1 h-[60vh] min-h-[40vh] border-2 border-black rounded-md p-4 flex flex-col justify-between">
          <div>
            <h2>医療関係</h2>
            <p>ここに最近の投稿が表示されます。</p>
          </div>
          <Link 
            href="/medical" 
            className="inline-block px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-center"
          >
            医療関係の方はこちら
          </Link>
        </div>
      </main>
    </div>
  );
}
