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
├── prsk-dependabot/ # Dependabot関連のComposite Action
│   ├── action.yml # Action定義
│   ├── prsk-dependabot.constants.json # 依存関係更新の設定値
│   └── prsk-pr-rename.js # PRタイトル調整ロジック
├── prsk-cheering/ # チアリング関連のComposite Action
│   ├── action.yml ＃ Action定義
│   ├── prsk-comments-logic.js # RP応援コメント投稿ロジック
│   ├── prsk-labeling-logic.js # PRラベル付与ロジック
│   ├── prsk-yell-label.constants.json # ラベルや応援コメントの定義
│   └── workflow.js # メインワークフロー
└── .github/ # GitHub ワークフロー
    └── workflows/
```