import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import Modal from "@mui/material/Modal";
import Input from "@mui/joy/Input";
import { Link } from "react-router-dom";
import { SearchBoardWorkspace } from "../models/SearchBoardWorkspaceModel";
import APIClient from "../base/networking/APIClient";
import { ResponseData } from "../models/responseModel";
import { RequestData } from "../models/requestModel";
import { UserExpired } from "../base/helper/DecodeJWT";
import { useNavigate } from "react-router-dom";
const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 1000,
  minHeight: 500,
  maxHeight: 500,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  overflow: "auto",
};

export default function SearchModal() {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [keyword, setKeyword] = useState<string>("");
  const [searchData, setSearchData] = useState<SearchBoardWorkspace | null>(
    null
  );
  const [Boardpage, setBoardPage] = useState(0);
  const [Workspacedpage, setWorkspacePage] = useState(0);

  const apiClient: APIClient = new APIClient();
  const userToken = localStorage.getItem("AccessToken");
  const navigate = useNavigate();
  async function handleSearch() {
    try {
      if (userToken) {
        if (!UserExpired()) {
          navigate("/login");
        } else {
          const responseData: ResponseData =
            await apiClient.getAuthenticatedData(
              `/workspace/search/search-all?keyword=${keyword}&board_offset=${Boardpage}&workspace_offset=${Workspacedpage}`,
              {} as RequestData,
              userToken
            );
          if (responseData.success) {
            setSearchData(responseData);
          }
        }
      }
    } catch (err: any) {
      console.log(err);
    }
  }
  useEffect(() => {
    handleSearch();
  }, [keyword, Boardpage, Workspacedpage]);

  return (
    <div>
      <Button onClick={handleOpen}>Search</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Input
            placeholder="Search trello"
            value={keyword}
            onChange={(e) => {
              setKeyword(e.target.value);
            }}
            startDecorator={<SearchOutlinedIcon />}
            sx={{ width: "full" }}
          />
          <div>
            <h3 className="text-xl font-bold my-4">Boards</h3>
            <div className="flex flex-col gap-4">
              {searchData?.data.boards.map((board) => (
                <Link
                  key={board.board_id}
                  to={`/page/workspace/${board.workspace_id}/board/${board.board_id}`}
                  className="flex flex-row justify-between items-center hover:bg-slate-100 rounded-sm"
                >
                  <div className="flex flex-row justify-center items-center gap-4">
                    <div className="h-10 w-10 bg-red-50"></div>
                    <div className="flex flex-col justify-center">
                      <h4 className="text-sm font-bold">{board.title}</h4>
                      <p className="text-[12px] text-[#44546f]">
                        {board.workspace_name}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-row items-center gap-4">
                    <h3 className="text-[12px] text-[#44546f]">
                      Updated {board.updated_at}
                    </h3>
                  </div>
                </Link>
              ))}
              <div className="flex flex-row items-center justify-center">
                <Button
                  disabled={Boardpage === 0}
                  onClick={() => {
                    setBoardPage((previous) =>
                      previous === 0 ? previous : previous - 1
                    );
                  }}
                >
                  back
                </Button>
                <Button
                  disabled={!searchData?.data.board_has_next}
                  onClick={() => {
                    setBoardPage((previous) => previous + 1);
                  }}
                >
                  next
                </Button>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-xl font-bold my-4">Workspaces</h3>
            <div className="flex flex-col gap-4">
              {searchData?.data.workspaces.map((workspace) => (
                <Link
                  key={workspace.workspace_id}
                  to={`/page/workspace/${workspace.workspace_id}/boards`}
                  className="flex flex-row justify-between items-center hover:bg-slate-100 rounded-sm"
                >
                  <div className="flex flex-row justify-start items-center gap-4">
                    <div className="h-10 w-10 bg-red-50"></div>
                    <div className="flex flex-col justify-center">
                      <h4 className="text-sm font-bold">{workspace.name}</h4>
                    </div>
                  </div>
                </Link>
              ))}
              <div className="flex flex-row items-center justify-center">
                <Button
                  disabled={Workspacedpage === 0}
                  onClick={() => {
                    setWorkspacePage((previous) =>
                      previous === 0 ? previous : previous - 1
                    );
                  }}
                >
                  back
                </Button>
                <Button
                  disabled={!searchData?.data.workspace_has_next}
                  onClick={() => {
                    setWorkspacePage((previous) => previous + 1);
                  }}
                >
                  next
                </Button>
              </div>
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
