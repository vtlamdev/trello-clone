import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";


import List from "@mui/material/List";

import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";

import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import PeopleOutlineRoundedIcon from "@mui/icons-material/PeopleOutlineRounded";
import SettingsIcon from "@mui/icons-material/Settings";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { Link, useParams } from "react-router-dom";
import { useAllWorkspaceContext } from "../../../../WorkspaceContex/WorkspaceContex";
import { WorkspaceDataModel } from "../../../../WorkspaceContex/WorkspaceModel";
import { useState } from "react";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import APIClient from "../../../../../../base/networking/APIClient";
import { RequestData } from "../../../../../../models/requestModel";
import { ResponseData } from "../../../../../../models/responseModel";
import {
  DecodeJWT,
  UserExpired,
} from "../../../../../../base/helper/DecodeJWT";
import { useNavigate } from "react-router-dom";
const drawerWidth = 240;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));





const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

export default function SidebarDrawer({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = useTheme();
  const [open, setOpen] = React.useState(true);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };
  const { workspaceId } = useParams();
  const { allWorkspace, fetchData } = useAllWorkspaceContext();
  const [workspace, setWorkspace] = useState<WorkspaceDataModel>();
  const userToken = localStorage.getItem("AccessToken");
  const apiClient: APIClient = new APIClient();
  const userInfor = DecodeJWT();
  const navigate = useNavigate();
  React.useEffect(() => {
    if (allWorkspace) {
      setWorkspace(
        allWorkspace?.data.find(
          (workspace) => workspace.workspace_id === workspaceId
        )
      );
    }
  }, [workspaceId, allWorkspace]);

  async function handleClickstared(board_id: string) {
    try {
      if (userToken) {
        if (!UserExpired()) {
          navigate("/home");
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
    <Box sx={{ display: "flex", width: "100%" }}>
      <CssBaseline />
      <IconButton
        sx={{
          alignItems: "start",
          width: "fit-content",
          height: "fit-content",
        }}
        onClick={handleDrawerOpen}
      >
        <NavigateNextIcon />
      </IconButton>

      <Drawer
        sx={{
          width: drawerWidth,
          marginTop: "10vh",
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            mt: "70px",
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          {workspace?.name}
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "ltr" ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          <ListItem disablePadding>
            <Link to={`/page/workspace/${workspaceId}/boards`}>
              <ListItemButton>
                <ListItemIcon>
                  <GridViewOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary={"Boards"} />
              </ListItemButton>
            </Link>
          </ListItem>
          <ListItem disablePadding>
            <Link to={`/page/workspace/${workspaceId}/members`}>
              <ListItemButton>
                <ListItemIcon>
                  <PeopleOutlineRoundedIcon />
                </ListItemIcon>
                <ListItemText primary={"Members"} />
              </ListItemButton>
            </Link>
          </ListItem>
          <ListItem disablePadding>
            <Link to={`/page/workspace/${workspaceId}/settings`}>
              <ListItemButton>
                <ListItemIcon>
                  <SettingsIcon />
                </ListItemIcon>
                <ListItemText primary={"Settings"} />
              </ListItemButton>
            </Link>
          </ListItem>
        </List>
        <Divider />
        <List sx={{ p: 2 }}>
          <ListItem disablePadding>Your board</ListItem>
          {workspace?.boards.map((board) => (
            <Link
              to={`/page/workspace/${workspace.workspace_id}/board/${board.board_id}`}
              key={board.board_id}
            >
              <div className="flex flex-row justify-between items-center rounded-sm hover:bg-slate-300">
                <p className="text-sm font-bold">{board.title}</p>
                <IconButton onClick={() => handleClickstared(board.board_id)}>
                  <StarBorderIcon
                    sx={{
                      fontSize: 14,
                      color: board.star.includes(userInfor.data.user_id)
                        ? "yellow"
                        : "",
                    }}
                  />
                </IconButton>
              </div>
            </Link>
          ))}
        </List>
      </Drawer>
      <Main
        sx={{ padding: 0, width: "100%", overflowY:"auto", height: "100%" }}
        open={open}
      >
        {children}
      </Main>
    </Box>
  );
}
