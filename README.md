# link-sekai-actions

GitHub ActionsでPull Requestにプロジェクトセカイのキャラクターラベルをランダムに付与するアクションです。

## 📝 どういう思いで制作をしたのか

> TODO: ここに制作の動機や背景を記載

## 🎵 どういったものを提供しているのか

**link-sekai-actions**は、GitHubリポジトリのPull Requestが開かれた際に、プロジェクトセカイ（プロセカ）のキャラクターラベルを自動で付与するGitHub Actionsです。

### 主な機能

- **ランダムキャラクター選出**: PRが開かれると、20人のプロセカキャラクターの中からランダムに1人が選ばれ、ラベルとして付与されます
- **応援コメント**: 選ばれたキャラクターからPR作成者への応援メッセージがコメントとして投稿されます
- **ボカロとの出会いイベント**: 25%の確率で、6人のVOCALOIDキャラクター（初音ミク、鏡音リン/レン、巡音ルカ、MEIKO、KAITO）も登場します
- **コラボストーリー**: 出会いイベント発生時には、特別なストーリーとともに2人のキャラクターからメッセージが届きます

### キャラクター一覧

#### プロセカキャラクター (20人)
- Leo/need: 星乃一歌、天馬咲希、望月穂波、日野森志歩
- MORE MORE JUMP!: 花里みのり、桐谷遥、桃井愛莉、日野森雫
- Vivid BAD SQUAD: 小豆沢こはね、白石杏、東雲彰人、青柳冬弥
- ワンダーランズ×ショウタイム: 天馬司、鳳えむ、草薙寧々、神代類
- 25時、ナイトコードで。: 宵崎奏、朝比奈まふゆ、東雲絵名、暁山瑞希

#### VOCALOIDキャラクター (6人)
- 初音ミク、鏡音リン、鏡音レン、巡音ルカ、MEIKO、KAITO

## 🚀 具体的な使い方

### セットアップ方法

1. **リポジトリへのワークフロー追加**

リポジトリの `.github/workflows/` ディレクトリに以下のようなワークフローファイルを作成します：

```yaml
name: PR prsk labeling

on:
  pull_request:
    types: [opened]

permissions:
  issues: write
  pull-requests: write
  contents: read

jobs:
  add-character-label:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Add prsk label
        uses: Narumikr/link-sekai-actions/prsk-pr-labeling@main
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
```

2. **動作確認**

Pull Requestを開くと、自動的にキャラクターラベルとコメントが追加されます。

### カスタマイズ

#### 出会い確率の変更

デフォルトではVOCALOIDキャラクターとの出会いは25%の確率で発生します。この確率を変更したい場合は、`prsk-pr-labeling/prsk-labeling-logic.js`の`isEncounter`関数の引数を変更してください。

## 🛠️ 技術スタック

- **GitHub Actions**: CI/CDプラットフォーム
- **JavaScript (ES6+)**: アクションのロジック実装
- **actions/github-script@v8**: GitHub APIとの連携
- **Composite Actions**: 再利用可能なアクションの構成

### 主要な依存関係

- `actions/checkout@v4`: リポジトリのチェックアウト
- `actions/github-script@v8`: GitHub APIへのアクセスとスクリプト実行

## 📂 プロジェクト構成

```
.
├── .github/
│   ├── workflows/
│   │   ├── prsk-pr-labeling.yml    # サンプルワークフロー
│   │   └── auto-release.yml         # 自動リリースワークフロー
│   └── dependabot.yml               # Dependabot設定
└── prsk-pr-labeling/
    ├── action.yml                    # アクションのメタデータ
    ├── prsk-yell-label.constants.js  # キャラクター定義
    └── prsk-labeling-logic.js        # メインロジック
```

## 🎨 特徴

### カラフルなラベル
各キャラクターには個別のカラーコードが設定されており、PRが見やすく楽しくなります。

### パーソナライズされたメッセージ
すべてのキャラクターが、PR作成者の名前を含んだ個別のメッセージを持っています。

### 特別なイベント
25%の確率で発生する出会いイベントでは、5種類のコラボストーリーからランダムに1つが選ばれ、特別な体験が提供されます。

## 📄 ライセンス

このプロジェクトは個人利用を目的としています。プロジェクトセカイのキャラクターおよび関連する知的財産は、SEGA/Colorful Paletteに帰属します。

## 🤝 コントリビューション

Issue、Pull Requestは歓迎します！

---

Made with ❤️ for Project SEKAI fans
