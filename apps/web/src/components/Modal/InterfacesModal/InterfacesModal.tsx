import {ModalProps} from "../types";
import {getDiscordAuthUrl} from "../../../config";
import {BaseModal} from "../BaseModal/BaseModal";

export const InterfacesModal = (props: ModalProps) => {
  const connectDiscord = () => {
    props.onClose();
    window.location.replace(getDiscordAuthUrl());
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
        <button
          className="w-full mt-4 mb-40 h-12 border-solid border-2 border-gray-200 rounded-md py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
          onClick={connectDiscord}
        >
          Connect discourse
        </button>
      </div>
    </BaseModal>
  )
}
