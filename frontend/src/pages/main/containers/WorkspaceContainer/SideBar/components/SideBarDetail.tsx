import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { GridView, ExpandMore, Add } from "@mui/icons-material";
import SideBarBoards from "./SideBarBoards";

export default function SideBarDetail() {
    return <div className="flex flex-col py-2 h-[85%]">
        <List>
            <ListItemButton sx={{py: "0px"}}>
                <ListItemIcon sx={{minWidth: "fit-content", mr: "17px"}}>
                    <GridView sx={{fontSize: "17px"}}></GridView>
                </ListItemIcon>
                <ListItemText primary="Boards" />
            </ListItemButton>
            <ListItemButton sx={{py: "0px"}}>
                <ListItemIcon sx={{minWidth: "fit-content", mr: "17px"}}>
                    <GridView sx={{fontSize: "17px"}}></GridView>
                </ListItemIcon>
                <ListItemText primary="Members" />
                <Add sx={{fontSize: "17px"}} />
            </ListItemButton>
            <ListItemButton sx={{py: "0px"}}>
                <ListItemIcon sx={{minWidth: "fit-content", mr: "17px"}}>
                    <GridView sx={{fontSize: "17px"}}></GridView>
                </ListItemIcon>
                <ListItemText primary="Workspace settings" />
                <ExpandMore sx={{fontSize: "17px"}} />
            </ListItemButton>
        </List>
        <SideBarBoards />
    </div>;
}