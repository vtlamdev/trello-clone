import Workspace from "../../../../../../components/HomePage/Workspace";
import { useEffect, useState } from "react";
import {
  StaredBoard,
  RecentBoard,
} from "../../../../../../components/HomePage/Board";
import { useAllWorkspaceContext } from "../../../../WorkspaceContex/WorkspaceContex";
import { DecodeJWT } from "../../../../../../base/helper/DecodeJWT";
import { BoardModel } from "../../../../WorkspaceContex/WorkspaceModel";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
export default function HomePage() {
  const { allWorkspace, isLoadingWorkspace } = useAllWorkspaceContext();
  const [isStaredBoard, setIsStaredBoard] = useState<boolean>();
  const [staredBoard, setStaredBoard] = useState<BoardModel[] | undefined>(
    undefined
  );
  const [recentBoard, setRecentBoard] = useState<BoardModel[] | undefined>(
    undefined
  );
  const userInfor = DecodeJWT();
  useEffect(() => {
    setStaredBoard(
      allWorkspace?.data
        .flatMap((workspace) => {
          const workspaceId = workspace.workspace_id;
          return workspace.boards.map((board) => ({
            ...board,
            workspaceId: workspaceId,
          }));
        })
        .filter((board) => board.star.includes(userInfor.data.user_id))
    );
    setRecentBoard(
      allWorkspace?.data
        .flatMap((workspace) => {
          const workspaceId = workspace.workspace_id;
          return workspace.boards.map((board) => ({
            ...board,
            workspaceId: workspaceId,
          }));
        })
        .sort((a, b) => (a.updated_at > b.updated_at ? 1 : -1))
        .slice(0, 5)
    );
  }, [allWorkspace]);
  useEffect(() => {
    setIsStaredBoard(
      allWorkspace?.data
        .flatMap((workspace) => workspace.boards)
        .some((board) => board.star.includes(userInfor.data.user_id)) ?? false
    );
  }, [allWorkspace]);
  return (
    <div className="flex flex-col gap-8">
      {isStaredBoard ? <StaredBoard board={staredBoard} /> : null}
      <RecentBoard board={recentBoard} />
      {allWorkspace?.data.map((workspace) => (
        <Workspace workspace={workspace} key={workspace.workspace_id} />
      ))}
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoadingWorkspace}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
}
