// traQのAPIを使いたい場合
import { Apis, Configuration as TraQConfiguration } from "@traptitech/traq";
import axios from "axios";
import CronJob from "cron";
import {
  ChatCompletionRequestMessage,
  OpenAIApi,
  Configuration as OpenAIConfiguration,
} from "openai";

const TYPING_INTERVAL = 3000;
const MAX_REPLIES = 3;
const CONTEXT_LENGTH = 2;
const MAX_CHANNEL_MESSAGE_LENGTH = 50;

// ShowcaseにHUBOT_TRAQ_ACCESS_TOKENという名前で保存した環境変数を取得する
const BOT_USER_ID = "8996bb1d-31c6-472c-a99f-ee06e3728fe2";
const HOME_CHANNEL_ID = "8c8172ca-8f7d-4204-b252-4e1e9b6f236b"; // 320656a2-0f43-4f80-a7f0-638baaad4084
const TQK_NAME = "tqk";
const TQK_DUMMY = "mastqk";
const TOKEN = process.env.HUBOT_TRAQ_ACCESS_TOKEN;
const PROMPT_URL = process.env.PROMPT_URL;

const traQConfiguration = new TraQConfiguration({
  accessToken: TOKEN,
});
const traq = new Apis(traQConfiguration); // api.hoge()でtraQのAPIが使える

const openAIConfiguration = new OpenAIConfiguration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(openAIConfiguration);

interface PromptMessage {
  role: string;
  content: string;
}

interface GetPromptResponse {
  version: string;
  tweetQuestion: string;
  prompt: [PromptMessage];
  lastMessage: PromptMessage;
}

function talk(
  mention: boolean,
  plainText = "",
  robot = null,
  messageRes = {
    message: { channelID: HOME_CHANNEL_ID },
    reply: (_) => {},
    send: (_) => {},
  }
) {
  axios
    .get<GetPromptResponse>(PROMPT_URL, { withCredentials: true })
    .then((res) => {
      traq.getMessages(messageRes.message.channelID).then((channelMessages) => {
        // context を入れる
        const n = channelMessages.data.length;
        for (let i = CONTEXT_LENGTH; i > 0; i--) {
          res.data.prompt.push({
            role:
              channelMessages.data[i].userId === BOT_USER_ID
                ? "assistant"
                : "user",
            content: channelMessages.data[i].content.slice(
              0,
              MAX_CHANNEL_MESSAGE_LENGTH
            ),
          });
        }

        // 最後の文章を format
        const now = new Date();
        const timeString = `${
          ["日", "月", "火", "水", "木", "金", "土"][now.getDay()]
        }曜日の ${String(now.getHours()).padStart(2, "0")}:${String(
          now.getMinutes()
        ).padStart(2, "0")}`;
        // "日曜日の 00:00"
        res.data.lastMessage.content = res.data.lastMessage.content
          .replace(/\{% time %\}/, timeString)
          .replace(
            /\{% text %\}/,
            mention ? plainText : res.data.tweetQuestion
          );
        res.data.prompt.push(res.data.lastMessage);

        let messages: ChatCompletionRequestMessage[] = res.data.prompt.map(
          (m) => {
            const role =
              m.role === "user"
                ? "user"
                : m.role === "assistant"
                ? "assistant"
                : "system";
            return {
              role: role,
              content: m.content,
            };
          }
        );
        for (let i = messages.length - 3; i < messages.length; i++) {
          console.log(messages[i].content);
        }

        openai
          .createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: messages,
            // max_tokens: 80,
          })
          .then((completion) => {
            let replies = completion.data.choices[0].message.content
              .split("\n")
              .reduce((acc, c) => {
                if (c !== "") {
                  acc.push(c.replace(TQK_DUMMY, TQK_NAME));
                }
                return acc;
              }, []);

            for (let i = 0; i < Math.min(replies.length, MAX_REPLIES); i++) {
              setTimeout(() => {
                console.log(replies[i]);
                if (messageRes !== null) {
                  if (i === 0) {
                    messageRes.reply(
                      completion.data.choices[0].message.content
                    );
                  } else {
                    messageRes.send(completion.data.choices[0].message.content);
                  }
                } else if (robot !== null) {
                  robot.send(
                    { channelID: HOME_CHANNEL_ID },
                    completion.data.choices[0].message.content
                  );
                }
              }, TYPING_INTERVAL * i);
            }
          });
      });
    });
}

// talk(false);

module.exports = (robot) => {
  // 起動時
  robot.send({ channelID: HOME_CHANNEL_ID }, "ご");
  console.log("aasd");

  new CronJob("0 */1 * * *", () => {
    if (Math.random() < 0.2) {
      talk(false, "", robot);
    }
  }).start();

  robot.respond(/.*/, (res) => {
    const { message } = res.message;
    const { plainText, user } = message;
    if (
      /(おいす[ー～]?|\/?join)$/i.test(plainText) ||
      /\/?leave$/i.test(plainText) ||
      /(たすけて|help)$/i.test(plainText)
    ) {
      return;
    }
    talk(
      true,
      (user.name === TQK_NAME ? TQK_DUMMY : user.name) + ": " + plainText,
      robot,
      res
    );
  });
};
