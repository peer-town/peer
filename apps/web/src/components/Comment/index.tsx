import Image from "next/image";
import { trpc } from "../../utils/trpc";

export interface CommentProps {
  data: {
    id: string;
    author: {
      id: string;
    };
    text: string;
    createdAt: string;
  };
}

const Comment: React.FC<CommentProps> = ({ data }) => {
  const authorDiscord = trpc.public.getAuthorDiscordForComment.useQuery({
    commentStreamId: data.id,
  });
  const avatar = authorDiscord.data?.discordAvatar !== "" ? authorDiscord.data?.discordAvatar : "http://placekitten.com/200/200";
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
              {authorDiscord.data?.discordUsername ?? "Anonymous"}
            </div>
            <div className="font-light text-gray-400">{data.author.id}</div>
          </div>
        </div>
        <div className="ml-[10px] text-[12px]  text-[#A39DAA] lg:ml-[40px] lg:text-[16px]">
          {new Date(data.createdAt).toLocaleString()}
        </div>
      </div>

      <div className="text-[#716D76]">{data.text} </div>
    </div>
  );
};

export default Comment;
