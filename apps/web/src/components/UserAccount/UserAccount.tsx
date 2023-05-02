import {AvatarCard} from "../AvatarCard"
import {showUserProfile, toggleLeftPanel, updateDid, updateDidSession, useAppSelector} from "../../store"
import {get, isNil} from "lodash"
import {useEffect, useState} from "react";
import {useAppDispatch} from "../../store";
import {Popover} from "@headlessui/react";
import {useDisconnect} from "wagmi";

const UserAccount = (props) => {
  const user = useAppSelector((state) => state.user);
  const [isUser, setUser] = useState<boolean>(false);
  const {disconnect} = useDisconnect();
  const dispatch = useAppDispatch();

  const viewProfilehandler = () => {
    dispatch(toggleLeftPanel(false));
    dispatch(showUserProfile({userProfileId: user.id}));
  }
  const handleDisconnect = () => {
    dispatch(updateDid(null));
    dispatch(updateDidSession(null));
    disconnect();
  }
  useEffect((() => {
    setUser(!isNil(user.id))
  }), [user.id])
  return isUser ? (
      <Popover
          className="relative w-full"
      >
        <Popover.Panel>
          <div
              className={`w-[200px] absolute bottom-[30%] right-0 left-[60px] px-[12px] z-[2] ${props.popoverClass || ""}`}>
            <div className={"w-full flex flex-col bg-white border-1 shadow-xl border-gray text-center border rounded-2xl"}>
              <div className="flex justify-between items-center m-[12px] text-gray-500 cursor-pointer hover:text-gray-700"
                   onClick={handleDisconnect}>
                <span>Disconnect</span>
                <div className="w-[15px]">
                  <img src={"/logout.svg"} alt="logout" width="100%" height="100%"/>
                </div>
              </div>
              <div className="flex justify-between items-center m-[12px] text-gray-500 cursor-pointer hover:text-gray-700"
                   onClick={viewProfilehandler}>
                <span>View Profile</span>
                <div className="w-[15px]">
                  <img src={"/settings.svg"} alt="settings" width="100%" height="100%"/>
                </div>
              </div>
            </div>
          </div>
        </Popover.Panel>
        <Popover.Button className="relative w-full border-none outline-none">
          <AvatarCard
              key={user.id}
              image={get(user, "userPlatforms[0].platformAvatar")}
              imageSize={44}
              classes={"items-center justify-center mb-[14px]"}
          />
        </Popover.Button>
      </Popover>
  ) : null;
}
export default UserAccount;