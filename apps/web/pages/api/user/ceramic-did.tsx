import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth/next";
import { getServerAuthSession } from "../../../server/common/get-server-auth-session";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerAuthSession({ req, res });

  const {
    query: { address, did },
  } = req;

  if (session) {
    await prisma.user.upsert({
      where: {
        address: String(address),
      },
      create: {
        address: String(address),
        discord: "",
        did: String(did),
        stream: "",
      },
      update: {
        did: String(did),
      },
    });
  } else {
    res.send({
      error:
        "You must be signed in to view the protected content on this page.",
    });
  }
}
