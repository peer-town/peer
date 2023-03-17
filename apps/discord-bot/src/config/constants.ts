export const DISCORD_CANNOT_DELETE_MESSAGE_PERMISSIONS =
  "I should delete this but I can't! ADMIN PLS HELP!";

export const DISCORD_DO_NOT_WRITE_MESSAGES_OURSIDE_THREADS =
  "You can only start threads or reply to threads in the devnode channel";

export const DISCORD_DO_NOT_CREATE_THREADS_IF_NOT_SIGNED =
  "You must sign in on DevNode to create threads.";

export const DISCORD_LOST_SESSION =
  "Ops! Looks like you used DevNode before but we lost your DID session. Can you please log in again?";

export const DISCORD_BOT_NAME = process.env.DISCORD_BOT_NAME;
export const API_ENDPOINT = `${process.env.NEXTAUTH_URL}api/user/discord-auth`;

export const DISCORD_DM_CHALLENGE_SUCCESS = `Great! Your challenge code is: \`${API_ENDPOINT}\`/`;
export const DISCORD_DM_INVALID_DID =
  "Oops! That doesn't look right. It looks like this: `did:key:z6MkkyAkqY9bPr8gyQGuJTwQvzk8nsfywHCH4jyM1CgTq4KA`";

export const constants = {
  PLATFORM_DEVNODE_ID: "devnode",
  PLATFORM_DEVNODE_NAME: "devnode",
  PLATFORM_DISCORD_NAME: "discord",
}
