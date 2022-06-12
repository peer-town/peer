import Link from "next/link";
import { HeartIcon, ChatIcon } from "@heroicons/react/outline";

const QuestionCard = ({ question }) => {
  const { id, title, body, author, timePassed, datePosted, likes, comments } =
    question;

  return (
    <Link href={`/${id}`} passHref>
      <div className="min-h-[180px] bg-white border-[#EBEAEB] border-[1px] rounded-[16px] cursor-pointer hover:border-[#08010D]">
        <div className="px-[10px] pt-[14px] pb-[10px] sm:px-[24px] sm:pt-[28px] sm:pb-[20px] space-y-[8px]">
          <div className="text-[24px] font-medium">{title}</div>
          <div className="text-[#858189] text-[16px] font-medium leading-[28px]">
            {body}
          </div>
        </div>
        <div className="px-[10px] py-[7px] sm:px-[24px] sm:py-[12px] border-[#EBEAEB] border-t-[1px] flex justify-between items-center text-[#7A767E] text-[11px] font-ibm sm:text-[14px] sm:gap-[66px] sm:justify-start">
          <div className="flex gap-[32px]">
            <div className="flex gap-[8px]">
              <img
                className="w-[20px] h-[20px] rounded-full"
                src={author.avatar}
              />
              <div className="text-black">{author.name}</div>
            </div>
          </div>
          <div className="flex gap-[32px]">
            <div>{timePassed}</div>
            <div>{datePosted}</div>
          </div>
          <div className="hidden md:flex gap-[32px]">
            <div className="flex items-center gap-[10px]">
              <HeartIcon className="w-[20px] h-[18px]" />
              <div>{likes}</div>
            </div>
            <div className="flex items-center gap-[10px]">
              <ChatIcon className="w-[20px] h-[18px]" />
              <div>{comments}</div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default QuestionCard;
