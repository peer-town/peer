import { CommunityAvatar } from "../CommunityAvatar";
import { LeftPanelProp } from "./type";
import { useRouter } from "next/router";
import * as utils from "../../utils";
import UserOnboard from "../UserOnboard/UserOnboard";
import { CommunityOnboard } from "../CommunityOnboard";

const LeftPanel = (props: LeftPanelProp) => {
  const { style } = props;
  const router = useRouter();

  return (
    <div
      className={`fixed left-0 h-screen border-r border-solid border-[#08010d12] ${style}`}
    >
      <div
        className={`sticky z-1 w-full top-0 my-[14px] flex h-auto flex-col gap-[30px] `}
      >
          <CommunityAvatar
            key={"create"}
            classes={utils.classNames(
              "bg-slate-100	w-full rounded-full hover:rounded-xl hover:bg-slate-100"
            )}
            width={50}
            name={"DevNode "}
            image={"/devnode.png"}
            selected={false}
            onClick={() => {
              router.push("/");
            }}
          />

        <CommunityAvatar
          key={"feed"}
          classes={utils.classNames(
            "bg-slate-100	w-full rounded-full hover:rounded-xl hover:bg-slate-100"
          )}
          width={50}
          name={"Your Feed"}
          image={"/feed.png"}
          selected={false}
          onClick={() => {
            router.push("/feed");
          }}
        />
      </div>
      <div  className={` relative z-0 w-full top-0 my-[14px] flex h-auto flex-col gap-[30px] `}>
      <CommunityOnboard />
      </div>
      <div
        className={`absolute z-1 bottom-0 my-[14px] flex h-auto flex-col gap-[30px] w-full`}
      >
        <UserOnboard />
      </div>
    </div>
  );
};
export default LeftPanel;
