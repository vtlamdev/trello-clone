import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import { GridView, CloseRounded } from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";

export type Props = {
    isOpen: boolean,
    setIsOpen: Function
};

export default function BoardDrawer({ isOpen, setIsOpen }: Props) {
    return <main
    className={
      " absolute overflow-hidden z-10 bg-gray-900 bg-opacity-25 inset-0 transform ease-in-out " +
      (isOpen
        ? " transition-opacity opacity-100 duration-500 translate-x-0  "
        : " transition-all delay-500 opacity-0 translate-x-full  ")
    }
  >
    <section
      className={
        " w-full max-w-[40%] right-0 absolute bg-white h-full shadow-xl delay-400 duration-500 ease-in-out transition-all transform  " +
        (isOpen ? " translate-x-0 " : " translate-x-full ")
      }
    >
      <List sx={{
        py: "17px",
        width: "100%"
      }}>
        <ListItem>
          <ListItemText primary="Menu" sx={{textAlign: "center"}} />
          <IconButton sx={{padding: "6px", borderRadius: "6px"}} onClick={() => {setIsOpen(false);}} ><CloseRounded fontSize="small" /></IconButton>
        </ListItem>
        <Divider variant="middle" />
        <ListItem>
          <ListItemButton sx={{borderRadius: "17px"}}>
            <ListItemIcon>
              <GridView />
            </ListItemIcon>
            <ListItemText primary="Inbox" />
          </ListItemButton>
        </ListItem>
        <ListItem>
          <ListItemButton sx={{borderRadius: "17px"}}>
            <ListItemIcon>
              <GridView />
            </ListItemIcon>
            <ListItemText primary="Inbox" />
          </ListItemButton>
        </ListItem>
        <Divider variant="middle" />
        <ListItem>
          <ListItemButton sx={{borderRadius: "17px"}}>
            <ListItemIcon>
              <GridView />
            </ListItemIcon>
            <ListItemText primary="Inbox" />
          </ListItemButton>
        </ListItem>
        <Divider variant="middle" />
        <ListItem>
          <ListItemButton sx={{borderRadius: "17px"}}>
            <ListItemIcon>
              <GridView />
            </ListItemIcon>
            <ListItemText primary="Inbox" />
          </ListItemButton>
        </ListItem>
        <ListItem>
          <ListItemButton sx={{borderRadius: "17px"}}>
            <ListItemIcon>
              <GridView />
            </ListItemIcon>
            <ListItemText primary="Inbox" />
          </ListItemButton>
        </ListItem>
        <ListItem>
          <ListItemButton sx={{borderRadius: "17px"}}>
            <ListItemIcon>
              <GridView />
            </ListItemIcon>
            <ListItemText primary="Inbox" />
          </ListItemButton>
        </ListItem>
      </List>
    </section>
    <section
      className=" w-full h-full cursor-pointer "
      onClick={() => {
        setIsOpen(false);
      }}
    ></section>
  </main>;
}