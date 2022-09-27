import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { DID } from "dids";
import { Ed25519Provider } from "key-did-provider-ed25519";
import { getResolver } from "key-did-resolver";
import * as bip39 from "bip39";
import { TileDocument } from "@ceramicnetwork/stream-tile";
import { CeramicClient } from "@ceramicnetwork/http-client";

const ceramic = new CeramicClient("https://ceramic-clay.3boxlabs.com");

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { streamId } = req.query;

  console.log(`increment counter for ${streamId}`);

  const seed = bip39.mnemonicToSeedSync(
    "test test test test test test test test test test junk junk"
  );
  const provider = new Ed25519Provider(seed.slice(32));
  const did = new DID({ provider, resolver: getResolver() });
  await did.authenticate();
  ceramic.did = did;

  const doc = await TileDocument.load(ceramic, streamId as string);

  let tmpContent: any = doc.content;

  tmpContent.counter = tmpContent.counter + 1;

  console.log(tmpContent);
  doc.update(tmpContent);

  res.status(200).json({
    did: did.id,
  });
}
