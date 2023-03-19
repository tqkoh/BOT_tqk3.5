// traQのAPIを使いたい場合
import { Apis, Configuration as TraQConfiguration } from "@traptitech/traq";
import { readFileSync } from "fs";

const BOT_ID = process.env.HUBOT_TRAQ_BOT_ID;
const TOKEN = process.env.HUBOT_TRAQ_ACCESS_TOKEN;
const SUB_CHANNEL_ID = "8c8172ca-8f7d-4204-b252-4e1e9b6f236b";
const REPLY_DELAY = 500;
const traQConfiguration = new TraQConfiguration({
  accessToken: TOKEN,
});
const traq = new Apis(traQConfiguration); // api.hoge()でtraQのAPIが使える

const help = readFileSync("docs/help.md", "utf-8");

interface Count {
  count: number;
}

const debugChannelId = "8c8172ca-8f7d-4204-b252-4e1e9b6f236b";
// pool.getConnection().then((conn) => {
//   const countQuery =
//     "SELECT COUNT(*) AS count FROM channels WHERE channel_id = ?";
//   conn.query<Count[]>(countQuery, [debugChannelId]).then((rows) => {
//     if (rows[0].count > 0) {
//       console.log("sude");
//       return;
//     }
//     const query = "INSERT INTO channels (channel_id) VALUES (?)";
//     conn.query(query, [debugChannelId]).then((_) => {
//       console.log("oisu");
//     });
//   });
// });

module.exports = (robot) => {
  robot.hear(/腹痛/, async (res) => {
    res.send({ type: "stamp", name: "odaijini" });
  });
  robot.hear(/(やる|やるぞ|する|するぞ)$/, async (res) => {
    res.send({ type: "stamp", name: "ganbare-" });
  });
  robot.hear(/いい\?$/, async (res) => {
    res.send({ type: "stamp", name: "iiyp" });
  });
  robot.hear(/(いいですか.|ok\?|ok？)$/, async (res) => {
    res.send({ type: "stamp", name: "okk" });
  });
  robot.hear(
    /^(おはよ.*|おは|ご|ごらげ|おはすた|おはござ|おきくらげ|おき|:ohagoza:|:ohasta:|:ohao:|:go:)$/,
    async (res) => {
      res.send({ type: "stamp", name: "go" });
    }
  );
  robot.hear(
    /^(寝る.?|ねる.?|ねぶ|ねぬ゛|ねま.?|:oyasumi:|:ayase_oyasumi:)$/,
    async (res) => {
      res.send({ type: "stamp", name: "ayase_oyasumi" });
    }
  );
  robot.hear(/^tqk/i, async (res) => {
    res.send({ type: "stamp", name: "ore" });
  });
  robot.hear(/(.tqk)/i, async (res) => {
    const s = res.match[1];
    if (s[0] === "_") return;
    res.send({ type: "stamp", name: "ore" });
  });
  robot.hear(/^BOT_tqk/i, async (res) => {
    res.send({ type: "stamp", name: "eye_chuukunn" });
    setTimeout(() => {
      res.send({ type: "stamp", name: "ayase_eye2" });
    });
  });
  robot.hear(/(.BOT_tqk)/i, async (res) => {
    const s = res.match[1];
    if (s[0] === "@") return;
    res.send({ type: "stamp", name: "eye_chuukunn" });
    setTimeout(() => {
      res.send({ type: "stamp", name: "ayase_eye2" });
    });
  });
  robot.hear(/(ぶ|部|ぬ゛)/, async (res) => {
    const buOrNu = res.match[1];
    if (
      /[ンんね寝][部ぶぬ゛]|内部|若乱舞|帰宅部|.飯部|疲れ部|つかれぶ/.test(
        buOrNu
      )
    ) {
      res.send({ type: "stamp", name: "bu" });
    } else {
      res.send({ type: "stamp", name: "flag_nu" });
    }
  });
  robot.hear(/わからん/, async (res) => {
    res.send({ type: "stamp", name: "bu" });
  });
  robot.hear(/(できた|:kan:)$/, async (res) => {
    res.send({ type: "stamp", name: "tada" });
  });
  robot.hear(/おいす$/, async (res) => {
    res.send({ type: "stamp", name: "oisu-1" });
    res.send({ type: "stamp", name: "oisu-2" });
    res.send({ type: "stamp", name: "oisu-3" });
  });
  robot.hear(/:ayase_iyaa:|あやせいやあ/, async (res) => {
    res.send({ type: "stamp", name: "ayase_iyaa" });
  });
};
