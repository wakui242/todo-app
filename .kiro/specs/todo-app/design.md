# TodoリストWebアプリ 技術設計書

> スコープ制御方針: [.kiro/steering/scope.md](../../steering/scope.md) に従う。要件にない機能は追加しない。

## 概要

本システムは、Flask（Python）をバックエンド、HTML/CSS/JavaScriptをフロントエンドとする、シンプルなTodoリスト管理Webアプリケーションである。タスクデータはJSONファイルに保存し、ブラウザからの操作によってタスクの追加・一覧表示・完了状態変更・削除を行う。

**設計原則:**
- requirements.mdに明記された機能のみを実装
- 学校課題として説明しやすいシンプルな構成
- 拡張性のための先回り実装は行わない

## アーキテクチャ

### システム構成

```text
利用者 → Webブラウザ → Flask (app.py) → JSONファイル (data/todos.json)
```

**処理フロー:**
1. 利用者がブラウザでHTMLページにアクセス
2. JavaScriptがFlaskのAPIエンドポイントに非同期リクエスト
3. FlaskがJSONファイルの読み書きを実行
4. 結果をJSON形式でブラウザに返却
5. JavaScriptが画面を動的に更新

### 技術スタック

- **バックエンド:** Python 3.x + Flask
- **フロントエンド:** HTML5 + CSS3 + JavaScript (Vanilla JS)
- **データ保存:** JSONファイル
- **仮想環境:** venv

## コンポーネントとインターフェース

### ファイル構成

```text
todo-app/
├── app.py              # Flaskアプリ本体（APIエンドポイント定義）
├── data/
│   └── todos.json      # タスクデータ保存ファイル
├── templates/
│   └── index.html      # Webページのテンプレート
├── static/
│   ├── css/
│   │   └── style.css   # スタイル定義
│   └── js/
│       └── main.js     # クライアント側のJavaScript
├── requirements.txt    # Python依存パッケージ
└── README.md           # プロジェクト説明
```

### APIエンドポイント

#### 1. `GET /`
- **説明:** index.htmlを返す（ページ表示用）
- **レスポンス:** HTML

#### 2. `GET /api/todos`
- **説明:** タスク一覧を取得
- **レスポンス:**
```json
[
  { "id": 1, "title": "買い物に行く", "completed": false },
  { "id": 2, "title": "宿題をやる", "completed": true }
]
```

#### 3. `POST /api/todos`
- **説明:** 新しいタスクを追加
- **リクエストボディ:**
```json
{ "title": "タスク名" }
```
- **レスポンス（成功時）:**
```json
{ "id": 3, "title": "タスク名", "completed": false }
```
- **レスポンス（失敗時）:**
```json
{ "error": "タスク名を入力してください" }
```
- **HTTPステータス:** 成功=201, 失敗=400

#### 4. `PUT /api/todos/<id>`
- **説明:** タスクの完了状態を変更（完了/未完了の両方をこれ1本で扱う）
- **リクエストボディ:**
```json
{ "completed": true }
```
- **レスポンス（成功時）:**
```json
{ "id": 1, "title": "買い物に行く", "completed": true }
```
- **レスポンス（失敗時）:**
```json
{ "error": "タスクが見つかりません" }
```
- **HTTPステータス:** 成功=200, 失敗=404

#### 5. `DELETE /api/todos/<id>`
- **説明:** タスクを削除
- **レスポンス（成功時）:**
```json
{ "message": "削除しました" }
```
- **レスポンス（失敗時）:**
```json
{ "error": "タスクが見つかりません" }
```
- **HTTPステータス:** 成功=200, 失敗=404

### フロントエンド構成

#### index.html
- タスク入力欄（`<input>` テキストフィールド）
- 追加ボタン（`<button>`）
- 未完了タスク一覧表示エリア
- 完了済みタスク一覧表示エリア
- メッセージ表示欄（エラー・成功メッセージ用）

各タスクには以下のボタンを配置：
- **完了切替ボタン:** クリックで完了/未完了を切り替え
- **削除ボタン:** クリックでタスクを削除

#### main.js
- ページ読み込み時にタスク一覧を取得して表示
- タスク追加フォームの送信処理
- 完了切替ボタンのクリック処理
- 削除ボタンのクリック処理
- APIとの非同期通信（fetch API使用）
- 画面の動的更新（DOM操作）

#### style.css
- 完了済みタスクの見た目を区別（例: 打ち消し線、グレー表示）
- シンプルで見やすいレイアウト
- ボタンやフォームの基本スタイル

## データモデル

### タスク (Todo)

```json
{
  "id": 1,
  "title": "買い物に行く",
  "completed": false
}
```

**フィールド:**
- `id` (整数): タスクを一意に識別する番号
  - 採番方法: 既存タスクの最大id + 1
  - 空リストの場合は1から開始
- `title` (文字列): タスク名
  - 空文字・空白のみは不可
- `completed` (真偽値): 完了状態
  - `true` = 完了済み
  - `false` = 未完了

**データ保存:**
- ファイル: `data/todos.json`
- 形式: JSON配列
- 例:
```json
[
  { "id": 1, "title": "買い物に行く", "completed": false },
  { "id": 2, "title": "宿題をやる", "completed": true }
]
```

### データ操作

#### データ読み込み (load_todos)
```python
def load_todos():
    """JSONファイルからタスクデータを読み込む"""
    try:
        with open('data/todos.json', 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        return []
    except json.JSONDecodeError:
        return []
```

#### データ保存 (save_todos)
```python
def save_todos(todos):
    """タスクデータをJSONファイルに保存"""
    try:
        os.makedirs('data', exist_ok=True)
        with open('data/todos.json', 'w', encoding='utf-8') as f:
            json.dump(todos, f, ensure_ascii=False, indent=2)
    except Exception as e:
        raise Exception(f"データ保存に失敗しました: {str(e)}")
```

#### ID生成
```python
def get_next_id(todos):
    """次のタスクIDを生成"""
    if not todos:
        return 1
    return max(todo['id'] for todo in todos) + 1
```

## エラー処理

### JSONファイル読み込みエラー
- **発生条件:** `data/todos.json` が存在しない、または不正なJSON形式
- **処理:** 空リスト `[]` として扱い、処理を継続
- **実装:** `load_todos()` 関数内で `try-except` による例外処理

### JSONファイル保存エラー
- **発生条件:** ファイル書き込み権限がない、ディスク容量不足など
- **処理:** エラーメッセージをクライアントに返す
- **HTTPステータス:** 500
- **実装:** `save_todos()` 関数で例外を捕捉し、上位層でHTTPエラーレスポンスを返す

### 入力バリデーションエラー

#### タスク名が空または空白のみ
- **検証条件:** `title.strip() == ""`
- **処理:** タスクを登録せず、エラーメッセージを返す
- **HTTPステータス:** 400
- **メッセージ:** `"タスク名を入力してください"`

#### 存在しないタスクIDへの操作
- **発生条件:** PUT/DELETEリクエストで指定されたIDが存在しない
- **処理:** エラーメッセージを返す
- **HTTPステータス:** 404
- **メッセージ:** `"タスクが見つかりません"`

### エラー処理の実装方針
- ロギング基盤は導入しない（標準出力へのprintは可）
- 例外ミドルウェアは導入しない
- 複雑なバリデーションライブラリは使用しない
- Flaskの基本的なエラーハンドリング（try-exceptとjsonifyによるレスポンス）のみを使用

## 動作確認

実装後、ブラウザで手動で以下を確認する（自動テストは行わない）。

- トップページ（http://localhost:5001/）が表示される
- タスクを追加できる
- タスク名が空または空白のみの場合は登録されず、メッセージが出る
- 未完了タスクを完了済みに変更できる
- 完了済みタスクを未完了に戻せる
- 完了済みタスクが見た目で区別される（打ち消し線やグレー表示など）
- 未完了タスクと完了済みタスクが分けて表示される
- タスクを削除できる
- アプリを再起動しても data/todos.json の内容が保持される
