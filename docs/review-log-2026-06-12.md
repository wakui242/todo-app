# レビュー・修正ログ 2026-06-12

TodoリストWebアプリの全体レビューと修正の記録。

## 対象

- `app.py`（Flaskバックエンド）
- `templates/index.html`
- `static/css/style.css`
- `static/js/main.js`
- `data/todos.json`
- `requirements.txt` / `README.md`

## レビュー観点と結果

### 整合性チェック（問題なし）

- HTML の `id` と JS の `getElementById` が完全一致（`taskInput` / `addBtn` / `incompleteTasks` / `completedTasks` / `message`）
- JS が生成する `class` と CSS のセレクタが一致（`task-item` / `completed` / `toggle-btn` / `delete-btn` / `empty-message` など）
- API・データモデル・ファイル構成は要件定義・設計書どおり
- スコープ：要件外機能の混入なし

## 見つけた問題と修正（3件）

| # | 種別 | 内容 | 修正内容 |
|---|------|------|----------|
| 1 | 実バグ | `showMessage` のタイマー競合。連続操作すると、前回の `setTimeout` が後から出したメッセージを早く消してしまう | メッセージ表示前に前回のタイマーを `clearTimeout` で打ち消すようにした（`messageTimerId` を導入） |
| 2 | 堅牢性 | `POST /api/todos` と `PUT /api/todos/<id>` で不正なJSON本文が来ると500になる | `request.get_json(silent=True)` に変更し、`None` の場合は **400「リクエストが不正です」** を返す |
| 3 | 堅牢性 | `PUT /api/todos/<id>` で `completed` が本文に無いと `None` が保存され、完了状態が不定になる | `completed` が無い場合は400を返し、値は `bool()` で確実に真偽値へ変換してから保存する |

### 修正方針

- いずれも要件「エラー発生時もアプリケーションが異常終了しないようにする」に沿う最小限の修正。
- 新機能の追加はしていない（スコープ維持）。

### 変更ファイル

- `app.py`（POST・PUT のバリデーション）
- `static/js/main.js`（`showMessage` のタイマー処理）

## 検証結果（ローカル実機・ポート5001）

### 堅牢性（修正点）

- `POST` 本文なし → 400 ✅
- `POST` 壊れたJSON → 400 ✅
- `PUT` で `completed` 欠落 → 400 ✅

### 回帰（正常系が壊れていないこと）

- `POST` 正常追加 → 201 ✅
- `POST` 空白のみ → 400「タスク名を入力してください」 ✅
- `PUT` 正常な完了変更 → 200 ✅
- `PUT` 存在しないID → 404 ✅
- `GET` 一覧の `completed` が全件 `bool` 型 ✅

### その他

- Python 構文チェック（`py_compile`）OK
- JavaScript 構文チェック（`node --check`）OK
- 画面表示・レイアウト・完了済みタスクの視覚区別（打ち消し線・グレー）正常
- 再起動後に `data/todos.json` からデータが復元されることを確認済み（永続化）

## 作業後の状態

- サーバ：停止（ポート5001 解放）
- データ：デモ用5件（検証で追加したテストタスクは削除済み）
- ポート：要件の5000はmacOSのAirPlayが使用するため、`app.run(debug=True, port=5001)` で5001を使用
