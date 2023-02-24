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
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import Navbar from "./Navbar";
import Metadata from "./metadata";
import { Box } from "@mui/system";
import { Button, Container, Divider } from "@mui/material";
import axios from "axios";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";

import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import ListItemText from '@mui/material/ListItemText';
import ListItem from '@mui/material/ListItem';
import List from '@mui/material/List';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import { useEffect, useState } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

function New() {
  const [wsNew, setWsNew] = useState([]);

  const [open, setOpen] = useState(false);
 
  const [serviceName, setServiceName] = useState('');

  const [DB, setDB] = useState('');


  console.log('http://localhost:3000/webcontainer_services/' + localStorage.getItem("user"))
  useEffect(() => {
    axios.get('http://localhost:3000/webcontainer_services/' + localStorage.getItem("user"))
      .then((res) => { setWsNew(res.data) })
      .catch((error) => {
        console.log(error);
      });
  }, [])

  // const Transition = React.forwardRef(function Transition(
  //   props: TransitionProps & {
  //     children: React.ReactElement;
  //   },
  //   ref: React.Ref<unknown>,
  // ) {
  //   return <Slide direction="up" ref={ref} {...props} />;
  // });

  const handleClickOpen = (key) => {
    setServiceName(wsNew[key].service_name)
    setDB(wsNew[key].database_name)
    setOpen(true);
    {console.log(serviceName)}

  };



  return (

    <Navbar>
      <Box>
        <h3 style={{ position: "static" }}>products to purchase</h3>
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
          {wsNew.map((item, key) => (!item.subscribe ?
          <Box>
            <Card
              sx={{
                width: 250,
                maxWidth: 250,
                marginTop: "15px",
                marginRight: "20px",
              }}
            >
              <CardHeader title={item.service_name} subheader={item.service_type} />

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
                <IconButton>
                  <AddShoppingCartIcon />
                </IconButton>
                <IconButton>
                  <InfoIcon onClick={()=>handleClickOpen(key)} />
                  
                </IconButton>
              </CardActions>
            </Card>
                  <Metadata open={open} DB={DB} name={serviceName} setOpen={setOpen}/>
                  </Box>
            :
            <h1></h1>))}
        </Box>
      </Box>
    </Navbar>
    //key==wsNew.length-1&&Found&&
  );
}
export default New;
