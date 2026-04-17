# AGENTS.md

## Skills

プロジェクトではSkillsが使用可能です。必要に応じて利用してください。

**重要**: Skillsは `.claude/skills/` に配置されています。

## ディレクトリ構成

```
.
├── AGENTS.md # エージェント向けの補助ガイド
├── CLAUDE.md # プロジェクトの基本方針
├── README.md # リポジトリの概要と使い方
├── LICENSE
├── VERSION
├── common/ # 共通ユーティリティと定数
│   ├── get-prsk-key.js # プロセカキャラのKey定義やランダム選出ロジック
│   ├── prsk-accounts.constants.json # プロセカキャラのアカウント情報定義
│   └── prsk-profile.constants.json # プロセカキャラのアイコンやカラーコード定義
├── prsk-cheering/ # チアリング関連のComposite Action
│   ├── action.yml # Action定義
│   ├── workflow.js # メインワークフロー（オーケストレーション）
│   ├── prsk-labeling-logic.js # PRラベル付与ロジック
│   ├── prsk-comments-logic.js # PR応援コメント投稿ロジック
│   ├── utils.js # 共通ユーティリティ
│   └── prsk-yell-label.constants.json # ラベルや応援コメントの定義
├── prsk-dependabot/ # Dependabot関連のComposite Action
│   ├── action.yml # Action定義
│   ├── prsk-notice.constants.json # 依存関係更新のコメント定義
│   └── prsk-pr-rename.js # PRタイトル変換ロジック
├── prsk-doctor-deps/ # 依存関係と脆弱性診断のComposite Action
│   ├── action.yml # Action定義
│   ├── prsk-doctor-deps.js # キャラクター選出ロジック
│   ├── prsk-generate-report.js # レポート生成ロジック
│   └── prsk-report-comment.constants.json # コメント定義
└── .github/ # GitHub ワークフロー
    └── workflows/
```