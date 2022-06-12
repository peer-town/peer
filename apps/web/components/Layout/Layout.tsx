import { NavBar } from "../NavBar";

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <div className="relative px-5 grow max-w-7xl w-full mx-auto lg:px-0">
        {children}
      </div>
    </div>
  );
};

export default Layout;
