import React from "react";
import Topbar from "../Layout/Topbar";
import Navbar from "./Navbar";
import { useGetCsrfQuery } from "../../redux/slices/csrfApiSlice";

const Header = () => {
  useGetCsrfQuery();
  return (
    <header className="border-b border-gray-200">
      {/* Top Bar */}
      <Topbar />
      {/* Nav Bar */}
      <Navbar />
      {/* Cart Drawer */}
    </header>
  );
};

export default Header;
