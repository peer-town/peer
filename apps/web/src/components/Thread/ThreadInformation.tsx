const ThreadInformation = (props: { allComments }) => {
  return (
    <div className="hidden lg:flex lg:h-full lg:min-w-[25%] lg:pt-[165px]">
      <div className="h-full w-full space-y-[35px]">
        <div className="text-[24px] text-[#08010D]">Thread Information</div>
        <hr className="border-[#EAEAEA]" />
        <div className="space-y-[30px]">
          <div className="text-[20px] text-[#08010D]">Contributors</div>
          <div className="space-y-[24px] text-[16px] font-[500] text-[#716D76]">
            {props.allComments.data
              .map((comment) => comment.node)
              .map((commentNode) => commentNode.author.id)
              .filter((item, i, ar) => ar.indexOf(item) === i)
              .map((contributor) => {
                return (
                  <div className="flex items-center gap-[11px]">
                    {/* <div className="flex items-center">
                          <Image
                            width="28"
                            height="28"
                            src={contributor.profilePic}
                            alt="contributor pfp"
                          />
                        </div>
                        <div className="text-[#211F31]">
                          {contributor.nickname}
                        </div> */}
                    <div className="rounded-[15px] border-[1px] border-[#EBEAEB] bg-white py-[4px] px-[9px] text-[14px]">
                      {contributor.slice(17, 25)}...
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThreadInformation;
