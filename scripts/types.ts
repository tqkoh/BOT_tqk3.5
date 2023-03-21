export type User = {
  id: string;
  name: string;
  displayName: string;
  bot: boolean;
};

export type Message = {
  message: {
    id: string;
    user: User;
    channelId: string;
    text: string;
    plainText: string;
  };
};

export type Stamp = {
  type: "stamp";
  name: string;
};

export type HearResult = {
  message: Message;
  match: string[];
  reply: (text: string) => void;
  send: (message: string | Stamp) => void;
};
