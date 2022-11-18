import { NavBar } from "../NavBar";

const Layout = ({ children }) => {
  return (
    <div className="flex min-h-screen flex-col">
      <NavBar />
      <div className="relative mx-auto w-full max-w-7xl grow px-5 lg:px-0">
        {children}
      </div>
    </div>
  );
};

export default Layout;
