const GAS_URL = 'https://script.google.com/macros/s/AKfycby8s9ZScr_jYiccTW1g9-irq4C7bcOcAN7snT5cL1IZzy-N4xzn2DWNNtlgdsmOWi-9SA/exec';

/**
 * ログイン処理
 */
async function login() {
    const id = document.getElementById('login-id').value;
    const pw = document.getElementById('login-pw').value;

    if (!id || !pw) {
        alert("IDとパスワードを入力してください");
        return;
    }

    try {
        // GASへGETリクエストで認証確認
        const response = await fetch(`${GAS_URL}?action=login&id=${id}&pw=${pw}`);
        const result = await response.json();

        if (result.login) {
            // 認証成功：ブラウザにユーザー名を保存
            localStorage.setItem('userName', result.name);
            alert(`ログイン成功：${result.name}さん、こんにちは！`);
            
            // メインメニュー画面（例: menu.html）へ移動
            window.location.href = 'index.html'; 
        } else {
            alert("IDまたはパスワードが正しくありません");
        }
    } catch (error) {
        console.error("通信エラー:", error);
        alert("サーバーとの通信に失敗しました。");
    }
}

// エンターキーでもログインできるように設定
document.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') login();
});
