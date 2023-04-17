import {AvatarCard} from "../AvatarCard";
import * as utils from "../../utils";
import {get, uniqBy} from "lodash";

const ThreadInformation = (props: { comments }) => {
  const users = props.comments
    .map((comment) => comment.node)
    .map((comment) => comment.user);

  return (
    <div className="hidden lg:flex lg:h-full lg:min-w-[25%] lg:pt-[165px]">
      <div className="h-full w-full space-y-[35px]">
        <div className="text-[24px] text-[#08010D]">Thread Information</div>
        <hr className="border-[#EAEAEA]"/>
        <div className="space-y-[30px]">
          <div className="text-[20px] text-[#08010D]">Contributors</div>
          <div className="space-y-[24px] text-[16px] font-[500] text-[#716D76]">
            <div className="flex flex-col gap-[12px]">
              {uniqBy(users, 'id').map((contributor: any, index) => {
                const address = contributor.walletAddress;
                const image = get(contributor, "userPlatforms[0].platformAvatar");
                const name = get(contributor, "userPlatforms[0].platformUsername");
                return (
                  <AvatarCard
                    key={index}
                    image={image}
                    imageSize={28}
                    name={name}
                    address={utils.formatWalletAddress(address)}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThreadInformation;
