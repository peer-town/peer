import {AvatarCardProps} from "./types";
import Image from "next/image";
import {Badge} from "../Badge";

export const AvatarCard = (props: AvatarCardProps) => {
  const handleAddressClick = () => {
    if (props.addressOnClick) {
      props.addressOnClick(props.address);
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
      {props.name && <div className="font-medium">{props.name} </div>}
      {props.address && <Badge text={props.address} onClick={handleAddressClick}/>}
    </div>
  )
}
