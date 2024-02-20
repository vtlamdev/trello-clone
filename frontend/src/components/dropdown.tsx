import * as React from "react";
import Dropdown from "@mui/joy/Dropdown";
import Menu from "@mui/joy/Menu";
import MenuButton from "@mui/joy/MenuButton";
import MenuItem from "@mui/joy/MenuItem";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import IconButton from "@mui/material/IconButton";
import Divider from "@mui/material/Divider";
import Avatar from "@mui/material/Avatar";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { DecodeJWT, UserExpired } from "../base/helper/DecodeJWT";
import { useNavigate } from "react-router-dom";
import { useAllWorkspaceContext } from "../pages/main/WorkspaceContex/WorkspaceContex";
import {
  WorkspaceModel,
  WorkspaceDataModel,
  BoardModel,
} from "../pages/main/WorkspaceContex/WorkspaceModel";
import { ResponseData } from "../models/responseModel";
import { RequestData } from "../models/requestModel";
import APIClient from "../base/networking/APIClient";
export default function MenuDropdown({
  name,
  listItems,
}: {
  name: string;
  listItems: string[];
}) {
  const [open, setOpen] = React.useState(false);

  const handleOpenChange = React.useCallback(
    (_event: React.SyntheticEvent | null, isOpen: boolean) => {
      setOpen(isOpen);
    },
    []
  );

  return (
    <Dropdown open={open} onOpenChange={handleOpenChange}>
      <MenuButton style={{ border: "none" }}>
        {name}{" "}
        <span>
          <ArrowDropDownIcon></ArrowDropDownIcon>
        </span>
      </MenuButton>
      <Menu>
        {listItems.map((value, index) => (
          <MenuItem key={index}>{value}</MenuItem>
        ))}
      </Menu>
    </Dropdown>
  );
}

export function WorkspaceDropdown({
  workspaces,
}: {
  workspaces: WorkspaceDataModel[];
}) {
  const [open, setOpen] = React.useState(false);

  const handleOpenChange = React.useCallback(
    (_event: React.SyntheticEvent | null, isOpen: boolean) => {
      setOpen(isOpen);
    },
    []
  );
  return (
    <Dropdown open={open} onOpenChange={handleOpenChange}>
      <MenuButton style={{ border: "none" }}>
        Workspaces
        <span>
          <ArrowDropDownIcon></ArrowDropDownIcon>
        </span>
      </MenuButton>
      <Menu className="w-[300px]">
        <div className="p-4">
          <p className="text-xl font-bold">Your workspace</p>
          {workspaces.map((value) => (
            <Link
              to={`/page/workspace/${value.workspace_id}/boards`}
              key={value.workspace_id}
            >
              <MenuItem key={value.workspace_id}>
                <p className="font-bold text-sm text-gray-800 w-full">
                  {value.name}
                </p>
              </MenuItem>
            </Link>
          ))}
        </div>
      </Menu>
    </Dropdown>
  );
}
export function RecentDropdown({
  workspace,
}: {
  workspace: WorkspaceModel | undefined;
}) {
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();
  const handleOpenChange = React.useCallback(
    (_event: React.SyntheticEvent | null, isOpen: boolean) => {
      setOpen(isOpen);
    },
    []
  );

  const userInfor = DecodeJWT();
  const { fetchData } = useAllWorkspaceContext();
  const userToken = localStorage.getItem("AccessToken");
  const apiClient: APIClient = new APIClient();
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
    <Dropdown open={open} onOpenChange={handleOpenChange}>
      <MenuButton style={{ border: "none" }}>
        Recent
        <span>
          <ArrowDropDownIcon></ArrowDropDownIcon>
        </span>
      </MenuButton>
      <Menu className="w-[300px]">
        <div className="p-4 ">
          {workspace?.data
            .flatMap((workspace) => {
              const workspaceId = workspace.workspace_id;
              return workspace.boards.map((board) => ({
                ...board,
                workspaceId: workspaceId,
              }));
            })
            .map((value) => (
              <div
                className="flex flex-row justify-between"
                key={value.board_id}
              >
                <Link
                  to={`/page/workspace/${value.workspaceId}/board/${value.board_id}`}
                  className="w-full"
                >
                  <MenuItem key={value.board_id}>
                    <div className="flex flex-row justify-between items-center w-full">
                      <div className="flex flex-col">
                        <p className="font-bold text-sm text-gray-800">
                          {value.title}
                        </p>
                        <p className="text-sm text-gray-800">
                          {value.description}
                        </p>
                      </div>
                    </div>
                  </MenuItem>
                </Link>
                <IconButton
                  onClick={() => {
                    handleClickstared(value.board_id);
                  }}
                >
                  {" "}
                  <StarBorderIcon
                    className={`w-6 ${
                      value.star.includes(userInfor.data.user_id)
                        ? "text-yellow-300"
                        : "hidden hover:block"
                    }`}
                  />
                </IconButton>
              </div>
            ))}
        </div>
      </Menu>
    </Dropdown>
  );
}
export function StarredDropdown({
  workspace,
}: {
  workspace: WorkspaceModel | undefined;
}) {
  const [open, setOpen] = React.useState(false);
  const [staredBoard, setStaredBoard] = React.useState<
    BoardModel[] | undefined
  >(undefined);

  const userInfor = DecodeJWT();
  const navigate = useNavigate();
  const { allWorkspace, fetchData } = useAllWorkspaceContext();
  const userToken = localStorage.getItem("AccessToken");
  const apiClient: APIClient = new APIClient();
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
  useEffect(() => {
    setStaredBoard(
      workspace?.data
        .flatMap((workspace) => {
          const workspaceId = workspace.workspace_id;
          return workspace.boards.map((board) => ({
            ...board,
            workspaceId: workspaceId,
          }));
        })
        .filter((board) => board.star.includes(userInfor.data.user_id))
    );
  }, [allWorkspace]);
  const handleOpenChange = React.useCallback(
    (_event: React.SyntheticEvent | null, isOpen: boolean) => {
      setOpen(isOpen);
    },
    []
  );

  return (
    <Dropdown open={open} onOpenChange={handleOpenChange}>
      <MenuButton style={{ border: "none" }}>
        Starred
        <span>
          <ArrowDropDownIcon></ArrowDropDownIcon>
        </span>
      </MenuButton>
      <Menu className="w-[300px]">
        <div className="p-4 ">
          {staredBoard !== undefined ? (
            staredBoard?.map((value) => (
              <div
                className="flex flex-row justify-between"
                key={value.board_id}
              >
                <Link
                  to={`/page/workspace/${value.workspaceId}/board/${value.board_id}`}
                  className="w-full"
                >
                  <MenuItem key={value.board_id}>
                    <div className="flex flex-row justify-between items-center w-full">
                      <div className="flex flex-col">
                        <p className="font-bold text-sm text-gray-800">
                          {value.title}
                        </p>
                        <p className="text-sm text-gray-800">
                          {value.description}
                        </p>
                      </div>
                    </div>
                  </MenuItem>
                </Link>
                <IconButton
                  onClick={() => {
                    handleClickstared(value.board_id);
                  }}
                >
                  <StarBorderIcon
                    className={`w-6 ${
                      value.star ? "text-yellow-300" : "hidden hover:block"
                    }`}
                  />
                </IconButton>
              </div>
            ))
          ) : (
            <MenuItem>
              <div className="flex flex-row justify-between">dd</div>
            </MenuItem>
          )}
        </div>
      </Menu>
    </Dropdown>
  );
}

export function NotiDropdown() {
  const [open, setOpen] = React.useState(false);

  const handleOpenChange = React.useCallback(
    (_event: React.SyntheticEvent | null, isOpen: boolean) => {
      setOpen(isOpen);
    },
    []
  );
  return (
    <Dropdown open={open} onOpenChange={handleOpenChange}>
      <MenuButton style={{ border: "none" }}>
        <NotificationsNoneIcon className="w-6 rotate-45" />
      </MenuButton>
      <Menu className="w-[400px]">
        <div className="p-4 flex flex-col gap-4">
          <h3 className="font-bold text-xl">Notifications</h3>
          <Divider />
          <MenuItem className="rounded-xl">
            <div className="flex flex-col gap-2 ">
              <div className="flex flex-row items-center gap-2">
                <Avatar />
                <p className="font-bold">Khang</p>
              </div>
              <div>
                <p>
                  Removed you from the Board{" "}
                  <span>
                    <a className="text-blue-500" href="#">
                      Test board
                    </a>
                  </span>
                </p>
                <p>Jan 12 at 10:51 PM</p>
              </div>
            </div>
          </MenuItem>
          <MenuItem className="rounded-xl">
            <div className="flex flex-col gap-2 ">
              <div className="flex flex-row items-center gap-2">
                <Avatar />
                <p className="font-bold">Khang</p>
              </div>
              <div>
                <p>
                  Removed you from the Board{" "}
                  <span>
                    <a className="text-blue-500" href="#">
                      Test board
                    </a>
                  </span>
                </p>
                <p>Jan 12 at 10:51 PM</p>
              </div>
            </div>
          </MenuItem>
          <MenuItem className="rounded-xl">
            <div className="flex flex-col gap-2 ">
              <div className="flex flex-row items-center gap-2">
                <Avatar />
                <p className="font-bold">Khang</p>
              </div>
              <div>
                <p>
                  Removed you from the Board{" "}
                  <span>
                    <a className="text-blue-500" href="#">
                      Test board
                    </a>
                  </span>
                </p>
                <p>Jan 12 at 10:51 PM</p>
              </div>
            </div>
          </MenuItem>
        </div>
      </Menu>
    </Dropdown>
  );
}
