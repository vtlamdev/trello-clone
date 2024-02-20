import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import GridViewIcon from '@mui/icons-material/GridView';
import { Link } from 'react-router-dom';
export default function IconTabHomePage() {

  return (
    <List
      sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
      component="nav"
      aria-labelledby="nested-list-subheader"
    >
     
        <List component="div" disablePadding>
          <ListItemButton sx={{pl: 4, py:0 ,my:0.5, }}>
          <Link to={"/page/home/"} className='flex flex-row items-center w-full'>
            <ListItemIcon>
              <GridViewIcon fontSize='small'/>
            </ListItemIcon>
            <ListItemText primary="Board" sx={{
                '.MuiListItemText-primary': {
                    fontSize: '14px'
                }
            }}/>
            </Link>
          </ListItemButton>
        </List>
    </List>
  );
}