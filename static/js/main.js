// DOM要素の取得
const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const incompleteTasks = document.getElementById('incompleteTasks');
const completedTasks = document.getElementById('completedTasks');
const message = document.getElementById('message');

// ページ読み込み時にタスク一覧を取得
document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
});

// タスク一覧を取得して表示
async function loadTasks() {
    try {
        const response = await fetch('/api/todos');
        const todos = await response.json();
        
        // 未完了と完了済みに分けて表示
        displayTasks(todos);
    } catch (error) {
        showMessage('タスクの読み込みに失敗しました', 'error');
    }
}

// タスクを表示する
function displayTasks(todos) {
    // 未完了と完了済みに分ける
    const incomplete = todos.filter(todo => !todo.completed);
    const completed = todos.filter(todo => todo.completed);
    
    // 未完了タスクを表示
    if (incomplete.length === 0) {
        incompleteTasks.innerHTML = '<div class="empty-message">未完了タスクはありません</div>';
    } else {
        incompleteTasks.innerHTML = incomplete.map(todo => createTaskElement(todo)).join('');
    }
    
    // 完了済みタスクを表示
    if (completed.length === 0) {
        completedTasks.innerHTML = '<div class="empty-message">完了済みタスクはありません</div>';
    } else {
        completedTasks.innerHTML = completed.map(todo => createTaskElement(todo)).join('');
    }
    
    // ボタンのイベントリスナーを設定
    attachEventListeners();
}

// タスク要素のHTMLを生成
function createTaskElement(todo) {
    const completedClass = todo.completed ? 'completed' : '';
    const toggleText = todo.completed ? '未完了に戻す' : '完了';
    
    return `
        <div class="task-item ${completedClass}" data-id="${todo.id}">
            <div class="task-title">${escapeHtml(todo.title)}</div>
            <div class="task-buttons">
                <button class="toggle-btn" data-id="${todo.id}" data-completed="${todo.completed}">
                    ${toggleText}
                </button>
                <button class="delete-btn" data-id="${todo.id}">削除</button>
            </div>
        </div>
    `;
}

// HTMLエスケープ（XSS対策）
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// イベントリスナーを設定
function attachEventListeners() {
    // 完了切替ボタン
    document.querySelectorAll('.toggle-btn').forEach(btn => {
        btn.addEventListener('click', toggleTask);
    });
    
    // 削除ボタン
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', deleteTask);
    });
}

// タスク追加ボタンのクリックイベント
addBtn.addEventListener('click', addTask);

// Enterキーでもタスク追加できるようにする
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTask();
    }
});

// タスクを追加
async function addTask() {
    const title = taskInput.value.trim();
    
    // 空白チェックは不要（サーバー側で行う）
    if (!title) {
        showMessage('タスク名を入力してください', 'error');
        return;
    }
    
    try {
        const response = await fetch('/api/todos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title: title })
        });
        
        if (response.ok) {
            // 入力欄をクリア
            taskInput.value = '';
            // タスク一覧を再読み込み
            await loadTasks();
            showMessage('タスクを追加しました', 'success');
        } else {
            const error = await response.json();
            showMessage(error.error || 'タスクの追加に失敗しました', 'error');
        }
    } catch (error) {
        showMessage('タスクの追加に失敗しました', 'error');
    }
}

// タスクの完了状態を切り替え
async function toggleTask(event) {
    const id = parseInt(event.target.dataset.id);
    const currentCompleted = event.target.dataset.completed === 'true';
    const newCompleted = !currentCompleted;
    
    try {
        const response = await fetch(`/api/todos/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ completed: newCompleted })
        });
        
        if (response.ok) {
            // タスク一覧を再読み込み
            await loadTasks();
            const statusText = newCompleted ? '完了' : '未完了';
            showMessage(`タスクを${statusText}にしました`, 'success');
        } else {
            const error = await response.json();
            showMessage(error.error || 'タスクの更新に失敗しました', 'error');
        }
    } catch (error) {
        showMessage('タスクの更新に失敗しました', 'error');
    }
}

// タスクを削除
async function deleteTask(event) {
    const id = parseInt(event.target.dataset.id);
    
    // 確認ダイアログを表示
    if (!confirm('このタスクを削除しますか？')) {
        return;
    }
    
    try {
        const response = await fetch(`/api/todos/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            // タスク一覧を再読み込み
            await loadTasks();
            showMessage('タスクを削除しました', 'success');
        } else {
            const error = await response.json();
            showMessage(error.error || 'タスクの削除に失敗しました', 'error');
        }
    } catch (error) {
        showMessage('タスクの削除に失敗しました', 'error');
    }
}

// メッセージ表示用のタイマーID（連続表示時に前のタイマーを打ち消すため）
let messageTimerId = null;

// メッセージを表示
function showMessage(text, type) {
    message.textContent = text;
    message.className = type;

    // 前のタイマーが残っていれば取り消す（連続操作でメッセージが早く消えるのを防ぐ）
    if (messageTimerId !== null) {
        clearTimeout(messageTimerId);
    }

    // 3秒後にメッセージを消す
    messageTimerId = setTimeout(() => {
        message.textContent = '';
        message.className = '';
        messageTimerId = null;
    }, 3000);
}
