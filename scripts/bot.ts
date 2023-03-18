// traQのAPIを使いたい場合
import { Apis, Configuration as TraQConfiguration } from "@traptitech/traq";
import axios from "axios";
import {
  ChatCompletionRequestMessage,
  OpenAIApi,
  Configuration as OpenAIConfiguration,
} from "openai";

const INTERVAL = 1 * 60 * 60 * 1000; // 1h

// ShowcaseにHUBOT_TRAQ_ACCESS_TOKENという名前で保存した環境変数を取得する
const TQKSUB_CHANNEL_ID = "8c8172ca-8f7d-4204-b252-4e1e9b6f236b";
const TOKEN = process.env.HUBOT_TRAQ_ACCESS_TOKEN;
const PROMPT_URL = process.env.HUBOT_PROMPT_URL;

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
  prompt: [PromptMessage];
}

module.exports = (robot) => {
  // 起動時
  robot.send({ channelID: TQKSUB_CHANNEL_ID }, "ご");

  // メンション付き、または監視チャンネルで正規表現にマッチするメッセージが送られてきたときに反応
  const talk = (message) => {
    const { plainText, user, channelId, id } = message;
    axios
      .get<GetPromptResponse>(PROMPT_URL, { withCredentials: true })
      .then((res) => {
        const messages: ChatCompletionRequestMessage[] = res.data.prompt.map(
          (m) => {
            const role =
              m.role === "user"
                ? "user"
                : m.role === "system"
                ? "system"
                : "assistant";
            return {
              role: role,
              content: m.content,
            };
          }
        );
        openai
          .createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: messages,
            temperature: 0.9,
            max_tokens: 200,
          })
          .then((completion) => {
            console.log(completion.data.choices[0].message);
          });
      });
  };
  robot.respond(/.*/, (res) => {
    const { message } = res.message;
    const { plainText, user, channelId, id } = message;
    if (/(おいす[ー～]?|join)$/i.test(plainText) || /leave$/i.test(plainText)) {
      return;
    }
    talk(message);
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
