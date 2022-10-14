import { Message } from "discord.js";

const DISCORD_REPLY = `Please check your DMs`;
const DISCORD_INITIAL_PROMPT = `Hi there! Lets get you verified. Reply with your did. It should look similar to this example: \`did:key:z6MkkyAkqY9bPr8gyQGuJTwQvzk8nsfywHCH4jyM1CgTq4KA\``;

export const onInvoke = async (message: Message) => {
  // console.log(message);
  message.reply(DISCORD_REPLY);
  message.author.send(DISCORD_INITIAL_PROMPT);
};
