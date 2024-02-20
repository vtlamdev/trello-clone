import { Link } from "react-router-dom";
import GridViewIcon from "@mui/icons-material/GridView";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import SettingsIcon from "@mui/icons-material/Settings";
import Board, { CreateNewBoard } from "./Board";
import { DecodeJWT } from "../../base/helper/DecodeJWT";
import { useAllWorkspaceContext } from "../../pages/main/WorkspaceContex/WorkspaceContex";

import { WorkspaceDataModel } from "../../pages/main/WorkspaceContex/WorkspaceModel";
import APIClient from "../../base/networking/APIClient";
import { ResponseData } from "../../models/responseModel";
import { RequestData } from "../../models/requestModel";
import { UserExpired } from "../../base/helper/DecodeJWT";
import { useNavigate } from "react-router-dom";
export default function Workspace({
  workspace,
}: {
  workspace: WorkspaceDataModel;
}) {
  const { fetchData } = useAllWorkspaceContext();
  const userToken = localStorage.getItem("AccessToken");
  const navigate = useNavigate();
  const apiClient: APIClient = new APIClient();
  const userInfor = DecodeJWT();
  async function handleClickstared(board_id: string) {
    try {
      if (userToken) {
        if (!UserExpired()) {
          navigate("/login");
        } else {
          const responseData: ResponseData =
            await apiClient.putAuthenticatedData(
              `/board/starBoard`,
              {} as RequestData,
              {
                board_id: board_id,
              },
              userToken
            );
          if (responseData.success) {
            fetchData();
          }
        }
      }
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-row justify-between items-center gap-8">
        <div className="flex flex-row gap-2 justify-center items-center">
          <div className="w-8 h-8 bg-red-300 text-center flex flex-row items-center justify-center">
            {workspace.name.charAt(0)}
          </div>
          <p className="font-bold ">{workspace?.name}</p>
        </div>
        <div className="flex flex-row justify-center items-center gap-8">
          <Link
            to={`/page/workspace/${workspace.workspace_id}/boards`}
            className=" bg-slate-300 hover:bg-slate-400 px-4 py-1 rounded-sm"
          >
            <div className="flex flex-row items-center justify-center gap-2">
              <GridViewIcon fontSize="small" />
              <p className="text-sm">Board</p>
            </div>
          </Link>
          <Link
            to={`/page/workspace/${workspace.workspace_id}/members`}
            className=" bg-slate-300 hover:bg-slate-400 px-4 py-1 rounded-sm"
          >
            <div className="flex flex-row items-center justify-center gap-2">
              <PeopleOutlineIcon fontSize="small" />
              <p className="text-sm">Member {workspace.members.length}</p>
            </div>
          </Link>
          <Link
            to={`/page/workspace/${workspace.workspace_id}/settings`}
            className=" bg-slate-300 hover:bg-slate-400 px-4 py-1 rounded-sm"
          >
            <div className="flex flex-row items-center justify-center gap-2">
              <SettingsIcon fontSize="small" />
              <p className="text-sm">Settings</p>
            </div>
          </Link>
        </div>
      </div>
      <div>
        <div className="grid md:grid-cols-4 grid-cols-2 grid-flow-row gap-4">
          {workspace?.boards.map((value) => (
            <div className="w-auto h-32" key={value.board_id}>
              <Board
                isStarred={value.star.includes(userInfor.data.user_id)}
                name={value.title}
                boardId={value.board_id}
                workspaceId={workspace.workspace_id}
                handleClickStared={() => {
                  handleClickstared(value.board_id);
                }}
              />
            </div>
          ))}
          <CreateNewBoard />
        </div>
      </div>
    </div>
  );
}
