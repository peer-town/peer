import { NextApiRequest, NextApiResponse } from "next";
import { getServerAuthSession } from "../../../server/common/get-server-auth-session";
import { prisma } from "@devnode/database";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerAuthSession({ req, res });

  const { address, did, didSession } = req.query;

  if (session) {
    await prisma.user.upsert({
      where: {
        address: String(address),
      },
      create: {
        address: String(address),
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
  } else {
    res.send({
      error:
        "You must be signed in to view the protected content on this page.",
    });
  }
}
