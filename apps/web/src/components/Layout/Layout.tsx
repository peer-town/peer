import {NavBar} from "../NavBar";
import {CommunityAvatar} from "../CommunityAvatar";

const Layout = (props) => {

  return (
    <div className="flex min-h-screen flex-col">
      <NavBar
        handleDiscordUser={props.handleDiscordUser}
        handleDidSession={props.handleDidSession}
      />
      <div className="flex flex-row">
        <div className="flex flex-col gap-7 px-6 py-10 border-r h-screen sm:hidden md:flex">
          {Array(10).fill(0).map((_, index) => (
            <CommunityAvatar key={index} name={"Devnode"} image={"https://placekitten.com/200/200"}/>
          ))}
        </div>
        <div className="relative mx-auto w-full grow px-5 lg:px-0">
          {props.children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
