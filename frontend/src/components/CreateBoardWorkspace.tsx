import * as React from "react";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import FormHelperText from "@mui/joy/FormHelperText";
import Input from "@mui/joy/Input";
import Modal from "@mui/material/Modal";
import { VisibilityType } from "../pages/main/WorkspaceContex/WorkspaceModel";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { ResponseData } from "../models/responseModel";
import { RequestData } from "../models/requestModel";
import APIClient from "../base/networking/APIClient";
import { useNavigate } from "react-router-dom";
import { useAllWorkspaceContext } from "../pages/main/WorkspaceContex/WorkspaceContex";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import { UserExpired } from "../base/helper/DecodeJWT";
const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  height: "80%",
  width: "60%",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function CreateBoardWorkspace() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [workspaceName, setWorkspaceName] = React.useState<string>("");
  const [visibility, setVisibility] = React.useState<string>("");
  const [workspaceDescription, setWorkspaceDescription] =
    React.useState<string>("");
  const { fetchData } = useAllWorkspaceContext();
  const open = Boolean(anchorEl);
  const apiClient: APIClient = new APIClient();
  const navigate = useNavigate();
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const [openModal, setOpenModal] = React.useState(false);
  const handleOpenModal = () => {
    setOpenModal(true);
  };
  const handleCloseModal = () => setOpenModal(false);
  const UserToken = localStorage.getItem("AccessToken");
  async function handleSubmitCreateWorkspace(
    e: React.FormEvent<HTMLFormElement>
  ) {
    try {
      e.preventDefault();
      setLoading(true);
      if (UserToken) {
        if (!UserExpired()) {
          navigate("/login");
        } else {
          const responseData: ResponseData =
            await apiClient.postAuthenticatedData(
              `/workspace/createWorkspace`,
              {} as RequestData,
              {
                name: workspaceName,
                description: workspaceDescription,
                visibility: visibility,
              },
              UserToken
            );
          if (responseData.success) {
            fetchData();
            setOpenModal(false);
            setAnchorEl(null);
            navigate(
              `/page/workspace/${responseData.data.workspace_id}/boards`
            );
          }
        }
      }
    } catch (err: any) {
      //   setFormError("500");
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className=" inline-block">
      <IconButton
        aria-label="more"
        id="long-button"
        aria-controls={open ? "long-menu" : undefined}
        aria-expanded={open ? "true" : undefined}
        aria-haspopup="true"
        onClick={handleClick}
        sx={{
          borderRadius: 2,
          background: "#0c66e4",
          color: "white",
          fontSize: "14px",
          fontWeight: "bold",
          "&:hover": { background: "#0055CC" },
        }}
      >
        <p>Create</p>
      </IconButton>
      <Menu
        id="long-menu"
        MenuListProps={{
          "aria-labelledby": "long-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            width: "400px",
          },
        }}
      >
        <MenuItem onClick={handleClose}>
          <div className="flex flex-col" onClick={handleOpenModal}>
            <div className="flex flex-row items-center justify-start">
              <GroupOutlinedIcon fontSize="small" />
              Create workspace
            </div>
            <p className="text-sm" style={{ overflowWrap: "break-word" }}>
              A Workspace is a group of boards and people. Use it to <br></br>{" "}
              organize your company, side hustle, family, or friends.
            </p>
          </div>
        </MenuItem>
      </Menu>
      <div>
        <Modal
          open={openModal}
          onClose={handleCloseModal}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <form
              onSubmit={handleSubmitCreateWorkspace}
              className="flex flex-col gap-8"
            >
              <FormControl>
                <FormLabel>Workspace name *</FormLabel>
                <Input
                  placeholder="Enter workspace name"
                  required
                  onChange={(e) => {
                    setWorkspaceName(e.target.value);
                  }}
                />
                <FormHelperText>
                  This is the name of your company, team or organization.
                </FormHelperText>
              </FormControl>
              <FormControl>
                <FormLabel>Visibility *</FormLabel>
                <Select
                  labelId="visibility"
                  label="Visibility"
                  type="text"
                  required
                  value={visibility}
                  onChange={(e: SelectChangeEvent) => {
                    setVisibility(e.target.value as VisibilityType);
                  }}
                >
                  <MenuItem value={VisibilityType.PUBLIC}>
                    {VisibilityType.PUBLIC}
                  </MenuItem>
                  <MenuItem value={VisibilityType.PRIVATE}>
                    {VisibilityType.PRIVATE}
                  </MenuItem>
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Workspace description *</FormLabel>
                <Input
                  placeholder="Enter workspace description"
                  required
                  onChange={(e) => {
                    setWorkspaceDescription(e.target.value);
                  }}
                />
                <FormHelperText>
                  Get your members on board with a few words about your
                  Workspace
                </FormHelperText>
              </FormControl>
              <button disabled={loading} className="p-2 bg-blue-400">
                Continue
              </button>
            </form>
            {/* <div
              className="w-[50%] h-full"
              style={{
                backgroundImage: 'url("/workspaceCreate.svg" )',
                backgroundRepeat: "no-repeat",
              }}
            ></div> */}
          </Box>
        </Modal>
      </div>
    </div>
  );
}
