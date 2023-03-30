import { CommunityAvatar } from "../CommunityAvatar";
import { LeftPanelProp } from "./type";
import { useRouter } from "next/router";
import * as utils from "../../utils";

const LeftPanel = (props: LeftPanelProp) => {
  const {style} = props;
  const router = useRouter();

  return (
    <div className={`h-screen border-r border-solid border-[#08010d12] fixed left-0 ${style}`}>
      <div className={`h-auto fixed top-0 z-1 flex flex-col gap-[30px] my-[14px]`}>
      <CommunityAvatar
            key={"create"}
            classes={utils.classNames(
              "bg-slate-100	w-full rounded-full hover:rounded-xl hover:bg-slate-100"
            )}
            width={50}
            name={"DevNode "}
            image={"/devnode.png"}
            selected={false}
            onClick={() =>{ router.push("/")}}
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
            onClick={() =>{}}
          />
      </div>
      <div>

      </div>
      <div className={`h-auto fixed bottom-0 z-1 flex flex-col gap-[30px] my-[14px]`}>
            
      </div>
    </div>
  );
};
export default LeftPanel;
