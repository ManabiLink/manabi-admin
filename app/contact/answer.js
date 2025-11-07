// 回答入力画面
"use client";

// DOMの作成
function createPage() {
    // スタイルを追加
    const styleElement = document.createElement('style');
    styleElement.textContent = styles;
    document.head.appendChild(styleElement);

    // コンテナ
    const container = document.createElement('div');
    container.className = 'container';

    // ヘッダー
    const header = document.createElement('div');
    header.className = 'header';

    const headerTitle = document.createElement('div');
    headerTitle.className = 'header-title';
    headerTitle.textContent = '回答';

    const menuBtn = document.createElement('button');
    menuBtn.className = 'menu-btn';
    menuBtn.id = 'menuBtn';
    menuBtn.innerHTML = '<span></span><span></span><span></span>';

    header.appendChild(headerTitle);
    header.appendChild(menuBtn);

    // コンテンツ
    const content = document.createElement('div');
    content.className = 'content';

    // 質問セクション
    const questionSection = document.createElement('div');
    questionSection.className = 'section';

    const questionLabel = document.createElement('div');
    questionLabel.className = 'section-label';
    questionLabel.textContent = '質問';

    const questionBox = document.createElement('textarea');
    questionBox.className = 'text-box question-box';
    questionBox.readOnly = true;
    questionBox.value = '質問内容がここに表示されます';

    questionSection.appendChild(questionLabel);
    questionSection.appendChild(questionBox);

    // 回答セクション
    const answerSection = document.createElement('div');
    answerSection.className = 'section';

    const answerLabel = document.createElement('div');
    answerLabel.className = 'section-label';
    answerLabel.textContent = '回答';

    const answerBox = document.createElement('textarea');
    answerBox.className = 'text-box answer-box';
    answerBox.id = 'answerInput';
    answerBox.placeholder = '回答を入力してください';

    answerSection.appendChild(answerLabel);
    answerSection.appendChild(answerBox);

    content.appendChild(questionSection);
    content.appendChild(answerSection);

    // フッター
    const footer = document.createElement('div');
    footer.className = 'footer';

    const backBtn = document.createElement('button');
    backBtn.className = 'btn btn-cancel';
    backBtn.id = 'backBtn';
    backBtn.textContent = '戻る';

    const submitBtn = document.createElement('button');
    submitBtn.className = 'btn btn-submit';
    submitBtn.id = 'submitBtn';
    submitBtn.textContent = '投稿';

    footer.appendChild(backBtn);
    footer.appendChild(submitBtn);

    // メニューモーダル
    const menuModal = document.createElement('div');
    menuModal.className = 'menu-modal';
    menuModal.id = 'menuModal';

    const menuContent = document.createElement('div');
    menuContent.className = 'menu-content';

    const menuTitle = document.createElement('h2');
    menuTitle.textContent = 'メニュー';

    const menuList = document.createElement('ul');
    const menuItems = ['プロフィール', '質問一覧', '回答一覧', '設定', 'ヘルプ', 'ログアウト'];
    menuItems.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        menuList.appendChild(li);
    });

    menuContent.appendChild(menuTitle);
    menuContent.appendChild(menuList);
    menuModal.appendChild(menuContent);

    // 全て組み立てる
    container.appendChild(header);
    container.appendChild(content);
    container.appendChild(footer);

    document.body.appendChild(container);
    document.body.appendChild(menuModal);

    // イベントリスナー
    setupEventListeners();
}

// イベント処理
function setupEventListeners() {
    const menuBtn = document.getElementById('menuBtn');
    const menuModal = document.getElementById('menuModal');
    const backBtn = document.getElementById('backBtn');
    const submitBtn = document.getElementById('submitBtn');
    const answerInput = document.getElementById('answerInput');

    // メニューボタン
    menuBtn.addEventListener('click', () => {
        menuModal.classList.add('active');
    });

    // メニュー背景クリック
    menuModal.addEventListener('click', (e) => {
        if (e.target === menuModal) {
            menuModal.classList.remove('active');
        }
    });

    // メニュー内容
    document.querySelectorAll('.menu-content li').forEach(item => {
        item.addEventListener('click', () => {
            console.log(item.textContent + 'をクリック');
            menuModal.classList.remove('active');
        });
    });

    // 戻るボタン
    backBtn.addEventListener('click', () => {
        if (confirm('このページを離れますか？入力内容は保存されません。')) {
            console.log('前のページに戻ります');
            alert('前のページに戻ります');
        }
    });

    // 投稿ボタン
    submitBtn.addEventListener('click', () => {
        const answerText = answerInput.value.trim();
        
        if (answerText === '') {
            alert('回答を入力してください');
            return;
        }

        console.log('投稿内容:', answerText);
        alert('回答を投稿しました！');
        answerInput.value = '';
    });

    // Ctrl+Enterで投稿
    answerInput.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'Enter') {
            submitBtn.click();
        }
    });
}

// ページ読み込み時に実行
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createPage);
} else {
    createPage();
}