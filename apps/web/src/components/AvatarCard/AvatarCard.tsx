import {AvatarCardProps} from "./types";
import Image from "next/image";
import {Badge} from "../Badge";
import * as utils from "../../utils";

export const AvatarCard = (props: AvatarCardProps) => {
  const handleAddressClick = () => {
    if (props.onAddressClick) {
      props.onAddressClick(props.address);
    }
  }

  return (
    <div id="avatar-card" className={`flex flex-row items-center gap-3 ${props.classes || ''}`}>
      <Image
        width={props.imageSize}
        height={props.imageSize}
        className="rounded-full"
        src={props.image || "https://placekitten.com/200/200"}
        alt={`${props.name} avatar`}
      />
      {props.name && <div>{props.name} </div>}
      {props.address && <Badge text={utils.formatWalletAddress(props.address)} onClick={handleAddressClick}/>}
    </div>
  )
}
