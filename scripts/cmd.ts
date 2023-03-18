// traQのAPIを使いたい場合
import { Apis, Configuration as TraQConfiguration } from "@traptitech/traq";
import { readFileSync } from "fs";
import { Channel, pool } from "./db";

const BOT_ID = process.env.HUBOT_TRAQ_BOT_ID;
const TOKEN = process.env.HUBOT_TRAQ_ACCESS_TOKEN;
const SUB_CHANNEL_ID = "8c8172ca-8f7d-4204-b252-4e1e9b6f236b";
const CHANNELS_URL = process.env.CHANNELS_URL;
const REPLY_DELAY = 500;
const traQConfiguration = new TraQConfiguration({
  accessToken: TOKEN,
});
const traq = new Apis(traQConfiguration); // api.hoge()でtraQのAPIが使える

const help = readFileSync("help.md", "utf-8");

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
  robot.respond(/(おいす[ー～]?|\/?join)$/i, async (res) => {
    const { message } = res.message;
    const { channelId } = message;
    if (!channelId) {
      res.reply("チャンネルで使ってね");
      return;
    }

    res.send({ type: "stamp", name: "loading" });
    pool.getConnection().then((conn) => {
      const countQuery =
        "SELECT COUNT(*) AS count FROM channels WHERE channel_id = ?";
      conn.query<Count[]>(countQuery, [channelId]).then((rows) => {
        if (rows[0].count > 0) {
          res.send({ type: "stamp", name: "ayase_howaaa" });
          setTimeout(() => {
            res.reply("すでに参加してるよ");
          }, REPLY_DELAY);
          return;
        }
        const query =
          "INSERT INTO channels (frequency, channel_id) VALUES (?, ?)";
        conn.query(query, [5, channelId]).then((_) => {
          res.send({ type: "stamp", name: "kan" });
          setTimeout(() => {
            res.reply("おいす");
          }, REPLY_DELAY);
        });
      });
    });
  });
  robot.respond(/\/?leave$/i, async (res) => {
    const { message } = res.message;
    const { channelId } = message;

    res.send({ type: "stamp", name: "loading" });
    pool.getConnection().then((conn) => {
      const countQuery =
        "SELECT COUNT(*) AS count FROM channels WHERE channel_id = ?";
      conn.query<Count[]>(countQuery, [channelId]).then((rows) => {
        if (rows[0].count < 1) {
          res.send({ type: "stamp", name: "eyes_komatta" });
          setTimeout(() => {
            res.reply("もともと参加して内部");
          }, REPLY_DELAY);
          return;
        }

        const query = "DELETE FROM channels WHERE channel_id = ?";
        conn.query(query, [channelId]).then((_) => {
          res.send({ type: "stamp", name: "kan" });
          setTimeout(() => {
            res.reply(":wave:");
          }, REPLY_DELAY);
        });
      });
    });
  });
  robot.respond(/\/?freq$/i, async (res) => {
    const { message } = res.message;
    const { channelId } = message;
    res.reply(
      "\n- `@BOT_tqk /freq {n}`: n (>= 1) 時間に一回くらいしゃべるようにします デフォルトは 5"
    );
    pool.getConnection().then((conn) => {
      const query = "SELECT * FROM channels WHERE channel_id = ?";
      conn.query<Channel[]>(query, [channelId]).then((rows) => {
        if (rows.length < 1) {
          return;
        }
        const channel = rows[0];
        res.reply(`いまは ${channel.frequency} 時間に一回くらいしゃべるよ`);
      });
    });
  });
  robot.respond(/\/?freq (.+)/i, async (res) => {
    const { message } = res.message;
    const { channelId } = message;
    let frequency: number;
    try {
      frequency = parseInt(res.match[1]);
    } catch {
      res.send({ type: "stamp", name: "eyes_komatta" });
      res.reply("整数を入れてね");
      return;
    }
    if (frequency < 0) {
      res.send({ type: "stamp", name: "eyes_komatta" });
      res.reply("1 以上の整数を入れてね");
      return;
    }
    if (frequency < 1) {
      res.send({ type: "stamp", name: "wakaru2" });
      res.reply("やだ");
      return;
    }

    res.send({ type: "stamp", name: "loading" });
    pool.getConnection().then((conn) => {
      const query = "SELECT * FROM channels WHERE channel_id = ?";
      conn.query<Channel[]>(query, [channelId]).then((rows) => {
        if (rows.length < 1) {
          return;
        }
        const channel = rows[0];
        const query = "UPDATE channels SET frequency = ? WHERE channel_id = ?";
        conn.query(query, [frequency, channelId]).then((_) => {
          res.send({ type: "stamp", name: "kan" });
          setTimeout(() => {
            res.reply(`${frequency} 時間に一回くらいつぶやくね たぶん`);
          }, REPLY_DELAY);
        });
      });
    });
  });
  robot.respond(/(たすけて|\/?help)$/i, async (res) => {
    const { message } = res.message;
    const { user } = message;
    if (user.bot) return;
    setTimeout(() => {
      res.reply(help);
    }, REPLY_DELAY);
  });
};
