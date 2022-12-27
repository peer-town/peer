import Link from "next/link";
import { trpc } from "../../utils/trpc";
import Image from "next/image";

const ThreadCard = ({ thread }) => {
  const { id, title, author, createdAt } = thread;

  const allComments = trpc.public.getAllComments.useQuery();

  const user = trpc.public.getAuthor.useQuery({
    pkh: author.id,
  });

  if (!allComments.data) return <div>Loading</div>;

  const commentsForThread = allComments.data
    .filter((comment) => comment.node.threadID == id)
    .map((comment) => comment.node);

  return (
    <Link href={`/${id}`} passHref>
      <div className="min-h-[180px] cursor-pointer rounded-[16px] border-[1px] border-[#EBEAEB] bg-white hover:border-[#08010D]">
        <div className="space-y-[8px] px-[10px] pt-[14px] pb-[10px] sm:px-[24px] sm:pt-[28px] sm:pb-[20px]">
          <div className="flex items-center gap-3">
            <Image
              width={32}
              height={32}
              className="rounded-full"
              src={user.data?.discordAvatar ?? "http://placekitten.com/200/200"}
              alt=""
            />
            <div>
              <div className="font-semibold">
                {user.data?.discordUsername ?? "Anonymous"}
              </div>
              <div className="font-light text-gray-400">{author.id}</div>
            </div>
          </div>
          <div className="text-[24px] font-semibold text-gray-700">{title}</div>
        </div>
        <div className="font-ibm flex items-center justify-end border-t-[1px] border-[#EBEAEB] px-[10px] pt-[7px] text-[11px] text-gray-400">
          <div>{new Date(createdAt).toLocaleString()}</div>
        </div>
        <div className="px-5 pb-5 text-[16px] font-medium  text-gray-500">
          {commentsForThread.length ? (
            <div>{commentsForThread[0].text}</div>
          ) : (
            <></>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ThreadCard;
