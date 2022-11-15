const DISCORD_CANNOT_DELETE_MESSAGE_PERMISSIONS =
  "I should delete this but I can't! ADMIN PLS HELP!";

const DISCORD_DO_NOT_WRITE_MESSAGES_OURSIDE_THREADS =
  "You can only start threads or reply to threads in the devnode channel";

const DISCORD_DO_NOT_CREATE_THREADS_IF_NOT_SIGNED =
  "You must sign in on DevNode to create threads.";

const DISCORD_BOT_NAME = "devnode-bot";
const API_ENDPOINT = `${process.env.NEXTAUTH_URL}api/user/discord-auth`;

const DISCORD_DM_CHALLENGE_SUCCESS = `Great! Your challenge code is: \`${API_ENDPOINT}\`/`;
const DISCORD_DM_INVALID_DID =
  "Oops! That doesn't look right. It looks like this: `did:key:z6MkkyAkqY9bPr8gyQGuJTwQvzk8nsfywHCH4jyM1CgTq4KA`";

export {
  DISCORD_BOT_NAME,
  DISCORD_CANNOT_DELETE_MESSAGE_PERMISSIONS,
  DISCORD_DO_NOT_WRITE_MESSAGES_OURSIDE_THREADS,
  DISCORD_DO_NOT_CREATE_THREADS_IF_NOT_SIGNED,
  DISCORD_DM_CHALLENGE_SUCCESS,
  DISCORD_DM_INVALID_DID,
};
