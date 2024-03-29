import {CommunityAvatar} from "../CommunityAvatar";
import {LeftPanelProp} from "./type";
import {useRouter} from "next/router";
import * as utils from "../../utils";
import UserOnboard from "../UserOnboard/UserOnboard";
import {CommunityOnboard} from "../CommunityOnboard";
import {CommunityList} from "../CommunityList";
import {selectCommunity, useAppDispatch, useAppSelector} from "../../store";
import {GlobalAskQuestion} from "../GlobalAskQuestion";
import {md_screen} from "./styles";
import {useEffect} from "react";

const LeftPanel = (props: LeftPanelProp) => {
  const {style} = props;
  const router = useRouter();
  const dispatch = useAppDispatch();
  const isLeftPanelVisible = useAppSelector((state) => state.responsiveToggles.leftPanelToggle)

  useEffect(() =>{
    props.handleMargin(isLeftPanelVisible);
  },[isLeftPanelVisible])

  return (
      <div
          className={`fixed left-0 h-full border-r border-solid border-[#08010d12] bg-white z-[999] ${isLeftPanelVisible ? 'block' :md_screen} ${style}`}
      >
        <div className={`h-full flex flex-col justify-between`}>
          <div
              className={`relative z-[1] w-full top-0 my-[14px] flex h-auto flex-col gap-[30px] `}
          >
            <CommunityAvatar
                key={"create"}
                classes={utils.classNames(
                    "bg-slate-100	w-full rounded-full hover:rounded-xl hover:bg-slate-100"
                )}
                width={50}
                name={"DevNode "}
                image={"/peer.jpg"}
                selected={false}
                onClick={() => {
                  dispatch(selectCommunity(null));
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
                  dispatch(selectCommunity(null));
                  router.push("/feed");
                }}
            />
          </div>
          <hr className="my-2"/>
          <div
              className={` relative z-0 w-full top-0 my-[14px] flex h-full flex-col gap-[15px] items-center overflow-scroll scrollbar-hide`}>
            <CommunityOnboard/>
            <CommunityList/>
          </div>
          <hr className="my-2"/>
          <div
              className={`relative z-[1] bottom-0 mt-[14px] flex h-auto flex-col gap-[15px] w-full items-center justify-center`}
          >
            <GlobalAskQuestion/>
            <UserOnboard/>
          </div>
        </div>
      </div>
  );
};
export default LeftPanel;
