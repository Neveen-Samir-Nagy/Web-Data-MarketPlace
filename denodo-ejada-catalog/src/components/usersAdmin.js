import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import ImageIcon from '@mui/icons-material/Image';
import WorkIcon from '@mui/icons-material/Work';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import axios from 'axios'
import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

export default function UsersAdmin() {
    const [users, setUsers] = React.useState('');
React.useEffect(()=>{
    axios.get(
        `http://localhost:3000/list-users`
      )
        .then((response) => {
          setUsers(response.data.map(a => a.name))
        })

    },[])
 
    
  return (
    <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
    {users && users.map((user)=>(
   <ListItem sx={{
    ':hover':{
        background:'rgba(0, 0, 0, 0.12)',
        boxShadow:'inset 0px 0px 1px 1px #00000033'
    },
    marginBottom:'10px'}} secondaryAction={
    <IconButton edge="end" aria-label="delete">
      <DeleteIcon />
    </IconButton>
  }>
   <ListItemAvatar>
     <Avatar>

     </Avatar>
   </ListItemAvatar>
   <ListItemText primary={user} />
 </ListItem>
      ))}
   
    </List>
  );
}