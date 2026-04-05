const GAS_URL = 'https://script.google.com/macros/s/AKfycbx6rbuFmDXc4_IRCQ3Fc--LvstOdwFEP3SD6ieSTcIcTKmKTOP1t-Mkwn4chg7nb1AeNg/exec';

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
        // リダイレクト設定（redirect: "follow"）を追加
        const response = await fetch(`${GAS_URL}?action=login&id=${id}&pw=${pw}`, {
            method: "GET",
            mode: "cors",
            redirect: "follow" 
        });

        if (!response.ok) throw new Error('ネットワークエラー');

        const result = await response.json();

        if (result.login) {
            localStorage.setItem('userName', result.name);
            localStorage.setItem('sessionId', result.sessionId);
            localStorage.setItem('lastActivity', Date.now());
            // index.htmlへ移動（リロード）
            location.href = 'index.html'; 
        } else {
            alert(result.message || "ログインに失敗しました");
        }
    } catch (error) {
        console.error("通信エラー:", error);
        alert("サーバーとの通信に失敗しました。GASのURLが正しいか、公開設定が「全員」になっているか確認してください。");
    }
}

// エンターキーでもログインできるように設定
document.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') login();
});
