const GAS_URL = 'https://script.google.com/macros/s/AKfycbyhyKzooOgJQUGwcsJnyvxJoyD1jHtQi7HIKCZcJ9JLgsX9dRrZ_IJy78oxbicvWcHEOw/exec';

async function fetchUsage() {
    try {
        const response = await fetch(`${GAS_URL}?action=getUsage`);
        const data = await response.json();
        renderTable(data);
    } catch (error) {
        console.error("データ取得失敗:", error);
    }
}

function renderTable(data) {
    const tbody = document.getElementById('usage-body');
    tbody.innerHTML = ''; 

    data.forEach(item => {
        const isBusy = item.user && item.user !== "";
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="col-num">${item.id}</td>
            <td class="col-name">${item.toolName}</td>
            <td class="col-user ${isBusy ? 'is-using' : ''}" onclick="toggleUsage(${item.id}, '${item.user || ''}')">
                ${isBusy ? `${item.user} <span class="status-badge status-busy">使用中</span>` : '<span class="status-badge status-free">空き</span>'}
            </td>
        `;
        tbody.appendChild(row);
    });
}

async function toggleUsage(toolId, currentUser) {
    const myName = localStorage.getItem('userName');
    const action = currentUser === "" ? "use" : "release";
    
    if (action === "release" && currentUser !== myName) {
        alert("他の人が使用中のものは解除できません。");
        return;
    }

    const msg = action === "use" ? "使用を開始しますか？" : "使用を終了しますか？";
    if (!confirm(msg)) return;

    try {
        const response = await fetch(GAS_URL, {
            method: 'POST',
            body: JSON.stringify({ action, toolId, userName: myName })
        });
        const result = await response.json();
        if (result.success) {
            fetchUsage();
        } else {
            alert(result.message);
        }
    } catch (e) {
        alert("更新に失敗しました。");
    }
}

fetchUsage();
setInterval(fetchUsage, 30000); // 30秒ごとに更新
