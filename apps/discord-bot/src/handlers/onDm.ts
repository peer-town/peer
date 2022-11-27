import { config } from "dotenv";
config();

import { Message } from "discord.js";
import { randomString } from "@stablelib/random";
import { prisma } from "@devnode/database";
import {
  DISCORD_BOT_NAME,
  DISCORD_DM_CHALLENGE_SUCCESS,
  DISCORD_DM_INVALID_DID,
} from "../consts/replyMessages";

export const onDm = async (message: Message) => {
  const { username: handle, discriminator, id: userId } = message.author;
  if (handle === DISCORD_BOT_NAME) return;
  const username = `${handle}#${discriminator}`;
  const avatar = message.author.avatarURL() ?? "";

  console.log(message.content);
  let did = "";
  try {
    did = message.content.match(/did🔑[a-zA-z0-9:]{48}/)![0];
  } catch (e) {
    if (!did.length) {
      message.author.send(DISCORD_DM_INVALID_DID);
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
      discordUsername: username,
      discordAvatar: avatar,
      timestamp: new Date(),
      challengeCode: challengeCode,
      userId: userId,
    },
    create: {
      did: did,
      discordUsername: username,
      discordAvatar: avatar,
      timestamp: new Date(),
      challengeCode: challengeCode,
      userId: userId,
    },
  });

  message.author.send(`${DISCORD_DM_CHALLENGE_SUCCESS}${challengeCode}`);
};
