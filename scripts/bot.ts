// traQのAPIを使いたい場合
import { Apis, Configuration } from "@traptitech/traq";

const INTERVAL = 1 * 60 * 60 * 1000; // 1h

// ShowcaseにHUBOT_TRAQ_ACCESS_TOKENという名前で保存した環境変数を取得する
const TOKEN = process.env.HUBOT_TRAQ_ACCESS_TOKEN;
const api = new Apis({
  accessToken: TOKEN,
} as Configuration); // api.hoge()でtraQのAPIが使える

module.exports = (robot) => {
  // メンション付きで正規表現にマッチするメッセージが送られてきたときに反応
  robot.respond(/bu/i, (res) => {
    res.reply("nu"); // 送信者にメンション付きで返信
    // res.send(); // メッセージを受け取ったチャンネルにメンション無しで送信
    // robot.send({ channelID: "hoge" }, "fuga"); // チャンネルIDがhogeのチャンネルにfugaと送信
    // robot.send({ userID: "hoge" }, "fuga"); // ユーザーIDがhogeの人宛にDMでfugaと送信
  });

  // メンション付き、または監視チャンネルで正規表現にマッチするメッセージが送られてきたときに反応
  robot.hear(/hoge/i, (res) => {
    const { message } = res.message;
    const { plainText, user, channelId, id } = message;
    console.log(message);
    console.log(plainText); // 送信されてきたメッセージのプレーンテキスト
    console.log(user.bot); // 送信者がbotの場合true
    console.log(channelId); // メッセージが送信されたチャンネルのチャンネルID
    console.log(id); // 送信されたメッセージのメッセージID
    res.send("fuga");
    if (user.id === "tqk") {
      setInterval(() => {
        res.send("bu2");
      }, INTERVAL);
    }
  });
};
