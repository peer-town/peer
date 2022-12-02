import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@devnode/database";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { challengeCode } = req.query;

  let challenge = await prisma.discordChallenge
    .findFirstOrThrow({
      where: {
        challengeCode: String(challengeCode),
      },
    })
    .catch((e) => {
      res.status(200).json({ error: "Error fetching from the db" });
      return;
    });

  if (!challenge || !challenge.discordUsername) {
    res.status(200).json({ error: "No db entry" });
    return;
  }

  if (challengeCode != challenge.challengeCode) {
    res.status(200).json({ error: "Challenge code incorrect" });
    return;
  }

  await prisma.discordChallenge.delete({
    where: {
      challengeCode: challengeCode,
    },
  });

  let user = await prisma.user.upsert({
    where: {
      didkey: challenge.did,
    },
    create: {
      discordUsername: challenge.discordUsername,
      discordAvatar: challenge.discordAvatar,
      didkey: challenge.did,
      didpkh: "",
      didSession: "",
    },
    update: {
      discordUsername: challenge.discordUsername,
      discordAvatar: challenge.discordAvatar,
    },
  });

  res.status(200).json({
    success: `Challenge code correct: ${user.didkey}, ${user.discordUsername}`,
  });
}
