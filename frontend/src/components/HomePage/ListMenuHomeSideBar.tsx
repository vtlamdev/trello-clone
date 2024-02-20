import * as React from "react";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { Link } from "react-router-dom";
import GridViewIcon from "@mui/icons-material/GridView";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import SettingsIcon from "@mui/icons-material/Settings";
import { WorkspaceDataModel } from "../../pages/main/WorkspaceContex/WorkspaceModel";
export default function ListMenuHomeSideBar({data}:{data:WorkspaceDataModel}) {
  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(!open);
  };
  return (
    <List
      sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper", py: 0 }}
      component="nav"
      aria-labelledby="nested-list-subheader"
    >
      <ListItemButton onClick={handleClick}>
        <ListItemIcon>
          <InboxIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText
          primary={data.name}
          sx={{
            ".MuiListItemText-primary": {
              fontSize: "14px",
            },
          }}
        />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItemButton sx={{ pl: 4, py: 0 }}>
            <Link
              to={`/page/workspace/${data.workspace_id}/boards`}
              className="flex flex-row items-center w-full"
            >
              <ListItemIcon>
                <GridViewIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary="Board"
                sx={{
                  ".MuiListItemText-primary": {
                    fontSize: "14px",
                  },
                }}
              />
            </Link>
          </ListItemButton>
          <ListItemButton sx={{ pl: 4, py: 0 }}>
            <Link
              to={`/page/workspace/${data.workspace_id}/members`}
              className="flex flex-row items-center w-full"
            >
              <ListItemIcon>
                <PeopleOutlineIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary="Members"
                sx={{
                  ".MuiListItemText-primary": {
                    fontSize: "14px",
                  },
                }}
              />
            </Link>
          </ListItemButton>
          <ListItemButton sx={{ pl: 4, py: 0 }}>
            <Link
              to={`/page/workspace/${data.workspace_id}/settings`}
              className="flex flex-row items-center w-full"
            >
              <ListItemIcon>
                <SettingsIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary="Settings"
                sx={{
                  ".MuiListItemText-primary": {
                    fontSize: "14px",
                  },
                }}
              />
            </Link>
          </ListItemButton>
        </List>
      </Collapse>
    </List>
  );
}
