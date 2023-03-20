import { NextApiRequest, NextApiResponse } from "next";
import { config } from "../../../../config";
import axios from "axios";
import { pick } from "lodash";

const getAccessToken = async (code: string) => {
  const url = `${config.discordApiEndpoint}/oauth2/token`;
  const body = new URLSearchParams({
    client_id: config.discordOAuth.clientId,
    client_secret: config.discordOAuth.clientSecret,
    redirect_uri: config.discordOAuth.redirectUrl,
    scope: "identify",
    grant_type: "authorization_code",
    code: code,
  });
  const headers = {
    "Content-Type": "application/x-www-form-urlencoded",
  };
  try {
    return await axios.post(url, body.toString(), { headers });
  } catch (e) {
    return e.response;
  }
};

const getDiscordUserProfile = async (tokenType: string, token: string) => {
  const url = `${config.discordApiEndpoint}/users/@me`;
  const headers = {
    authorization: `${tokenType} ${token}`,
  };
  try {
    return await axios.get(url, { headers: headers });
  } catch (e) {
    return e.response;
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { code } = req.query;
  if (!code) {
    return res.send(400);
  }

  const tokenResp = await getAccessToken(code as string);
  if (tokenResp.status !== 200) {
    return res.status(400).json(tokenResp.data);
  }

  const profile = await getDiscordUserProfile(
    tokenResp.data.token_type,
    tokenResp.data.access_token
  );

  if (profile.status !== 200) {
    return res.status(400).json(profile.data);
  }

  console.log("profile", profile);
  const guild = pick(tokenResp.data.guild, ["id", "name", "icon", "owner_id"]);
  console.log("guild", guild);
  const data = { guild: guild, profile: profile.data };
  console.log("data", data);

  return res.status(200).json(data);
}
