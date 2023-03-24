import {InterfaceModelProps} from "../types";
import {BaseModal} from "../BaseModal/BaseModal";
import {getDiscordAuthUrl} from "../../../utils";

export const InterfacesModal = (props: InterfaceModelProps) => {
  const connectDiscord = () => {
    props.onClose();
    window.location.replace(getDiscordAuthUrl(props.type));
  }

  return (
    <BaseModal title={"add interfaces"} open={props.open} onClose={props.onClose}>
      <div id="interface-modal">
        <button
          id="discord-button"
          className="w-full mt-5 h-12 border-solid border-2 border-gray-200 rounded-md py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
          onClick={connectDiscord}
        >
          Connect discord
        </button>
      </div>
    </BaseModal>
  )
}
