import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@devnode/database";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { challengeCode } = req.query;

  let details = await prisma.discordChallenge
    .findFirstOrThrow({
      where: {
        challengeCode: String(challengeCode),
      },
    })
    .catch((e) => {
      res.status(200).json({ error: "Error fetching from the db" });
      return;
    });

  if (!details || !details.username) {
    res.status(200).json({ error: "No db entry" });
    return;
  }

  if (challengeCode != details.challengeCode) {
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
      did: details.did,
    },
    create: {
      discord: details.username,
      did: details.did,
      didSession: "",
    },
    update: {
      discord: details.username,
    },
  });

  res.status(200).json({
    success: `Challenge code correct: ${user.did}, ${user.discord}`,
  });
}
