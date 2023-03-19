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
  robot.hear(/いい?$/, async (res) => {
    res.send({ type: "stamp", name: "ganbare-" });
  });
};
