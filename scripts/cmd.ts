// traQのAPIを使いたい場合
import { Apis, Configuration as TraQConfiguration } from "@traptitech/traq";
import { readFileSync } from "fs";
import { pool } from "./db";

const BOT_ID = process.env.HUBOT_TRAQ_BOT_ID;
const TOKEN = process.env.HUBOT_TRAQ_ACCESS_TOKEN;
const SUB_CHANNEL_ID = "8c8172ca-8f7d-4204-b252-4e1e9b6f236b";
const CHANNELS_URL = process.env.CHANNELS_URL;
const REPLY_DELAY = 500;
const traQConfiguration = new TraQConfiguration({
  accessToken: TOKEN,
});
const traq = new Apis(traQConfiguration); // api.hoge()でtraQのAPIが使える

const readme = readFileSync("readme.md", "utf-8");

// const debugChannelId = "8c8172ca-8f7d-4204-b252-4e1e9b6f236b";
// pool.getConnection().then((conn) => {
//   const query = "DELETE FROM channels WHERE channel_id = ?";
//   conn.query(query, [debugChannelId]).then((_) => {
//     console.log("kan");
//   });
//   conn.release();
// });

module.exports = (robot) => {
  robot.respond(/(おいす[ー～]?|\/?join)$/i, async (res) => {
    const { message } = res.message;
    const { channelId } = message;
    if (!channelId) {
      res.reply("チャンネルで使ってね");
      return;
    }

    res.send({ type: "stamp", name: "loading" });
    pool.getConnection().then((conn) => {
      const query = "INSERT INTO channels (channel_id) VALUES (?)";
      conn.query(query, [channelId]).then((_) => {
        res.send({ type: "stamp", name: "kan" });
        setTimeout(() => {
          res.reply("おいす");
        }, REPLY_DELAY);
      });
    });
  });
  robot.respond(/\/?leave$/i, async (res) => {
    const { message } = res.message;
    const { channelId } = message;

    res.send({ type: "stamp", name: "loading" });
    pool.getConnection().then((conn) => {
      const query = "DELETE FROM channels WHERE channel_id = ?";
      conn.query(query, [channelId]).then((_) => {
        res.send({ type: "stamp", name: "kan" });
        setTimeout(() => {
          res.reply(":wave:");
        }, REPLY_DELAY);
      });
    });
  });
  robot.respond(/(たすけて|help)$/i, async (res) => {
    const { message } = res.message;
    const { user } = message;
    if (user.bot) return;
    setTimeout(() => {
      res.reply(readme);
    }, REPLY_DELAY);
  });
};
