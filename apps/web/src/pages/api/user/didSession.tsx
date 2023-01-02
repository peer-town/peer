import { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "@devnode/database";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { did, didSession, didpkh } = req.query;

  await prisma.user.upsert({
    where: {
      didpkh: String(didpkh),
    },
    create: {
      discordUsername: "",
      discordAvatar: "",
      didkey: String(did),
      didpkh: String(didpkh),
      didSession: String(didSession),
    },
    update: {
      didkey: String(did),
      didSession: String(didSession),
    },
  });
  res.send(200);
}
