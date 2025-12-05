// 質問回答完了画面
"use client";

import React, { useState } from 'react';

const FinishPage = () => {
  const [displayedQuestions, setDisplayedQuestions] = useState(2);

  const relatedQuestions = [
    '関連質問1の内容が表示されます',
    '関連質問2の内容が表示されます',
    '関連質問3の内容が表示されます',
    '関連質問4の内容が表示されます',
    '関連質問5の内容が表示されます',
    '関連質問6の内容が表示されます',
    '関連質問7の内容が表示されます',
    '関連質問8の内容が表示されます'
  ];

  const handleMoreQuestions = () => {
    setDisplayedQuestions(prev =>
      prev + 2 <= relatedQuestions.length ? prev + 2 : relatedQuestions.length
    );
  };

  const handleMenuClick = () => {
    alert('メニューを開きます');
  };

  const handleQuestionClick = (index) => {
    alert(`「${relatedQuestions[index]}」を選択しました`);
  };

  const handleBackToList = () => {
    alert('質問一覧へ戻ります');
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom, #FFD4D4 0%, #FFE8F0 100%)',
      padding: '20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Hiragino Sans", "Hiragino Kaku Gothic ProN", Meiryo, sans-serif'
    }}>

      <div style={{ maxWidth: '800px', margin: '0 auto', paddingTop: '20px' }}>

        {/* ★ ここから1つだけの枠 */}
        <div style={{
          background: 'white',
          border: '2px solid #999',
          padding: '40px',
          marginBottom: '30px',
          position: 'relative'
        }}>

          {/* ヘッダー */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '20px'
          }}>
            <div style={{
              fontSize: '18px',
              fontWeight: 'bold',
              color: '#000'
            }}>
              ありがとうございます。<br />
              投稿が完了しました。
            </div>

            <button
              onClick={handleMenuClick}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '0',
                display: 'flex',
                flexDirection: 'column',
                gap: '5px',
              }}
            >
              <div style={{ width: '30px', height: '3px', background: '#000', borderRadius: '2px' }} />
              <div style={{ width: '30px', height: '3px', background: '#000', borderRadius: '2px' }} />
              <div style={{ width: '30px', height: '3px', background: '#000', borderRadius: '2px' }} />
            </button>
          </div>

          {/* 関連質問 */}
          <div style={{ marginTop: '30px' }}>
            <div style={{
              fontSize: '16px',
              fontWeight: 'bold',
              color: '#000',
              marginBottom: '16px'
            }}>
              関連質問はこちら↓
            </div>

            {/* 質問一覧（2件 → 4件 → 6件…） */}
            {relatedQuestions.slice(0, displayedQuestions).map((question, index) => (
              <button
                key={index}
                onClick={() => handleQuestionClick(index)}
                style={{
                  width: '100%',
                  padding: '16px',
                  background: 'white',
                  border: '2px solid #999',
                  borderRadius: '4px',
                  fontSize: '16px',
                  color: '#000',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'background 0.2s, transform 0.1s',
                  marginBottom: '16px'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = '#f5f5f5';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'white';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {question}
              </button>
            ))}

            {/* フッター */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end'
            }}>
              <div>
                {displayedQuestions < relatedQuestions.length && (
                  <button
                    onClick={handleMoreQuestions}
                    style={{
                      background: 'none',
                      color: '#000',
                      border: 'none',
                      borderBottom: '1px solid #000',
                      padding: '4px 0',
                      fontSize: '14px',
                      cursor: 'pointer'
                    }}
                  >
                    もっと見る
                  </button>
                )}
              </div>

              <button
                onClick={handleBackToList}
                style={{
                  background: 'white',
                  color: '#000',
                  border: '2px solid #999',
                  padding: '8px 20px',
                  fontSize: '16px',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                質問一覧へ戻る
              </button>
            </div>
          </div>
        </div>
        {/* ★ ここまで枠 */}

      </div>
    </div>
  );
};

export default FinishPage;