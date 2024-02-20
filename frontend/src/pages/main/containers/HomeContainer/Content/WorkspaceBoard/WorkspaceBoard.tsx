import {
  StaredBoard,
  YourBoard,
} from "../../../../../../components/HomePage/Board";
import WorkspaceTitle from "../../../../../../components/HomePage/WorkspaceTitle";
import Divider from "@mui/material/Divider";
import { useParams } from "react-router-dom";
import { useAllWorkspaceContext } from "../../../../WorkspaceContex/WorkspaceContex";
import { useEffect, useState } from "react";
import { DecodeJWT } from "../../../../../../base/helper/DecodeJWT";
import {
  WorkspaceDataModel,
  BoardModel,
} from "../../../../WorkspaceContex/WorkspaceModel";

export default function WorkspaceBoard() {
  const userInfor = DecodeJWT();
  const { allWorkspace } = useAllWorkspaceContext();
  const { workspaceId } = useParams();
  const [getWorkspaceById, setGetWorkspaceById] = useState<
    WorkspaceDataModel | undefined
  >();
  useEffect(() => {
    setGetWorkspaceById(
      workspaceId
        ? allWorkspace?.data.find(
            (workspace) => workspace.workspace_id === workspaceId
          )
        : undefined
    );
  }, [workspaceId]);
  useEffect(() => {
    setIsStaredBoard(
      getWorkspaceById?.boards.some((board) =>
        board.star.includes(userInfor.data.user_id)
      ) ?? false
    );
  }, [getWorkspaceById]);
  const [isStaredBoard, setIsStaredBoard] = useState<boolean>();
  const [staredBoard, setStaredBoard] = useState<BoardModel[] | undefined>(
    undefined
  );

  useEffect(() => {
    setStaredBoard(
      getWorkspaceById?.boards
        .map((board) => ({
          ...board,
          workspaceId: getWorkspaceById.workspace_id,
        }))
        .filter((board) => board.star.includes(userInfor.data.user_id))
    );
  }, [getWorkspaceById]);

  useEffect(() => {
    setGetWorkspaceById(
      allWorkspace?.data.find(
        (workspace) => workspace.workspace_id === workspaceId
      )
    );
  }, [workspaceId]);
  return (
    <div className="flex flex-col gap-8">
      <WorkspaceTitle workspace={getWorkspaceById} />
      <Divider />
      {isStaredBoard ? <StaredBoard board={staredBoard} /> : null}

      <YourBoard
        board={getWorkspaceById?.boards.flatMap((board) => ({
          ...board,
          workspaceId: getWorkspaceById?.workspace_id,
        }))||[]}
      />
    </div>
  );
}
