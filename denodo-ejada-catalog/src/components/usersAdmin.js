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
import { Divider, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { Box } from '@mui/system';
export default function UsersAdmin() {
    const [users, setUsers] = React.useState('');
    const [isHovering, setIsHovering] = React.useState('');
    const handleMouseOver = (key) => {
        console.log('over')
        setIsHovering(key);
    };

    const handleMouseOut = () => {
        setIsHovering('');
    };

    React.useEffect(() => {
        axios.get(
            `http://localhost:3000/list-users`
        )
            .then((response) => {
                setUsers(response.data.map(a => a.name))
            })

    }, [])


    return (
        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
            {users && users.map((user, index) => (
                <Box key={index} >
                    <ListItem key={index} sx={{
                        background: index % 2 != 0 ? "#FFF" : "rgba(0, 0, 0, 0.1)"
                    }} secondaryAction={
                        <IconButton key={index} onMouseOver={()=>handleMouseOver(index)}
                            onMouseOut={handleMouseOut} edge="end" aria-label="delete">
                            {isHovering ===index ? <DeleteOutlineOutlinedIcon />:<DeleteIcon /> }
                        </IconButton>
                    }>
                        <ListItemAvatar>

                            <Avatar>

                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary={user} />

                    </ListItem>

                    <Divider />

                </Box>

            ))}

        </List>
    );
}