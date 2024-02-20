import { Routes, Route, useLocation } from "react-router-dom";
import { UserExpired } from "../../base/helper/DecodeJWT";
import HomeContainer from "./containers/HomeContainer/HomeContainer";
import WorkspaceContainer from "./containers/WorkspaceContainer/WorkspaceContainer";
import Profile from "./containers/Profile/Profile";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Nav from "./nav/Nav";
import UserCards from "./containers/UserCard/UserCard";
import AllWorkspaceContexProvider from "./WorkspaceContex/WorkspaceContex";

export default function MainLayout() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const UserToken=localStorage.getItem("AccessToken")
  useEffect(() => {
    if ( UserToken && !UserExpired()) {
      navigate("/login", { state: { lastPosition: pathname } });
    }
  });
  return (
    <div className="flex flex-col h-screen  relative w-full">
      <div className="fixed w-full top-0 bg-white z-10">
        <AllWorkspaceContexProvider>
          <Nav></Nav>
          <div className="h-[90vh] overflow-y-auto">
            <Routes>
              <Route path="/profile" element={<Profile />} />
              <Route path="/cards" element={<UserCards />} />
              <Route path="/home/*" element={<HomeContainer />} />
              <Route path="/workspace/*" element={<WorkspaceContainer />} />
            </Routes>
          </div>
        </AllWorkspaceContexProvider>
      </div>
    </div>
  );
}
