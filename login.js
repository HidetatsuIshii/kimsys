const GAS_URL = 'https://script.google.com/macros/s/AKfycbykwz8LpG6TzsLKrZDMCZ5kn4QvCwZYzT3y0__uwwCfKDdBOdC68V5SbPfvn_qPa8lqqg/exec';

/**
 * ログイン処理
 */
async function login() {
    const id = document.getElementById('login-id').value;
    const pw = document.getElementById('login-pw').value;
    const msgArea = document.getElementById('login-msg'); // index.htmlに作ったメッセージ欄

    try {
        const response = await fetch(`${GAS_URL}?action=login&id=${id}&pw=${pw}`);
        const result = await response.json();

        if (result.login) {
            localStorage.setItem('userName', result.name);
            localStorage.setItem('sessionId', result.sessionId);
            location.reload(); // index.htmlのonload処理に任せる
        } else {
            // ここで「〇〇さんが使用中です」と表示される
            alert(result.message); 
            if(msgArea) msgArea.innerText = result.message;
        }
    } catch (e) {
        alert("通信に失敗しました。");
    }
}

// エンターキーでもログインできるように設定
document.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') login();
});
