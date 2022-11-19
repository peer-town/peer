import Link from "next/link";
import { trpc } from "../../utils/trpc";

const QuestionCard = ({ thread }) => {
  const { id, title, author, createdAt } = thread;

  const allComments = trpc.public.getAllComments.useQuery();

  if (!allComments.data) return <div>Loading</div>;

  const commentsForThread = allComments.data
    .filter((comment) => comment.node.threadID == id)
    .map((comment) => comment.node);

  return (
    <Link href={`/${id}`} passHref>
      <div className="min-h-[180px] cursor-pointer rounded-[16px] border-[1px] border-[#EBEAEB] bg-white hover:border-[#08010D]">
        <div className="space-y-[8px] px-[10px] pt-[14px] pb-[10px] sm:px-[24px] sm:pt-[28px] sm:pb-[20px]">
          <div className="text-[24px] font-medium">{title}</div>
          <div className="flex gap-[8px]">
            <div className="text-[#858189]">{author.id}</div>
          </div>
        </div>
        <div className="font-ibm flex items-center justify-end border-t-[1px] border-[#EBEAEB] px-[10px] pt-[7px] text-[11px] text-[#7A767E]">
          <div>{new Date(createdAt).toLocaleString()}</div>
        </div>
        <div className="px-5 pb-5 text-[16px] font-medium  text-[#858189]">
          <div>{commentsForThread[0].text}</div>
        </div>
      </div>
    </Link>
  );
};

export default QuestionCard;
