import {
  Apis,
  PatchMeRequest,
  Configuration as TraQConfiguration,
} from "@traptitech/traq";

const TOKEN = process.env.HUBOT_TRAQ_ACCESS_TOKEN;
const traQConfiguration = new TraQConfiguration({
  accessToken: TOKEN,
});
const traq = new Apis(traQConfiguration);

const payload: PatchMeRequest = {
  displayName: "tqk",
  twitterId: "tqkmisc",
  bio: "@BOT_tqk おたすけ",
  homeChannel: "320656a2-0f43-4f80-a7f0-638baaad4084",
};
traq.editMe(payload);
