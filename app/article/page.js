'use client';
import { useState } from 'react';

export default function ArticleReview() {
const [articles, setArticles] = useState([
    {
    id: 1,
    title: "サンプル記事1",
    content: "これは記事の内容です...",
    status: "pending",
    author: "山田太郎",
    submittedAt: "2025-11-07"
    },
    // More articles...
]);

const handleReview = (id, status) => {
    setArticles(articles.map(article =>
    article.id === id ? { ...article, status } : article
    ));
};

return (
    <div className="min-h-screen bg-gray-100 p-8 text-black">
    <h1 className="text-2xl font-bold mb-6 text-black">記事審査管理画面</h1>

    <div className="space-y-4">
        {articles.map(article => (
        <div key={article.id} className="bg-white p-6 rounded-lg shadow-md border-2 border-gray-200 text-black">
            <div className="flex justify-between items-start">
            <div>
                <h2 className="text-xl font-semibold text-black">{article.title}</h2>
                <p className="text-black mt-2">{article.content}</p>
                <div className="mt-2 text-sm text-black">
                <p>投稿者: {article.author}</p>
                <p>投稿日: {article.submittedAt}</p>
                </div>
            </div>
            <div className="space-x-2">
                <button
                onClick={() => handleReview(article.id, 'approved')}
                className="px-4 py-2 bg-green-200 text-black rounded hover:bg-green-300 transition-colors"
                >
                承認
                </button>
                <button
                onClick={() => handleReview(article.id, 'rejected')}
                className="px-4 py-2 bg-red-200 text-black rounded hover:bg-red-300 transition-colors"
                >
                却下
                </button>
            </div>
            </div>
            <div className="mt-4">
            <span className={`px-2 py-1 rounded text-sm ${
                article.status === 'approved' ? 'bg-green-100 text-black' :
                article.status === 'rejected' ? 'bg-red-100 text-black' :
                'bg-yellow-100 text-black'
            }`}>
                {article.status === 'approved' ? '承認済み' :
                article.status === 'rejected' ? '却下' :
                '審査待ち'}
            </span>
            </div>
        </div>
        ))}
    </div>
    </div>
);
}
