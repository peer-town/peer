import { CommunityAvatar } from "../CommunityAvatar";
import { LeftPanelProp } from "./type";
import { useRouter } from "next/router";
import * as utils from "../../utils";
import UserOnboard from "../UserOnboard/UserOnboard";

const LeftPanel = (props: LeftPanelProp) => {
  const { style } = props;
  const router = useRouter();

  return (
    <div
      className={`fixed left-0 h-screen border-r border-solid border-[#08010d12] ${style}`}
    >
      <div
        className={`z-1 absolute w-full top-0 my-[14px] flex h-auto flex-col gap-[30px] `}
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
      <div></div>
      <div
        className={`z-1 absolute bottom-0 my-[14px] flex h-auto flex-col gap-[30px] w-full`}
      >
        <UserOnboard />
      </div>
    </div>
  );
};
export default LeftPanel;
