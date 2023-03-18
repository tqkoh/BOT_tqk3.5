### めも

## 使ったもの

- :ts:
- openai api
- hubot
- showcase
- mariadb

など

## 構成など

showcase で hubot 動かしてるだけ
bot console に url 入れてナンかする

[ピカイア](https://wiki.trap.jp/user/Kejun/memo/%E3%83%94%E3%82%AB%E3%82%A4%E3%82%A2%E3%81%AB%E3%82%82%E3%82%8F%E3%81%8B%E3%82%8BtraQbot)  
[ひな形](https://wiki.trap.jp/user/Rozelin/memo/bot%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%97%E3%83%88%E3%81%AE%E6%9B%B8%E3%81%8D%E6%96%B9)  
のおかげで秒でできた でかでかでかでかありがとう  

#### 開発環境

上の通りにやった

```
npm i -g yo hubot coffee-script node-cron axios openai
npm i -D typescript ts-node
```
など

#### 手元実行(やや)

```
./node_modules/.bin/ts-node scripts/bot.ts 
```

### db のマイグレーションについて

qkjudge の時と同じことをした 秒で作りたかったので
[qkjudge 開発メモ](https://github.com/tqkoh/qkjudge/blob/master/memo.md)

## gps

デバッグのいい方法がわからず
hubot 実行はなんかうまくいかなかった そこまでちゃんと調べてないけど
グローバルなところで実行する部分だけとってきてやってた  


db は参加チャンネルの情報だけ持ってる
channel_id と frequency だけ
frequency は 1 以上で、何時間に一回くらい喋るか
1 時間に 1 回、1/frequency の確率で喋ることを決定して、そっから 1 時間の間に一回喋るようにしてる
