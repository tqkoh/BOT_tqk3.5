// traQのAPIを使いたい場合
import { Apis, Configuration as TraQConfiguration } from "@traptitech/traq";
import axios from "axios";
import { readFileSync } from "fs";

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

// axios
//   .delete(
//     CHANNELS_URL + "api/channels/" + "8c8172ca-8f7d-4204-b252-4e1e9b6f236b"
//   )
//   .then((_) => {
//     console.log("kan");
//   })
//   .catch((e) => {
//     console.log(e);
//   });

module.exports = (robot) => {
  robot.respond(/(おいす[ー～]?|\/?join)$/i, async (res) => {
    const { message } = res.message;
    const { channelId } = message;
    if (!channelId) {
      res.reply("チャンネルで使ってね");
      return;
    }

    res.send({ type: "stamp", name: "loading" });
    axios.post(CHANNELS_URL + "api/channels/" + channelId).then((_) => {
      res.send({ type: "stamp", name: "kan" });
      setTimeout(() => {
        res.reply("おいす");
      }, REPLY_DELAY);
    });
  });
  robot.respond(/\/?leave$/i, async (res) => {
    const { message } = res.message;
    const { channelId } = message;

    res.send({ type: "stamp", name: "loading" });
    axios.delete(CHANNELS_URL + "api/channels/" + channelId).then((_) => {
      res.send({ type: "stamp", name: "kan" });
      setTimeout(() => {
        res.reply(":wave:");
      }, REPLY_DELAY);
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
