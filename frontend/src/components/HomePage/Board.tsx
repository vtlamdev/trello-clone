import StarBorderIcon from "@mui/icons-material/StarBorder";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import IconButton from "@mui/material/IconButton";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import { useAllWorkspaceContext } from "../../pages/main/WorkspaceContex/WorkspaceContex";
import { DecodeJWT } from "../../base/helper/DecodeJWT";
import {
  BoardModel,
} from "../../pages/main/WorkspaceContex/WorkspaceModel";
import MenuItem from "@mui/material/MenuItem";
import React, { useState } from "react";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import FormHelperText from "@mui/joy/FormHelperText";
import Input from "@mui/joy/Input";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import { Link, useNavigate } from "react-router-dom";
import { VisibilityType } from "../../pages/main/containers/WorkspaceContainer/Content/Board/BoardModal/BoardModal";
import { ResponseData } from "../../models/responseModel";
import { RequestData } from "../../models/requestModel";
import APIClient from "../../base/networking/APIClient";
import { UserExpired } from "../../base/helper/DecodeJWT";
import CloseIcon from "@mui/icons-material/Close";
import Snackbar from "@mui/material/Snackbar";
export default function Board({
  isStarred,
  name,
  boardId,
  workspaceId,
  handleClickStared,
}: {
  isStarred: boolean;
  name: string;
  boardId: string;
  workspaceId: string;
  handleClickStared: () => void;
}) {
  return (
    <Link to={`/page/workspace/${workspaceId}/board/${boardId}`}>
      <div className="w-full h-full  p-2 rounded-xl hover:bg-pink-600 bg-pink-500 relative">
        <p className="text-xl font-bold  absolute top-2 left-3 ">{name}</p>
        <div className="absolute bottom-0 right-0 z-10">
          <IconButton
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              handleClickStared();
            }}
          >
            <StarBorderIcon
              fontSize="small"
              sx={{
                color: isStarred ? "yellow" : "",
                "&:hover": {
                  color: "yellow",
                },
              }}
            />
          </IconButton>
        </div>
      </div>
    </Link>
  );
}

export function CreateNewBoard() {
  const [boardTitle, setBoardTitle] = useState<string>("");
  const [workspaceId, setWorkspaceId] = useState<string>("");
  const [visibilityBoard, setVisibilityBoard] = useState<string>("");
  const [boardDescription, setBoardDescription] = useState<string>("");
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const { allWorkspace } = useAllWorkspaceContext();
  const [loading, setLoading] = useState<boolean>(false);
  const [errorCode, setErrorCode]=useState<number>()
  const apiClient: APIClient = new APIClient();
  const userToken = localStorage.getItem("AccessToken");
  const { fetchData } = useAllWorkspaceContext();
  const navigate = useNavigate();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const handleClickSnackBar = () => {
    setOpenSnackbar(true);
  };

  const handleCloseSnackBar = (
    _event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnackbar(false);
  };

  const action = (
    <React.Fragment>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleCloseSnackBar}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  async function handleCreateBoard(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      setLoading(true);
      if (userToken) {
        if (!UserExpired()) {
          navigate("/login");
        } else {
          
          const responseData: ResponseData =
            await apiClient.postAuthenticatedData(
              `/board/`,
              {} as RequestData,
              {
                workspace_id: workspaceId,
                title: boardTitle,
                description: boardDescription,
                visibility: visibilityBoard,
              },
              userToken
            );
            console.log(responseData)
          if (responseData.success) {
            setAnchorEl(null);
            setWorkspaceId("");
            setVisibilityBoard("");
            setBoardTitle("");
            setBoardDescription("");
            fetchData();
            navigate(
              `/page/workspace/${workspaceId}/board/${responseData.data.board_id}`
            );
          }
          else{
            setErrorCode(responseData.status_code)
            handleClickSnackBar()
          }
        }
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }
  return (
    <div>
      <Button
        aria-describedby={id}
        variant="contained"
        onClick={handleClick}
        sx={{ width: "100%", height: "128px", background: "#95B594" }}
      >
        Create new board
      </Button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <Typography sx={{ p: 2 }}>Create new board.</Typography>
        <div>
          <form
            onSubmit={handleCreateBoard}
            className="flex flex-col gap-4 p-4"
          >
            <FormControl>
              <FormLabel>Board title *</FormLabel>
              <Input
                placeholder="Enter board title"
                required
                value={boardTitle}
                onChange={(e) => {
                  setBoardTitle(e.target.value);
                }}
              />
              <FormHelperText>Board title is required.</FormHelperText>
            </FormControl>
            <FormControl>
              <FormLabel>Board description *</FormLabel>
              <Input
                placeholder="Enter board description"
                required
                value={boardDescription}
                onChange={(e) => {
                  setBoardDescription(e.target.value);
                }}
              />
              <FormHelperText>Board title is required.</FormHelperText>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel id="workspace">Workspace</InputLabel>
              <Select
                labelId="workspace"
                label="Workspace"
                required
                value={workspaceId}
                onChange={(e) => {
                  setWorkspaceId(e.target.value);
                }}
              >
                {allWorkspace?.data.map((workspace) => (
                  <MenuItem
                    key={workspace.workspace_id}
                    value={workspace.workspace_id}
                  >
                    {workspace.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel id="visibility">Visibility</InputLabel>
              <Select
                labelId="visibility"
                label="Visibility"
                required
                value={visibilityBoard}
                onChange={(e) => {
                  setVisibilityBoard(e.target.value);
                }}
              >
                <MenuItem value={VisibilityType.PUBLIC}>
                  {VisibilityType.PUBLIC}
                </MenuItem>
                <MenuItem value={VisibilityType.WORKSPACE}>
                  {VisibilityType.WORKSPACE}
                </MenuItem>
                <MenuItem value={VisibilityType.PRIVATE}>
                  {VisibilityType.PRIVATE}
                </MenuItem>
              </Select>
            </FormControl>

            <Button type="submit" disabled={loading} variant="contained">
              Submit
            </Button>
          </form>
        </div>
      </Popover>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={5000}
        onClose={handleCloseSnackBar}
        message={errorCode===403?'You have no permission':'Create board success'}
        action={action}
      />
    </div>
  );
}

export function StaredBoard({ board }: { board: BoardModel[] | undefined }) {
  const { fetchData } = useAllWorkspaceContext();
  const navigate = useNavigate();
  const userToken = localStorage.getItem("AccessToken");
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
      <div className="flex flex-row gap-2 justify-start items-center">
        <StarBorderIcon />
        <p className="font-bold ">Starred Board</p>
      </div>
      <div>
        <div className="grid md:grid-cols-4 grid-cols-2 grid-flow-row gap-4">
          {board?.map((value) => (
            <div className="w-auto h-32" key={value.board_id}>
              <Board
                isStarred={value.star.includes(userInfor.data.user_id)}
                name={value.title}
                boardId={value.board_id}
                workspaceId={value.workspaceId}
                handleClickStared={() => {
                  handleClickstared(value.board_id);
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
export function RecentBoard({ board }: { board: BoardModel[] | undefined }) {
  const { fetchData } = useAllWorkspaceContext();
  const navigate = useNavigate();
  const userToken = localStorage.getItem("AccessToken");
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
      <div className="flex flex-row gap-2 justify-start items-center">
        <AccessTimeIcon />
        <p className="font-bold ">Recently viewed</p>
      </div>
      <div>
        <div className="grid md:grid-cols-4 grid-cols-2 grid-flow-row gap-4">
          {board?.map((value) => (
            <div className="w-auto h-32" key={value.board_id}>
              {" "}
              <Board
                name={value.title}
                isStarred={value.star.includes(userInfor.data.user_id)}
                boardId={value.board_id}
                workspaceId={value.workspaceId}
                handleClickStared={() => {
                  handleClickstared(value.board_id);
                }}
              />{" "}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
export function YourBoard({ board }: { board: BoardModel[] }) {
  const { fetchData } = useAllWorkspaceContext();
  const navigate = useNavigate();
  const userToken = localStorage.getItem("AccessToken");
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
      <div className="flex flex-row gap-2 justify-start items-center">
        <PersonOutlineOutlinedIcon />
        <p className="font-bold ">Your board</p>
      </div>
      <div>
        <div className="grid md:grid-cols-4 grid-cols-2 grid-flow-row gap-4">
          {board.map((value) => (
            <div className="w-auto h-32" key={value.board_id}>
              <Board
                isStarred={
                  value.star.includes(userInfor.data.user_id) ? true : false
                }
                name={value.title}
                boardId={value.board_id}
                workspaceId={value.workspaceId}
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
