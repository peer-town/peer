import { NavBar } from "../NavBar";

const Layout = (props) => {

  return (
    <div className="flex min-h-screen flex-col">
      <NavBar
        handleDiscordUser = {props.handleDiscordUser}
        handleDidSession = {props.handleDidSession}
       />
      <div className="relative mx-auto w-full max-w-7xl grow px-5 lg:px-0">
        {props.children}
      </div>
    </div>
  );
};

export default Layout;
