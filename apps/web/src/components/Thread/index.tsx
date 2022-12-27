import { trpc } from "../../utils/trpc";
import Image from "next/image";

export interface ThreadProps {
  data: {
    id: string;
    author: {
      id: string;
    };
    title: string;
    createdAt: string;
  };
}

const Thread: React.FC<ThreadProps> = ({ data }) => {
  const user = trpc.public.getAuthor.useQuery({
    pkh: data.author.id,
  });

  const avatar =
    authorDiscord.data?.discordAvatar !== ""
      ? authorDiscord.data?.discordAvatar
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
            src={user.data?.discordAvatar ?? "http://placekitten.com/200/200"}
            alt=""
          />
          <div>
            <div className="font-semibold">
              {user.data?.discordUsername ?? "Anonymous"}
            </div>
            <div className="font-light text-gray-400">{data.author.id}</div>
          </div>
        </div>
        <div className="ml-[10px] text-[12px]  text-[#A39DAA] lg:ml-[40px] lg:text-[16px]">
          {new Date(data.createdAt).toLocaleString()}
        </div>
      </div>

      <div className="text-[48px] font-semibold text-gray-700">
        {data.title}
      </div>
    </div>
  );
};

export default Thread;
