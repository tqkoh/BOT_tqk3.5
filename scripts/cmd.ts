// traQのAPIを使いたい場合
import {
  Apis,
  PostBotActionJoinRequest,
  PostBotActionLeaveRequest,
  Configuration as TraQConfiguration,
} from "@traptitech/traq";
import { readFileSync } from "fs";

const BOT_ID = process.env.HUBOT_TRAQ_BOT_ID;
const TOKEN = process.env.HUBOT_TRAQ_ACCESS_TOKEN;
const SUB_CHANNEL_ID = "8c8172ca-8f7d-4204-b252-4e1e9b6f236b";
const traQConfiguration = new TraQConfiguration({
  accessToken: TOKEN,
});
const traq = new Apis(traQConfiguration); // api.hoge()でtraQのAPIが使える

const readme = readFileSync("readme.md", "utf-8");

module.exports = (robot) => {
  robot.respond(/(おいす[ー～]?|\/?join)$/i, async (res) => {
    const { message } = res.message;
    const { channelId, id } = message;
    try {
      await traq.letBotJoinChannel(BOT_ID, {
        channelId,
      } as PostBotActionJoinRequest);
      res.send({ type: "stamp", name: "kan" });
      res.reply("おいす");
    } catch (err) {
      robot.send(
        { channelID: SUB_CHANNEL_ID },
        `${err}\n//q.trap.jp/messages/${id}`
      );
    }
  });
  robot.respond(/\/?leave$/i, async (res) => {
    const { message } = res.message;
    const { channelId, id } = message;
    try {
      await traq.letBotLeaveChannel(BOT_ID, {
        channelId,
      } as PostBotActionLeaveRequest);
      res.send({ type: "stamp", name: "kan" }, { type: "stamp", name: "wave" });
    } catch (err) {
      robot.send(
        { channelID: SUB_CHANNEL_ID },
        `${err}\n//q.trap.jp/messages/${id}`
      );
    }
  });
  robot.respond(/(たすけて|help)$/i, async (res) => {
    const { message } = res.message;
    const { user } = message;
    if (user.bot) return;
    res.reply(readme);
  });
};
