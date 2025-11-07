// 質問回答画面
"use client";

import React, { useState } from 'react';

const QAPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [questionContent, setQuestionContent] = useState('');
  const [isAnswering, setIsAnswering] = useState(false);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      alert(`「${searchQuery}」を検索しています...`);
    }
  };

  const handleAnswer = () => {
    setIsAnswering(true);
  };

  const handleBack = () => {
    setQuestionContent('');
    setIsAnswering(false);
  };

  const handleMenuClick = () => {
    alert('メニューを開きます');
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom, #FFD4D4 0%, #FFE8F0 100%)',
      padding: '20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Hiragino Sans", "Hiragino Kaku Gothic ProN", Meiryo, sans-serif'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        paddingTop: '40px'
      }}>
        {/* ヘッダー */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          marginBottom: '30px',
          position: 'relative'
        }}>
          {/* 検索バー（中央） */}
          <div style={{
            display: 'flex',
            maxWidth: '500px',
            width: '100%',
            border: '2px solid #666',
            background: 'white'
          }}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="質問を探す"
              style={{
                flex: 1,
                padding: '12px 16px',
                fontSize: '16px',
                border: 'none',
                outline: 'none',
                background: 'white',
                color: '#000000'
              }}
            />
            <button
              onClick={handleSearch}
              style={{
                background: 'linear-gradient(135deg, #6B4CE6 0%, #4A2FBD 100%)',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                fontSize: '16px',
                cursor: 'pointer',
                transition: 'opacity 0.2s'
              }}
              onMouseOver={(e) => e.target.style.opacity = '0.9'}
              onMouseOut={(e) => e.target.style.opacity = '1'}
            >
              検索
            </button>
          </div>

          {/* メニューボタン（右上固定） */}
          <button
            onClick={handleMenuClick}
            style={{
              position: 'absolute',
              right: 0,
              top: 0,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
              display: 'flex',
              flexDirection: 'column',
              gap: '5px'
            }}
          >
            <div style={{ width: '30px', height: '3px', background: '#333', borderRadius: '2px' }} />
            <div style={{ width: '30px', height: '3px', background: '#333', borderRadius: '2px' }} />
            <div style={{ width: '30px', height: '3px', background: '#333', borderRadius: '2px' }} />
          </button>
        </div>

        {/* Q&Aボックス */}
        <div style={{
          background: 'white',
          border: '2px solid #999',
          padding: '40px'
        }}>
          {!isAnswering ? (
            /* 質問表示エリア */
            <>
              <div style={{
                marginBottom: '30px',
                padding: '20px',
                minHeight: '200px',
                fontSize: '16px',
                lineHeight: '1.8',
                color: '#333',
                border: '2px solid #999',
                borderRadius: '4px',
                backgroundColor: '#f9f9f9',
                overflowY: 'auto',
                maxHeight: '400px'
              }}>
                {questionContent || '質問内容がここに表示されます'}
              </div>

              {/* 回答ボタン */}
              <div style={{
                display: 'flex',
                gap: '12px',
                justifyContent: 'center',
                flexWrap: 'wrap'
              }}>
                <button
                  onClick={handleAnswer}
                  style={{
                    background: 'linear-gradient(135deg, #6B4CE6 0%, #4A2FBD 100%)',
                    color: 'white',
                    border: 'none',
                    padding: '16px 80px',
                    fontSize: '18px',
                    cursor: 'pointer',
                    transition: 'transform 0.1s'
                  }}
                  onMouseDown={(e) => e.target.style.transform = 'translateY(0)'}
                  onMouseUp={(e) => e.target.style.transform = 'translateY(-1px)'}
                  onMouseOver={(e) => e.target.style.transform = 'translateY(-1px)'}
                  onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
                >
                  回答
                </button>
                <button
                  onClick={handleBack}
                  style={{
                    background: 'white',
                    color: '#333',
                    border: '2px solid #999',
                    padding: '14px 32px',
                    fontSize: '16px',
                    cursor: 'pointer',
                    transition: 'background 0.2s'
                  }}
                  onMouseOver={(e) => e.target.style.background = '#f5f5f5'}
                  onMouseOut={(e) => e.target.style.background = 'white'}
                >
                  戻る
                </button>
              </div>
            </>
          ) : (
            /* 回答入力エリア */
            <>
              <div style={{ marginBottom: '20px' }}>
                <textarea
                  value={questionContent}
                  onChange={(e) => setQuestionContent(e.target.value)}
                  placeholder="ここに回答を入力してください..."
                  style={{
                    width: '100%',
                    minHeight: '250px',
                    padding: '16px',
                    fontSize: '16px',
                    border: '2px solid #ddd',
                    outline: 'none',
                    resize: 'vertical',
                    fontFamily: 'inherit',
                    borderRadius: '4px'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#6B4CE6'}
                  onBlur={(e) => e.target.style.borderColor = '#ddd'}
                />
              </div>

              {/* ボタン */}
              <div style={{
                display: 'flex',
                gap: '12px',
                justifyContent: 'center',
                flexWrap: 'wrap'
              }}>
                <button
                  onClick={() => alert('回答を送信しました！')}
                  style={{
                    background: 'linear-gradient(135deg, #6B4CE6 0%, #4A2FBD 100%)',
                    color: 'white',
                    border: 'none',
                    padding: '16px 80px',
                    fontSize: '18px',
                    cursor: 'pointer',
                    transition: 'transform 0.1s'
                  }}
                  onMouseDown={(e) => e.target.style.transform = 'translateY(0)'}
                  onMouseUp={(e) => e.target.style.transform = 'translateY(-1px)'}
                  onMouseOver={(e) => e.target.style.transform = 'translateY(-1px)'}
                  onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
                >
                  回答
                </button>
                <button
                  onClick={handleBack}
                  style={{
                    background: 'white',
                    color: '#333',
                    border: '2px solid #999',
                    padding: '14px 32px',
                    fontSize: '16px',
                    cursor: 'pointer',
                    transition: 'background 0.2s'
                  }}
                  onMouseOver={(e) => e.target.style.background = '#f5f5f5'}
                  onMouseOut={(e) => e.target.style.background = 'white'}
                >
                  戻る
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default QAPage;