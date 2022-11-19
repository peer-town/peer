import { MessageProps } from "./Message.d";

const Message: React.FC<MessageProps> = ({ data }) => {
  return (
    <div className="space-y-[23px]">
      <div className="flex items-center gap-[11px]">
        <div className="flex items-center"></div>
        <div className="text-[12px] text-[#211F31] lg:text-[16px]">
          {data.author.id}
        </div>
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
