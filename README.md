![Glow up with...](https://capsule-render.vercel.app/api?type=waving&height=250&color=0:33dd99,100:bb88ee&text=Connection&section=header&reversal=false&fontColor=f5f5f7&fontSize=50&animation=fadeIn&desc=Link%20another%20world&descSize=0&fontAlign=45&fontAlignY=45&descAlign=55&descAlignY=60)

# **_link-sekai-actions_**

![welcome comment](https://readme-typing-svg.herokuapp.com?color=%23ffc096&width=500&lines=「さあ、推し活を始めよう。」;大丈夫&nbsp;世界はこんなに綺麗だと;)

### 💫 **_Behind the Scenes_** 💫![Leo/need-divider](https://capsule-render.vercel.app/api?type=rect&height=2&color=0:3367cc,100:f5f5f7)

推しキャラ、みんなの”好き”を普段の開発作業とつなげられたらなと

### 🎤 **_What we provide_** 🎤![VIVID-BAD-SQUAD-divider](https://capsule-render.vercel.app/api?type=rect&height=2&color=0:ee1166,100:f5f5f7)

### link-sekai-actions

- Pull Requestが開かれた際に、プロセカのキャラクターラベルを自動で付与する
- Pull Requestが開かれた際に。プロセカのキャラクターが応援のコメントをしてくれる

#### Feature

- **ランダムキャラクター選出** : PRが開かれると、プロセカキャラクターの中からランダムに1人が選ばれ、ラベルが自動で作成され、PRに付与されます
- **応援コメント** : 選ばれたキャラクターからPR作成者への応援メッセージがコメントとして投稿されます
- **ボカロとの出会いイベント** : 一定の確率で、VOCALOIDキャラクターも登場します
- **コラボストーリー** : 出会いイベント発生時には、特別なストーリーとともに2人のキャラクターからメッセージが届きます

### 🎪 **_How to use_** 🎪![WONDERLANDS-SHOWTIME-divider](https://capsule-render.vercel.app/api?type=rect&height=2&color=0:ff9900,100:f5f5f7)

#### リポジトリへのワークフロー追加

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

      - name: Set prsk label
        uses: Narumikr/link-sekai-actions/prsk-pr-labeling@v1
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
```

> [!note]
> `@v1`の部分には、利用したいバージョンタグを指定してください（例: `@v1`, `@v1.0.0`など）。最新のリリースバージョンは[Releases](https://github.com/Narumikr/link-sekai-actions/releases)ページで確認できます。

**※ファンメイド作品です**

私の大好きなプロセカという作品、でもｲﾗｽﾄは描けない、書き物や工作なども難しい。
でも何かしら創作をしたいという想いから作り始めました💫

**※本リポジトリはプロセカ公式とは一切関係ありません**
