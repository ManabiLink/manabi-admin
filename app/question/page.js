'use client';
import { useState } from 'react';

export default function QuestionAnswerPage() {
  const [articles, setArticles] = useState([
    {
      id: 1,
      title: "サンプル質問1",
      content: "子どもがひらがなの『さ』を上手く書けません。どのように教えるべきですか？",
      author: "西山ひろし（独身）",
      submittedAt: "2025-11-07",
      answer: ""
    },
    // もっと追加可能
  ]);

  const handleAnswerChange = (id, newAnswer) => {
    setArticles(
      articles.map(article =>
        article.id === id ? { ...article, answer: newAnswer } : article
      )
    );
  };

  const handleSendAnswer = (id) => {
    const article = articles.find(a => a.id === id);

    alert(`回答を送信しました！\n\n質問: ${article.title}\n回答: ${article.answer}`);
    
    
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-2xl font-bold mb-6 text-black">質問回答ページ</h1>

      <div className="space-y-6">
        {articles.map(article => (
          <div key={article.id} className="bg-white p-6 rounded-lg shadow-md">

            {/* 質問情報 */}
            <h2 className="text-xl font-semibold text-black">{article.title}</h2>
            <p className="text-black mt-2">{article.content}</p>

            <div className="mt-2 text-sm text-black">
              <p>投稿者: {article.author}</p>
              <p>投稿日: {article.submittedAt}</p>
            </div>

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
          </div>
        ))}
      </div>
    </div>
  );
}
