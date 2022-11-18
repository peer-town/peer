import Link from "next/link";
import { HeartIcon, ChatIcon } from "@heroicons/react/outline";

const QuestionCard = ({ thread }) => {
  const { id, community, title, author, createdAt } = thread;

  return (
    <Link href={`/${id}`} passHref>
      <div className="min-h-[180px] cursor-pointer rounded-[16px] border-[1px] border-[#EBEAEB] bg-white hover:border-[#08010D]">
        <div className="space-y-[8px] px-[10px] pt-[14px] pb-[10px] sm:px-[24px] sm:pt-[28px] sm:pb-[20px]">
          <div className="text-[24px] font-medium">
            {title} - Discord community ID: {community}
          </div>
          <div className="text-[16px] font-medium leading-[28px] text-[#858189]">
            {/* {body} */}
          </div>
        </div>
        <div className="font-ibm flex items-center justify-between border-t-[1px] border-[#EBEAEB] px-[10px] py-[7px] text-[11px] text-[#7A767E] sm:justify-start sm:gap-[66px] sm:px-[24px] sm:py-[12px] sm:text-[14px]">
          <div className="flex gap-[32px]">
            <div className="flex gap-[8px]">
              <img
                className="h-[20px] w-[20px] rounded-full"
                src={author.avatar}
              />
              <div className="text-black">{author.name}</div>
            </div>
          </div>
          <div className="flex gap-[32px]">
            <div>{createdAt}</div>
          </div>
          <div className="hidden gap-[32px] md:flex">
            <div className="flex items-center gap-[10px]">
              <HeartIcon className="h-[18px] w-[20px]" />
              {/* <div>{likes}</div> */}
            </div>
            <div className="flex items-center gap-[10px]">
              <ChatIcon className="h-[18px] w-[20px]" />
              {/* <div>{comments}</div> */}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default QuestionCard;
