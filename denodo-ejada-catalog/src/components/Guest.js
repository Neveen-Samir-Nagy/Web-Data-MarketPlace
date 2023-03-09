import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";

import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import secureLocalStorage from "react-secure-storage";

import InfoIcon from "@mui/icons-material/Info";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import Navbar from "./Navbar";
import Metadata from "./metadata";
import { Box } from "@mui/system";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, TextField } from "@mui/material";
import axios from "axios";
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import * as React from "react";

import { useEffect, useState } from "react";

function New() {
  const [wsNew, setWsNew] = useState([]);

  const [open, setOpen] = useState(false);

  const [serviceName, setServiceName] = useState("");

  const [DB, setDB] = useState("");
  const [Created, setCreated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [Done, setDone] = useState(false);
  const [load, setLoad] = useState(false);


 
  useEffect(() => {
axios
          .get(
            "http://localhost:3000/webcontainer_services/admin"
          )
          .then((res) => {
            setWsNew(res.data);
          })
          .catch((error) => {
            console.log(error);
          })
  }, []);

  // const Transition = React.forwardRef(function Transition(
  //   props: TransitionProps & {
  //     children: React.ReactElement;
  //   },
  //   ref: React.Ref<unknown>,
  // ) {
  //   return <Slide direction="up" ref={ref} {...props} />;
  // });

  const handleClickOpen = (key) => {
    setServiceName(wsNew[key].service_name);
    setDB(wsNew[key].database_name);
    setOpen(true);
    {
      console.log(serviceName);
    }
  };
  const handlesubmit=(e)=>{
    e.preventDefault();
    setLoad(true)
    console.log("http://localhost:3000/create-user/"+username +"/" + password )
    axios
          .get(
            "http://localhost:3000/create-user/"+username +"/" + password 
          )
          .then((res) => {
            console.log(res.data);
          })
          .then(()=>{
            setLoad(false)
          })
          .then(()=>{
            setDone(true)
          })
          .catch((error) => {
            console.log(error);
          })
  
  }
const handleOpenNew=()=>{
  setCreated(true)
}
const handleCloseNew=()=>{
  setCreated(false)
  setDone(false)
}
  return (
    <Navbar>
      <Box sx={{ position:'relative' , height:'100%'}}>
      <Button onClick={handleOpenNew} variant="contained" sx={{position:'fixed',bottom:'5%',right:'3%',borderRadius:'20px'}} endIcon={<PersonAddAltIcon/>} >
  Create User
</Button>
        <h3 style={{ position: "static" }}>products</h3>
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
          
          {wsNew
            .map((item, key) => (
              <Box>
                <Card
                  sx={{
                    width: 300,
                    maxWidth: 300,
                    marginTop: "15px",
                    marginRight: "20px",
                  }}
                >
                  <CardHeader
                    title={item.service_name}
                    subheader={item.service_type}
                    sx={{
                      '.css-1qvr50w-MuiTypography-root':{
                        maxWidth:'85%',
                        textOverflow:'ellipsis',
                        overflow:'hidden',
                        whiteSpace:'nowrap'
                      }
                    }}
                  />

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
                      <InfoIcon onClick={() => handleClickOpen(key)} />
                    </IconButton>
                  </CardActions>
                </Card>

                {open && (
                  <Metadata
                    open={open}
                    DB={DB}
                    name={serviceName}
                    setOpen={setOpen}
                  />
                )}
              </Box>
            ))}
        </Box>

      </Box>
      <Dialog  open={Created}>
        <DialogTitle>Create new user</DialogTitle>
        <form onSubmit={handlesubmit}>

        <DialogContent>

        <Box
              sx={{
                display: "flex",
                width: "100%",
                marginBottom: "10px",
                padding:'0',
                justifyContent: "space-between",
              }}
            >
                   <TextField
                required
                id="outlined-basic"
                onChange={(e) => {
                  setUsername(e.target.value);
                }}
                sx={{
                  marginRight: "0",
                  marginLeft: "0",
                  padding:'0',

                  m: 1,
                  width: "48%",
                }}
                label="username"
                variant="outlined"
              />
              <TextField
                id="outlined-basic"
                required
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                label="password"
                sx={{
                  m: 1,
                  width: "48%",
                  marginRight: "0",
                  padding:'0',

                  marginLeft: "0",
                }}
                type='password'
                variant="outlined"
              />
         
            </Box>

 </DialogContent>
        <DialogActions>
        <Button disabled={load} onClick={handleCloseNew}>
              Close
            </Button>
            <Button  disabled={load} type='submit' >
                {load?'Creating...':'Create'}
            </Button>
        </DialogActions>
        </form>
        </Dialog>
        <Dialog open={Done}>
          <DialogContent>
            {username} created Successfully
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseNew}>
              Ok
            </Button>
          </DialogActions>
        </Dialog>
    </Navbar>
    //key==wsNew.length-1&&Found&&
  );
}
export default New;
