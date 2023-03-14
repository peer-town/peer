import Image from "next/image";
 
const Thread = ({ thread }) => {

  const user = thread?.User?.userPlatforms.filter((platform)=>platform.platformName == "discord")[0]

  const avatar =
    user?.platformAvatar !== ""
      ? user?.platformAvatar
      : "http://placekitten.com/200/200";

  return (
    <div className="space-y-[23px]">
      <div className="flex items-center gap-[11px]">
        <div className="flex items-center"></div>
        <div className="flex items-center gap-2 text-[12px] text-[#211F31] lg:text-[16px]">
          <Image
            width="32"
            height="32"
            className="rounded-full"
            src={avatar}
            alt=""
          />
          <div>
            <div className="font-semibold">
              {user?.data?.discordUsername ?? "Anonymous"}
            </div>
            <div className="font-light text-gray-400">{thread?.author?.id}</div>
          </div>
        </div>
        <div className="ml-[10px] text-[12px]  text-[#A39DAA] lg:ml-[40px] lg:text-[16px]">
          {new Date(thread.createdAt).toLocaleString()}
        </div>
      </div>

      <div className="text-[48px] font-semibold text-gray-700">
        {thread?.title}
      </div>
    </div>
  );
};

export default Thread;
