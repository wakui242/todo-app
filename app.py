import json
import os
from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

# データ操作関数

def load_todos():
    """JSONファイルからタスクデータを読み込む"""
    try:
        with open('data/todos.json', 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        # ファイルが存在しない場合は空リストを返す
        return []
    except json.JSONDecodeError:
        # JSON形式が不正な場合は空リストを返す
        return []

def save_todos(todos):
    """タスクデータをJSONファイルに保存"""
    try:
        # data ディレクトリが存在しない場合は作成
        os.makedirs('data', exist_ok=True)
        with open('data/todos.json', 'w', encoding='utf-8') as f:
            json.dump(todos, f, ensure_ascii=False, indent=2)
    except Exception as e:
        raise Exception(f"データ保存に失敗しました: {str(e)}")

def get_next_id(todos):
    """次のタスクIDを生成"""
    if not todos:
        return 1
    return max(todo['id'] for todo in todos) + 1

# ルート定義

@app.route('/')
def index():
    """トップページを表示"""
    return render_template('index.html')

@app.route('/api/todos', methods=['GET'])
def get_todos():
    """タスク一覧を取得"""
    todos = load_todos()
    return jsonify(todos)

@app.route('/api/todos', methods=['POST'])
def add_todo():
    """新しいタスクを追加"""
    try:
        data = request.get_json(silent=True)
        # リクエストボディが不正なJSONの場合はエラー
        if data is None:
            return jsonify({'error': 'リクエストが不正です'}), 400
        title = data.get('title', '')

        # タスク名が空または空白のみの場合はエラー
        if not title or title.strip() == '':
            return jsonify({'error': 'タスク名を入力してください'}), 400
        
        # タスクデータを読み込み
        todos = load_todos()
        
        # 新しいタスクを作成
        new_todo = {
            'id': get_next_id(todos),
            'title': title.strip(),
            'completed': False
        }
        
        # タスクを追加して保存
        todos.append(new_todo)
        save_todos(todos)
        
        return jsonify(new_todo), 201
    
    except Exception as e:
        return jsonify({'error': f'タスクの追加に失敗しました: {str(e)}'}), 500

@app.route('/api/todos/<int:todo_id>', methods=['PUT'])
def update_todo(todo_id):
    """タスクの完了状態を変更"""
    try:
        data = request.get_json(silent=True)
        # リクエストボディが不正、または completed が無い場合はエラー
        if data is None or 'completed' not in data:
            return jsonify({'error': 'リクエストが不正です'}), 400
        # 確実に真偽値として保存する（None等が入らないようにする）
        completed = bool(data.get('completed'))

        # タスクデータを読み込み
        todos = load_todos()

        # 指定されたIDのタスクを検索
        todo = None
        for t in todos:
            if t['id'] == todo_id:
                todo = t
                break
        
        # タスクが見つからない場合はエラー
        if todo is None:
            return jsonify({'error': 'タスクが見つかりません'}), 404
        
        # 完了状態を更新
        todo['completed'] = completed
        save_todos(todos)
        
        return jsonify(todo), 200
    
    except Exception as e:
        return jsonify({'error': f'タスクの更新に失敗しました: {str(e)}'}), 500

@app.route('/api/todos/<int:todo_id>', methods=['DELETE'])
def delete_todo(todo_id):
    """タスクを削除"""
    try:
        # タスクデータを読み込み
        todos = load_todos()
        
        # 指定されたIDのタスクを検索
        todo = None
        for t in todos:
            if t['id'] == todo_id:
                todo = t
                break
        
        # タスクが見つからない場合はエラー
        if todo is None:
            return jsonify({'error': 'タスクが見つかりません'}), 404
        
        # タスクを削除
        todos.remove(todo)
        save_todos(todos)
        
        return jsonify({'message': '削除しました'}), 200
    
    except Exception as e:
        return jsonify({'error': f'タスクの削除に失敗しました: {str(e)}'}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5001)
