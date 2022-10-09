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
    query: { address },
    method,
  } = req;

  if (session) {
    switch (method) {
      case "GET":
        // Get data from your database

        let user = await prisma.user.findFirst({
          where: { address: String(address) },
        });

        console.log(user);
        res.status(200).json(user);
        break;

      default:
        res.setHeader("Allow", ["GET"]);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } else {
    res.send({
      error:
        "You must be signed in to view the protected content on this page.",
    });
  }
}
