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
import { Box } from "@mui/system";
import { Button, Container } from "@mui/material";
import axios from "axios";
import { Divider } from "@mui/material";
import secureLocalStorage from "react-secure-storage";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";

import * as React from "react";
import Dialog from "@mui/material/Dialog";
import ListItemText from "@mui/material/ListItemText";
import ListItem from "@mui/material/ListItem";
import List from "@mui/material/List";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import { useEffect, useState } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import DoneIcon from "@mui/icons-material/Done";
function Metadata(props) {
  const [Found, setFound] = useState(true);
  var [fields, setFields] = useState(["id", "name", "age", "number"]);
  var [values, setValues] = useState([[1, "name", 25, "011"]]);
  const [viewsMetaSchema, setViewsMetaSchema] = useState([]);
  const [openSampleData, setOpenSampleData] = useState(false);
  const [sampleData, setSampleData] = useState("");
  const [viewsTags, setViewsTags] = useState([]);
  const [localview, setLocalView] = useState("");
  const [wsType, setWsType] = useState("");
  const [load, setLoad] = useState(false);
  const [loadData, setLoadData] = useState(false);

  const [viewsCategories, setViewsCategories] = useState([]);
  const handleClose = () => {
    props.setOpen(false);
  };

  const handlechangeSampleData = () => {
    setLoadData(true);
    setOpenSampleData(true);

    axios
      .get(
        "http://localhost:3000/sample-data/" +
          props.DB +
          "/" +
          props.name
      )
      .then((res) => {
        setSampleData(res.data);
      })
      .then(()=>{
        setLoadData(false);
      })
      .catch((error) => {
        console.log(error);
      });

  };
  const handleCloseSampleData= () => {
    setLoadData(false);
    setOpenSampleData(false);


  };
  useEffect(() => {
setLoad(true);
    axios
      .get(
        "http://localhost:3000/ws-details/" + props.DB + "/" + props.name + ""
      )
      .then((res) => {
        console.log("JSON.parse(res.data[0])", JSON.parse(res.data[0]));
        setWsType(JSON.parse(res.data[0]).wsType);
        setViewsMetaSchema(JSON.parse(res.data[0]).schema);
        setViewsTags(JSON.parse(res.data[0]).tags);
        setLocalView(Object.keys(JSON.parse(res.data[0]).schema)[0]);
        setViewsCategories(JSON.parse(res.data[0]).categories);
      })
      .then(()=>{
        setLoad(false)
      })
      .catch((error) => {
        console.log(error);
      });
    
    //       axios
    //   .get(
    //     "http://localhost:3000/sample-data/" + props.DB + '/' + props.name
    //   )
    //   .then((response) => {
    //     setFields(response.data[0]);
    //     setValues(response.data.slice(1, response.data.length));
    //     setLoadingData(false);
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
  }, []);

  return (
    <div>
      <Dialog fullScreen open={props.open} onClose={handleClose}>
        <AppBar sx={{ position: "relative", backgroundColor: "#3c8dbc" }}>
          <Toolbar>
            <Typography sx={{ flex: 1 }} variant="h6" component="div">
              Metadata <span style={{
                display:'block'
              }}>
                Product Name:  {props.name}</span> 
            </Typography>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Table size="small" aria-label="purchases">
          <TableHead>
            <TableRow>
              <TableCell style={{ fontWeight: "bold" }}>Category</TableCell>
              <TableCell style={{ fontWeight: "bold" }}>Tag</TableCell>
              <TableCell style={{ fontWeight: "bold" ,padding:'6px 16px 6px 0px'}}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "70%",
                    paddingLeft: "0",
                    paddingRight: "0",
                  }}
                >
                  <span>Schema</span>
                  <span>Type</span>
                  <span>Input</span>
                  <span>output</span>
                  
                </Box>
              </TableCell>
              <TableCell style={{ fontWeight: "bold" }}>Type</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {load? <h3 style={{paddingLeft:'20px'}}>Getting Metadata...</h3>:
            <TableRow>
              <TableCell sx={{                  borderBottom: "none"}}component="th" scope="row">
                {console.log("viewwww", viewsCategories)}
                {viewsCategories.length == 0 ? (
                  <p>no categories</p>
                ) : (
                  viewsCategories.map((value) => (
                    <TableRow>
                      <TableCell component="th" scope="row"
                      sx={{borderBottom: "none"}}>
                        {value.name}
                      </TableCell>
                    </TableRow>
                  ))
                )} 
              </TableCell>
              <TableCell sx={{                  borderBottom: "none"}} component="th" scope="row">
                {viewsTags.length == 0 ? (
                  <p>no tags</p>
                ) : (
                  viewsTags.map((value) => (
                    <TableRow>
                      <TableCell component="th" scope="row"
                      sx={{borderBottom: "none"}}>
                        {value.name}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableCell>
              <TableCell
                sx={{
                  borderBottom: "none",
                  display: "flex",
                  justifyContent: "space-between",
                  width: "70%",
                  paddingLeft: "0",
                  paddingRight: "0",
                }}
                component="th"
                scope="row"
              >
                <TableCell
                  sx={{
                    borderBottom: "none",
                    display: "flex",
                    flexDirection: "column",
                    paddingRight: "0",
                    paddingLeft: "0",

                    justifyContent: "space-between",
                  }}
                >
                  {viewsMetaSchema.length == 0 ? (
                    <p>no schema</p>
                  ) : (
                    viewsMetaSchema[localview].map((value) => (
                      <span>{value.name}</span>
                    ))
                  )}
                </TableCell>
                <TableCell
                  sx={{
                    borderBottom: "none",
                    display: "flex",
                    flexDirection: "column",
                    paddingLeft: "0",
                    paddingRight: "0",
                    justifyContent: "space-between",
                  }}
                >
                  {viewsMetaSchema.length == 0 ? (
                    <p>-</p>
                  ) : (
                    
                    viewsMetaSchema[localview].map((value) => (
                      <span>{value.type}</span>
                    ))
                  )}
                </TableCell>
                <TableCell
                  sx={{
                    borderBottom: "none",
                    display: "flex",
                    flexDirection: "column",
                    paddingLeft: "0",
                    paddingRight: "0",
                    justifyContent: "space-between",
                  }}
                >
                  {viewsMetaSchema.length == 0 ? (
                    <p>-</p>
                  ) : (
                    
                    viewsMetaSchema[localview].map((value) => (
                      <span>{value.input ? <DoneIcon /> : <CloseIcon />}</span>
                    ))
                  )}
                </TableCell>
                <TableCell
                  sx={{
                    borderBottom: "none",
                    display: "flex",
                    flexDirection: "column",
                    paddingLeft: "0",

                    justifyContent: "space-between",
                  }}
                >
                  {viewsMetaSchema.length == 0 ? (
                    <p>-</p>
                  ) : (
                    viewsMetaSchema[localview].map((value) => (
                      <span>{value.output ? <DoneIcon /> : <CloseIcon />}</span>
                    ))
                  )}
                </TableCell>
              </TableCell>

              <TableCell sx={{                  borderBottom: "none",
}}component="th" scope="row">
                {wsType }
              </TableCell>
            </TableRow>}
          </TableBody>
        </Table>
        {
        wsType === 'REST' ?
        < AppBar sx={{ position: "relative", backgroundColor: "#3c8dbc" }}>
          <Toolbar>
            <Typography sx={{ flex: 1 }} variant="h6" component="div">
              Sample Data
            </Typography>
            <IconButton
              edge="start"
              color="inherit"
              onClick={openSampleData?handleCloseSampleData: handlechangeSampleData}
              aria-label="expand row"
              size="small"
              // onClick={
              //   props.showmetadata[index]
              //     ? () => {
              //       changeMetadata(index);
              //     }
              //     : !props.showmetadata.includes(true)
              //       ? () => {
              //         changeMetadata(index);
              //         getMetadata(index);
              //       }
              //       : () => { }
              // }
            >
              {openSampleData ? (
                <KeyboardArrowUpIcon />
              ) : (
                <KeyboardArrowDownIcon />
              )}
            </IconButton>
          </Toolbar>
        </AppBar> : null

}
{loadData?<h3 style={{paddingLeft:'20px'}}> Getting sample data...</h3>:
        openSampleData && 
           
            <Box>
 <Table stickyHeader sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                {sampleData &&
                  sampleData[0].map((row) => (
                    <TableCell component="tr" style={{ fontWeight: "bold" }}>
                      {row}
                    </TableCell>
                  ))}{" "}
              </TableRow>
            </TableHead>
            <TableBody>
              {sampleData &&
                sampleData.slice(1).map((row) => (
                  <TableRow
                    hover
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                      maxHeight: 450,
                    }}
                  >
                    {row.map((element) => (
                      <TableCell component="th" scope="row">
                        {element ? element : <p>null</p>}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
            </TableBody>
          </Table>
            </Box>
         
          
        }
      </Dialog>
    </div>
  );
}
export default Metadata;
