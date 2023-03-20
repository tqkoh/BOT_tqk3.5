// traQのAPIを使いたい場合
import {
  Apis,
  PostMessageRequest,
  Configuration as TraQConfiguration,
} from "@traptitech/traq";

const TOKEN = process.env.HUBOT_TRAQ_ACCESS_TOKEN;
const traQConfiguration = new TraQConfiguration({
  accessToken: TOKEN,
});

const traq = new Apis(traQConfiguration);
const BUGACHA_NUMBER = 10;
const BUGACHA_DELAY = 100;
const BUGACHA_MESSAGES = [
  ":bu:",
  "ぬ゛",
  ":flag_nu:",
  ":nu:",
  "(napolin)",
  ":flag_bu:",
];
const BUGACHA_PROBABILITIES = [0.5, 0.2, 0.12, 0.08, 0.05, 0.05];
const BUGACHA_NAPOLIN_INDEX = 4;
const BUGACHA_NAPOLIN_DUMMY =
  "bugacha でこれが出るたびになぽりんさんに通知が行ったら、ヤバいだろ\n//q.trap.jp/messages/49c4acce-d645-40a2-8bf3-23da6f99a81b";
const BUGACHA_NAPOLIN_MESSAGE =
  "https://q.trap.jp/messages/49c4acce-d645-40a2-8bf3-23da6f99a81b";

function napolin(res) {
  const { message } = res.message;
  const { channelId } = message;
  const payload: PostMessageRequest = {
    content: BUGACHA_NAPOLIN_DUMMY,
    embed: false,
  };
  console.log("napolin", channelId);
  traq.postMessage(channelId, payload).then((res) => {
    setTimeout(() => {
      const payload: PostMessageRequest = {
        content: BUGACHA_NAPOLIN_MESSAGE,
        embed: false,
      };
      traq.editMessage(res.data.id, payload);
    }, 200);
  });
}

module.exports = (robot) => {
  robot.hear(/bugacha/, async (res) => {
    for (let i = 0; i < BUGACHA_NUMBER; i++) {
      setTimeout(() => {
        const r = Math.random();
        let p = 0;
        for (let j = 0; j < BUGACHA_PROBABILITIES.length; j++) {
          p += BUGACHA_PROBABILITIES[j];
          if (r < p) {
            if (j === BUGACHA_NAPOLIN_INDEX) {
              napolin(res);
              break;
            }
            res.send(BUGACHA_MESSAGES[j]);
            break;
          }
        }
      }, BUGACHA_DELAY * i);
    }
  });
  robot.hear(BUGACHA_MESSAGES[BUGACHA_NAPOLIN_INDEX], async (res) => {
    const payload: PostMessageRequest = {
      content: BUGACHA_NAPOLIN_MESSAGE,
      embed: false,
    };
    traq.editMessage(res.message.id, payload);
  });
};
