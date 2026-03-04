# Simple Closet

シンプルで操作性の良いクローゼット管理アプリ

---

## Overview

**Simple Closet** は、
持っている服とコーディネートを管理し、
朝の服選びをスムーズにするためのシンプルなクローゼットアプリです。

「ファッション好きではないが、毎日ベストな服装で過ごしたい人」をターゲットとし、
多機能すぎず丁度良く管理できるアプリを目指しました。

「迷わない・使いやすい」UIを重視しています。

---

## Features

### 1. アイテム管理

* 服の登録（画像・カテゴリなど）
* 一覧表示
* 編集 / 削除
* 詳細画面への遷移

### 2. コーディネート管理

* 複数の服を組み合わせてコーデを作成
* 一覧表示
* 編集 / 削除
* 詳細画面表示

### 3. タグ機能

* コーディネートにタグを付与
* タグの動的作成
* ホーム画面からタグ検索
* タグの編集

### 4. ピン留め機能

* 明日着る服やお気に入りコーデをホームに固定表示
* ホーム画面からすぐアクセス可能

### 5. 天気予報表示

* ホーム画面に天気予報を表示
* 表示地域の変更が可能

### 6. デモ仕様

デモ版ではスパム対策のため、
ログイン後のみデータベース更新操作が可能です。

---

## Technical Stack

* Framework: Next.js
* Language: JavaScript
* Backend / DB: Supabase（PostgreSQL / Auth / Storage）
* External API: WeatherAPI
* PWA対応
* AI Support: ChatGPT / Claude

---

## Database Structure

### Tables

* `t_categories`（カテゴリ）
* `t_clothes`（服）
* `t_coordinations`（コーディネート）
* `t_tags`（タグ）

### Intermediate Tables（中間テーブル）

* `t_coode_clothes`
* `t_coode_tags`

### Storage

* `clothes_image`

---

## Implementation Highlights

### 戻るボタンの実装工夫

`router.back()` を使うと、削除済みページに戻ろうとしてしまう問題があったため、
URLに `from` パラメータを持たせ、遷移元に正しく戻れる設計にしました。

これにより、

服 → コーデ → 服 → 編集 → 戻る

のような複雑な遷移でも、自然に元ページへ戻れます。

---

## Design

* PWA前提のモバイルファースト設計
* タップしやすい大きめボタン
* タグは視認性の高い配色
* 既存アプリのUIを研究して設計

---

## Future Improvements

* デモデータの整備
* ローディング画面の実装
* コードのリファクタリング
* パフォーマンス最適化
