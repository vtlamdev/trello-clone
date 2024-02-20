import React from "react";
import HomePage from "./Content/Home/HomePage";
import SideBar from "./SideBar/SideBar";
import WorkspaceBoard from "./Content/WorkspaceBoard/WorkspaceBoard";
import { Routes, Route } from "react-router-dom";
const HomeContainer: React.FC = () => (
  <div className="flex flex-row p-2 gap-8  mx-1 md:mx-40 md:my-10 my-1 ">
    <SideBar />
    <div className="w-full">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/w/:workspaceId/boards" element={<WorkspaceBoard />} />
      </Routes>
    </div>
  </div>
);

export default HomeContainer;
