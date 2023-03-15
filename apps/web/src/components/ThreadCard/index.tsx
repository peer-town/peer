import Link from "next/link";
import Image from "next/image";

const ThreadCard = ({ thread }) => {
  const { id, title, author, createdAt, user } = thread;

  return (
    <Link href={`/${id}`} passHref>
      <div className="min-h-[180px] cursor-pointer rounded-[16px] border-[1px] border-[#EBEAEB] bg-white hover:border-[#08010D]">
        <div className="space-y-[8px] px-[10px] pt-[14px] pb-[10px] sm:px-[24px] sm:pt-[28px] sm:pb-[20px]">
          <div className="flex items-center gap-3">
            <Image
              width={32}
              height={32}
              className="rounded-full"
              src={user.userPlatforms[0].platformAvatar || "https://placekitten.com/200/200"}
              alt=""
            />
            <div>
              <div className="font-semibold">
                {user.userPlatforms[0].platformUsername}
              </div>
              <div className="font-light text-gray-400">{author.id}</div>
            </div>
          </div>
          <div className="text-[24px] font-semibold text-gray-700">{title}</div>
        </div>
        <div className="font-ibm flex items-center justify-end border-t-[1px] border-[#EBEAEB] px-[10px] pt-[7px] text-[11px] text-gray-400">
          <div>{new Date(createdAt).toLocaleString()}</div>
        </div>
      </div>
    </Link>
  );
};

export default ThreadCard;
