import * as React from "react";
import { useEffect, useState } from "react";

import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import axios from "axios";
import secureLocalStorage from "react-secure-storage";

import Navbar from "./Navbar";
import { Box, Container, Divider, List, ListItem, ListItemText } from "@mui/material";

export default function Cart() {
  const [request, setRequest] = useState();
  const [DeleteCart, setDeleteCart] = useState(false);
  const [cartRequests, setCartRequests] =useState("");

  useEffect(() => {
    axios
      .get(
        `http://localhost:3000/request-withStatus/${secureLocalStorage.getItem(
          "user"
        )}/IN CART`
      )
      .then((res) => (
        console.log(res.data), setCartRequests(res.data)
      ))
      .catch((error) => {
        console.log(error);
      });
      console.log(cartRequests)
  }, [DeleteCart]);
  const handleDeleteCart = (item) => {
    secureLocalStorage.removeItem('products')
    axios
    .get(
      `http://localhost:3000/delete-request/${secureLocalStorage.getItem('user')}/${item}/IN CART`
    )
    .then((res) => (
      console.log(res.data), setDeleteCart(!DeleteCart),
      console.log(DeleteCart)
    ))
    .catch((error) => {
      console.log(error);
    });
  };
  const handlePurchase = (item) => {
    const array=cartRequests.map(obj=>obj.ws)
console.log(array)
console.log(item.username)
axios
.post(`http://localhost:3000/update-user-requests`, {
  username: secureLocalStorage.getItem('user'),
  ws: array,
  status: "UNDERAPPROVAL",
})
.then((res) => (
  console.log(res.data), setDeleteCart(!DeleteCart),
  console.log(DeleteCart)))
};
  return (  
    <Navbar useEffect={DeleteCart}>

  <Box sx={{position:'relative'}}>
  <h3 style={{ position: "static" }}>Cart Items</h3>
        <Divider />
  <Container maxWidth='lg' sx={{marginTop:'15px',display:'flex',justifyContent:'space-between',flexWrap:'wrap'}}>
  {cartRequests && cartRequests.map((item,index)=>(
 <List sx={{width:'48%' , marginBottom:'20px', border:'1px solid rgba(0,0,0,0.1)'}}>
<ListItem
  secondaryAction={
    <IconButton onClick={()=>handleDeleteCart(item.ws)} edge="end" aria-label="delete">
      <DeleteIcon />
    </IconButton>
  }
>
 
  <ListItemText
    primary={item.ws}
    secondary={item.creation_date}
  />

</ListItem>
</List>    
      ))  }
          </Container>
          <Button onClick={handlePurchase} variant="contained" sx={{position:'fixed',bottom:'5%',right:'5%'}}>
  Checkout
</Button>
</Box>
  
    </Navbar>
  );
}
