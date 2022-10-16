import { config } from "dotenv";
config();

import { Client, Message } from "discord.js";
import { randomString } from "@stablelib/random";
import { prisma } from "@devnode/database";

const DISCORD_BOT_NAME = "devnode-bot";
const API_ENDPOINT = `${process.env.NEXTAUTH_URL}/api/user/discord-auth`;

const DISCORD_CHALLENGE_SUCCESS = `Great! Your challenge code is: \`${API_ENDPOINT}\`/`;
const DISCORD_INVALID_DID =
  "Oops! That doesn't look right. It looks like this: `did:key:z6MkkyAkqY9bPr8gyQGuJTwQvzk8nsfywHCH4jyM1CgTq4KA`";

export const onDm = async (message: Message, client: Client) => {
  const user = await client.users.fetch(message.author.id);

  const { username: handle, discriminator, id: userId } = message.author;
  if (handle === DISCORD_BOT_NAME) return;
  const username = `${handle}#${discriminator}`;

  console.log(message.content);
  let did = "";
  try {
    did = message.content.match(/did🔑[a-zA-z0-9:]{48}/)![0];
  } catch (e) {
    if (!did.length) {
      user.send(DISCORD_INVALID_DID);
      return;
    }
  }

  did = did.replace("🔑", ":key:");

  let challengeCode = randomString(32);

  await prisma.discordChallenge.upsert({
    where: {
      did: did,
    },
    update: {
      did: did,
      username: username,
      timestamp: new Date(),
      challengeCode: challengeCode,
      userId: userId,
    },
    create: {
      did: did,
      username: username,
      timestamp: new Date(),
      challengeCode: challengeCode,
      userId: userId,
    },
  });

  user.send(`${DISCORD_CHALLENGE_SUCCESS}${challengeCode}`);
};
