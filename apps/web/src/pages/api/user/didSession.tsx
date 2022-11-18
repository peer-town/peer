import { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "@devnode/database";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { did, didSession } = req.query;

  await prisma.user.upsert({
    where: {
      did: String(did),
    },
    create: {
      discord: "",
      did: String(did),
      didSession: String(didSession),
    },
    update: {
      did: String(did),
      didSession: String(didSession),
    },
  });
  res.send(200);
}
