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
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box } from '@mui/system';

import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
export default function ProductAdmin() {
    const [products, setProducts] = React.useState('');
    const [users, setUsers] = React.useState('');
    const [isHovering, setIsHovering] = React.useState('');
    const [Delete, setDelete] = React.useState(false);

    const handleMouseOver = (key) => {
        console.log('over')
        setIsHovering(key);
    };

    const handleMouseOut = () => {
        setIsHovering('');
    };
    const deleteUser = (user, index, db, wsName) => {
        axios.get(
            `http://localhost:3000/revoke-user/${db[index].list_databases.replace('[', '').replace(']', '').split(',')[0]}/${wsName}/${user}`
        )
            .then((response) => {
                console.log(response.log)
                setDelete(!Delete)
            })

    }
    React.useEffect(() => {

        axios.get(
            `http://localhost:3000/map-users-ws`
        )
            .then((response) => {
                console.log("maps", response.data);
                setProducts(response.data);
            })


    }, [Delete])

    const handleOpenUsers = (key) => {
        setUsers(key)
    }
    return (
        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
            {products && products.map((user, index) => (
                <ListItem sx={{


                    background: index % 2 != 0 ? 'rgba(0, 0, 0, 0.12)' : 'null',
                    marginBottom: '10px'
                }} >

                    <ListItemText primary={user.elementname} secondary={user.list_users.replace('[', '').replace(']', '')} />
                    <Button variant='contained' onClick={() => handleOpenUsers(index)}>
                        Show
                    </Button>
                    <Dialog open={users === index}>
                        <DialogTitle>{user.elementname} Users</DialogTitle>
                        <Divider />

                        <DialogContent>

                            {user.list_users.replace('[', '').replace(']', '').split(',').map((item, index) => (
                                <Box>

                                    <Box sx={{
                                        display: 'flex', justifyContent: 'space-between'
                                    }}>
                                        {item}
                                        <IconButton key={index} onMouseOver={() => handleMouseOver(index)}
                                            onMouseOut={handleMouseOut} onClick={() => deleteUser(item, index, products, user.elementname)} edge="end" aria-label="delete">
                                            {isHovering === index ? <DeleteIcon /> : <DeleteOutlineOutlinedIcon />}
                                        </IconButton>
                                    </Box>
                                    <Divider />

                                </Box>
                            ))}
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => handleOpenUsers('')}>
                                Done
                            </Button>

                        </DialogActions>
                    </Dialog>
                </ListItem>
            ))}

        </List>
    );
}