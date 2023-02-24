import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { red } from "@mui/material/colors";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import LaunchIcon from "@mui/icons-material/Launch";
import InfoIcon from "@mui/icons-material/Info";
import ControlPoint from "@mui/icons-material/ControlPoint";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import Navbar from "./Navbar";
import Metadata from "./metadata";

import { Box } from "@mui/system";
import axios from "axios";
import { useEffect, useState } from "react";

import { Button, Container, Divider } from "@mui/material";
import { Link } from "react-router-dom";
function Products() {
  const [purchasedWs, setPurchasedWs] = useState([]);
  const [open, setOpen] = useState(false);
 
  const [serviceName, setServiceName] = useState('');

  const [DB, setDB] = useState('');

  console.log('products');
  useEffect(()=>{
    axios
    .get(
      "http://localhost:3000/webcontainer_services/" + localStorage.getItem("user") + ""
    )
    .then((response) => {
      setPurchasedWs(response.data);
    })
  },[])
  
  const handleClickOpen = (key) => {
    setServiceName(purchasedWs[key].service_name)
    setDB(purchasedWs[key].database_name)
    setOpen(true);
    {console.log(serviceName)}

  };

  return (
    <Navbar>
      <Box>
        <h3 style={{ position: "static" }}>Your Products</h3>
        <Divider />
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            width: "95%",
            margin: "auto",
            justifyContent: "flex-start",
          }}
        >
          {purchasedWs.map((item, key) => ( item.subscribe ?
           <Box>
           <Card
              sx={{
                width: 250,
                maxWidth: 250,
                marginTop: "15px",
                marginRight: "20px",
              }}
            >
              <CardHeader
                title={item.service_name}
                subheader={item.service_type}
              />

              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  {item.description}
                </Typography>
              </CardContent>
              <Divider />

              <CardActions
                sx={{ display: "flex", justifyContent: "end" }}
                disableSpacing
              >
                <IconButton  component={Link} to={'/products'}>
                  <LaunchIcon />
                </IconButton>
                <IconButton>
                <InfoIcon onClick={()=>handleClickOpen(key)} />
                </IconButton>
              </CardActions>
            </Card>
            <Metadata open={open} DB={DB} name={serviceName} setOpen={setOpen}/>
            </Box>
          : <></>))}
        </Box>
      </Box>
    </Navbar>
    
  );
}
export default Products;
