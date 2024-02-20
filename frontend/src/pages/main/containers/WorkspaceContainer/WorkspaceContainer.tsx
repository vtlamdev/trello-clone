
import WorkspaceBoards from "./Content/WorspaceBoards/WorkspaceBoards";
import WorkspaceMembers from "./Content/WorkspaceMembers/WorkspaceMembers";
import WorkspaceSettings from "./Content/WorkspaceSettings/WorkspaceSettings";
import Board from "./Content/Board/Board";
import SidebarDrawer from "./SideBar/components/SidebarDrawer";
import { Routes, Route } from "react-router-dom";
export default function WorkspaceContainer() {
  return (
    <div className="workspace-container flex flex-row h-full">
      <Routes>
        <Route
          path="/:workspaceId/*"
          element={
            <SidebarDrawer>
              <Routes>
                <Route path="boards" element={<WorkspaceBoards />} />
                <Route path="members" element={<WorkspaceMembers />} />
                <Route path="settings" element={<WorkspaceSettings />} />
                <Route path="board/:boardId/card/:cardId" element={<Board />} />
                <Route path="board/:boardId" element={<Board />} />
              </Routes>
            </SidebarDrawer>
          }
        />
      </Routes>
      {/* <SidebarDrawer>
        <Routes>
          <Route path="/:workspaceId/boards" element={<WorkspaceBoards />} />
          <Route path="/:workspaceId/members" element={<WorkspaceMembers />} />
          <Route path="/:workspaceId/settings" element={<WorkspaceSettings />} />
          <Route path="/board/:boardId" element={<Board />} />
        </Routes>
      </SidebarDrawer> */}
    </div>
  );
}
