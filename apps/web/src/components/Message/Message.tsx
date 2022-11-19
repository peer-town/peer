import { MessageProps } from "./Message.d";

const Message: React.FC<MessageProps> = ({ data }) => {
  return (
    <div className="space-y-[23px]">
      <div className="flex items-center gap-[11px]">
        <div className="flex items-center">
          {/* <Image
            width="28"
            height="28"
            src={data.author.avatar}
            alt="Hard Rock Nick Profile Picture"
          /> */}
        </div>
        <div className="text-[12px] text-[#211F31] lg:text-[16px]">
          {data.author.id}
        </div>
        {/* <div className="rounded-[15px] border-[1px] border-[#EBEAEB] bg-white py-[4px] px-[9px] text-[10px] lg:text-[14px]">
          {data.author.walletAddress}
          wallet address placeholder
        </div>
        <div className="ml-[10px] text-[12px] text-[#08010D] lg:ml-[50px] lg:text-[16px]">
          {data.likes}
        </div> */}
        {/* <div className="ml-[10px] flex items-center gap-[10px]">
          <svg
            className="h-[20px] w-[20px] cursor-pointer text-[#BAB2C5] hover:text-[#08010D]"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden="true"
          >
            <path d="M0 0h24v24H0z" stroke="none" />
            <path d="M7 11v8a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1h3a4 4 0 0 0 4-4V6a2 2 0 0 1 4 0v5h3a2 2 0 0 1 2 2l-1 5a2 3 0 0 1-2 2h-7a3 3 0 0 1-3-3" />
          </svg>
          <svg
            className="h-[22px] w-[22px] cursor-pointer text-[#BAB2C5] hover:text-[#08010D]"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden="true"
          >
            <path d="M0 0h24v24H0z" stroke="none" />
            <path d="M7 13V5a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h3a4 4 0 0 1 4 4v1a2 2 0 0 0 4 0v-5h3a2 2 0 0 0 2-2l-1-5a2 3 0 0 0-2-2h-7a3 3 0 0 0-3 3" />
          </svg>
        </div> */}
        <div className="ml-[10px] text-[12px]  text-[#A39DAA] lg:ml-[40px] lg:text-[16px]">
          {new Date(data.createdAt).toLocaleString()}
        </div>
      </div>

      <div className="text-[#716D76]">
        {data.title ? data.title : data.text}{" "}
      </div>
    </div>
  );
};

export default Message;
