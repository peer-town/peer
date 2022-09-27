import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { DID } from "dids";
import { Ed25519Provider } from "key-did-provider-ed25519";
import { getResolver } from "key-did-resolver";
import * as bip39 from "bip39";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const seed = bip39.mnemonicToSeedSync(
    "test test test test test test test test test test junk junk"
  );
  const provider = new Ed25519Provider(seed.slice(32));
  const did = new DID({ provider, resolver: getResolver() });
  await did.authenticate();

  res.status(200).json({
    did: did.id,
  });
}
