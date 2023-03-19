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
import secureLocalStorage from "react-secure-storage";

function New() {
  const [wsNew, setWsNew] = useState([]);

  const [open, setOpen] = useState(false);

  const [serviceName, setServiceName] = useState('');

  const [DB, setDB] = useState('');

  const [viewsMetaSchema, setViewsMetaSchema] = useState([]);
  const [viewsTags, setViewsTags] = useState([]);
  const [viewsCategories, setViewsCategories] = useState([]);
  const [wsType, setWsType] = useState('');
  const [loadingData, setLoadingData] = useState(false);
  const [remove, setRemove] = useState(false);


  useEffect(() => {
    secureLocalStorage.getItem("products") ?
      setWsNew(secureLocalStorage.getItem("products"))
      :
      axios
        .get(
          "http://localhost:3000/webcontainer_services/" + secureLocalStorage.getItem("user") + ""
        )
        .then((response) => {
          setWsNew(response.data);
          secureLocalStorage.setItem("products", response.data)
          console.log('here')

        })
  }, [remove])

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

    { console.log(serviceName) }
    
  };
  const handleAddToCart = (item) => {
    axios.post("http://localhost:3000/insert-request", {
      username: secureLocalStorage.getItem('user'),
      ws: [item],
      status: "IN CART"
  })
    .then((res)=>{
     console.log(res.data)
    })
  };
  const handleNewRequest = (key) => {
    axios.get('http://localhost:3000/ws-viewName/'+wsNew[key].database_name+'/'+wsNew[key].service_name)
      .then((res) => {
        axios.get('http://localhost:3000/access-privilege/' + wsNew[key].database_name + '/' + res.data + '/' + wsNew[key].service_name + '/' + secureLocalStorage.getItem("user"))
          .then((res1) => {
            secureLocalStorage.removeItem("products");
            setRemove(!remove)
            console.log(secureLocalStorage.getItem("products"))
            console.log(res1.data);
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
      });

  }



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
          {wsNew.map((item, key) => (!item.subscripe ?
            <Box>
              <Card
                sx={{
                  width: 250,
                  maxWidth: 250,
                  marginTop: "15px",
                  marginRight: "20px",
                }}
              >
                <CardHeader  sx={{
                      '.css-1qvr50w-MuiTypography-root':{
                        maxWidth:'85%',
                        textOverflow:'ellipsis',
                        overflow:'hidden',
                        whiteSpace:'nowrap'
                      }
                    }} title={item.service_name} subheader={item.service_type} />

                <CardContent>
                  <Typography variant="body2" color="text.secondary">
                  Product Description
                  </Typography>
                </CardContent>
                <Divider />
                <CardActions
                  sx={{ display: "flex", justifyContent: "end" }}
                  disableSpacing
                >
                  <IconButton>
                    <AddShoppingCartIcon onClick={() => handleAddToCart(item.service_name)} />
                  </IconButton>
                  <IconButton>
                    <InfoIcon onClick={() => handleClickOpen(key)} />

                  </IconButton>
                </CardActions>
              </Card>
              {open && <Metadata open={open} DB={DB} name={serviceName} setOpen={setOpen} />}
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
