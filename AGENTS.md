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
├── prsk-dependabot/ # Dependabot関連のComposite Action
│   ├── action.yml # Action定義
│   ├── prsk-dependabot.constants.json # 依存関係更新の設定値
│   └── prsk-pr-rename.js # PRタイトル調整ロジック
└── prsk-pr-labeling/ # PRラベル付けのComposite Action
    ├── action.yml # Action定義
    ├── prsk-labeling-logic.js # ラベル判定ロジック
    └── prsk-yell-label.constants.json # ラベル関連の設定値
```