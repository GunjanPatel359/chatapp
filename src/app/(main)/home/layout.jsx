import HomeSideBar from "./HomeSideBar";

const Layout = ({ children }) => {
  return (
    <div className="flex">
      <HomeSideBar />
      <div className="flex-1">{children}</div>
    </div>
  );
};

export default Layout;
