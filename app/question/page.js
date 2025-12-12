//質問回答ページ

'use client';
import { useState, useRef, useEffect } from 'react';

export default function QuestionAnswerPage() {
  const [articles, setArticles] = useState([
    {
      id: 1,
      title: "サンプル質問1",
      content: "子どもがひらがなの『さ』を上手く書けません。どのように教えるべきですか？",
      author: "西山ひろし（独身）",
      submittedAt: "2025-11-07",
      answer: "",
      error: false,
      isConfirmModalOpen: false,
      isPostingPhase: false,
    },
  ]);

  const countdownRef = useRef(null);
  const [countdown, setCountdown] = useState(3);
  const [progressPercent, setProgressPercent] = useState(100);

  const handleAnswerChange = (id, newAnswer) => {
    setArticles(
      articles.map(article =>
        article.id === id
          ? { ...article, answer: newAnswer, error: false }
          : article
      )
    );
  };

  const handleSendAnswer = (id) => {
    const article = articles.find(a => a.id === id);

    if (article.answer.trim().length < 5) {
      setArticles(
        articles.map(a =>
          a.id === id ? { ...a, error: true } : a
        )
      );
      return;
    }

    // モーダル表示
    setArticles(
      articles.map(a =>
        a.id === id ? { ...a, isConfirmModalOpen: true } : a
      )
    );
  };

  const handleEdit = (id) => {
    setArticles(
      articles.map(a =>
        a.id === id ? { ...a, isConfirmModalOpen: false } : a
      )
    );
  };

  const handlePost = (id) => {
    setArticles(
      articles.map(a =>
        a.id === id ? { ...a, isPostingPhase: true } : a
      )
    );

    setCountdown(3);
    setProgressPercent(100);

    const totalMs = 4000;
    const tickMs = 30;
    let elapsed = 0;

    countdownRef.current = window.setInterval(() => {
      elapsed += 1;
      const remainingMs = Math.max(totalMs - elapsed * tickMs, 0);
      const remainingSeconds = Math.ceil(remainingMs / 1000);

      setCountdown(remainingSeconds);
      setProgressPercent((remainingMs / totalMs) * 100);

      if (remainingMs <= 0) {
        clearCountdown();

        setArticles(
          articles.map(a =>
            a.id === id
              ? { ...a, isPostingPhase: false, isConfirmModalOpen: false, answer: "" }
              : a
          )
        );
      }
    }, tickMs);
  };

  const clearCountdown = () => {
    if (countdownRef.current !== null) {
      window.clearInterval(countdownRef.current);
      countdownRef.current = null;
    }
  };

  useEffect(() => {
    return () => clearCountdown();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-2xl font-bold mb-6 text-black">質問回答ページ</h1>

      <div className="space-y-6">
        {articles.map(article => (
          <div key={article.id} className="bg-white p-6 rounded-lg shadow-md relative">

            {/* 質問情報 */}
            <h2 className="text-xl font-semibold text-black">{article.title}</h2>
            <p className="text-black mt-2">{article.content}</p>

            <div className="mt-2 text-sm text-black">
              <p>投稿者: {article.author}</p>
              <p>投稿日: {article.submittedAt}</p>
            </div>

            {/* エラー表示 */}
            {article.error && (
              <p className="mt-3 text-sm font-medium text-black">
                <span className="text-red-500">5</span>文字以上入力してください
              </p>
            )}

            {/* 回答欄 */}
            <textarea
              placeholder="ここに回答を入力してください..."
              value={article.answer}
              onChange={(e) => handleAnswerChange(article.id, e.target.value)}
              className="mt-4 w-full p-3 border rounded-md bg-gray-50 text-black placeholder-gray-400"
              rows={4}
            />

            <button
              onClick={() => handleSendAnswer(article.id)}
              className="mt-3 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              回答を送信
            </button>

            {/* 確認モーダル */}
            {article.isConfirmModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" role="dialog" aria-modal="true">
                <div className="bg-white w-full max-w-xl rounded-lg shadow-xl p-6 mx-4 max-h-[80vh] overflow-y-auto">

                  {!article.isPostingPhase ? (
                    <div className="flex flex-col gap-4">
                      <h2 className="text-lg font-medium">回答はまだ投稿されていません</h2>
                      <p className="text-sm text-gray-600">内容を確認し問題なければ「投稿」を押してください。</p>

                      <div>
                        <h3 className="font-semibold mt-1">回答内容</h3>
                        <p className="text-gray-700 whitespace-pre-wrap break-words">{article.answer}</p>
                      </div>

                      <div className="flex justify-end gap-3 mt-4">
                        <button
                          type="button"
                          onClick={() => handleEdit(article.id)}
                          className="inline-block px-4 py-2 bg-white text-black border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                        >
                          修正
                        </button>

                        <button
                          type="button"
                          onClick={() => handlePost(article.id)}
                          className="inline-block px-4 py-2 rounded-md text-white bg-blue-500 hover:bg-blue-600 transition-colors"
                        >
                          投稿
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-4">
                      <div className="text-center">
                        <h2 className="text-xl font-semibold">ありがとうございます。</h2>
                        <p className="mt-2">投稿が完了しました。</p>
                      </div>

                      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div
                          className="h-full bg-blue-500 transition-all duration-100 linear"
                          style={{ width: `${progressPercent}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>
        ))}
      </div>
    </div>
  );
}