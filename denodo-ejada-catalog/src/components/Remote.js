import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Dialog from "@mui/material/Dialog";

import { useState } from "react";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import axios from "axios";


function Remote(props) {
  const { onClose, value: valueProp, open, ...other } = props;
  const [value, setValue] = React.useState(valueProp);
  const [selectDB, setSelectDB] = React.useState("");
  const [database, setDatabase] = React.useState("");
  const [hostname, setHostname] = React.useState("");
  const [port, setPort] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [databaseName, setDatabaseName] = useState("");
  const [tableName, setTableName] = React.useState("");
  const [version, setVersion] = React.useState("");
  const [versionName, setVersionName] = React.useState("");
  const [URL, setURL] = React.useState("");
  const [driverClass, setDriverClass] = React.useState("");
  const [classPath, setClassPath] = React.useState("");
  const [ConnectionError, setConnectionError] = useState(false);
  const [Created, setCreated] = React.useState(false);

  const [Load, setLoad] = React.useState(false);

  
  const handlesubmit = (e) => {
    e.preventDefault();
 
   
    (selectDB===10? 
    setURL(`jdbc:postgresql://${hostname}:${port}/${databaseName}`):selectDB===20? 
    setURL(`jdbc:oracle:thin:@/${hostname}:${port}:${databaseName}`):selectDB===30? 
    setURL(
      `jdbc:sqlserver://${hostname}:${port};databaseName=${databaseName}`
    ): 
    setURL(`jdbc:mysql://${hostname}:${port}/${databaseName}`))
    handleCreate()
  };
  const handleCreate = () => {


      
    console.log('done',"create_remote_table", 'databaseName', databaseName,"JDBC", "create_remote_table",
       'driverClass', driverClass,
       'url', URL,
       'user', username,
       'pass',password,
       'classPath', classPath,
       'database', database,
       'version', versionName)
   axios.post("http://localhost:3000/create-datasource", {
        databaseName: 'admin',
        datasourceType: "JDBC",
        datasourceName: "create_remote_table",
        driverClass: driverClass,
        url: URL,
        user: username,
        pass: password,
        classPath: classPath,
        database: database,
        version: versionName
      })
      .then((res)=>{
        res.data==='UP'?
        handleCreateTable():setConnectionError(true);
      })
  };
  const handleCreateTable=()=>{
    setLoad(true)
   const slice=props.wsName.slice(3)
    axios.get(`http://localhost:3000/create-remoteTable/${tableName}/admin/create_remote_table/${props.DB}/${props.viewName}`)
      .then((res)=>    {res.data === 'Done' ? setCreated(true) : setCreated(false)}
      )
  }




  const handleChangeDrivername = (event) => {
    setSelectDB(event.target.value);
  {event.target.value===10? 
    setDatabase('postgresql'):event.target.value===20? 
    setDatabase('oracle'):event.target.value===30? 
    setDatabase('sqlserver'): 
    setDatabase('mysql')}  
    handlesetDriverClass(event.target.value)
};

const handlesetDriverClass=(databaseSelected)=>{
    databaseSelected===10?
    setDriverClass("org.postgresql.Driver"):   
     databaseSelected===20?
     setDriverClass("oracle.jdbc.OracleDriver"):
     databaseSelected===30?
     setDriverClass("com.microsoft.sqlserver.jdbc.SQLServerDriver"):setDriverClass("com.mysql.jdbc.Driver")
  }




  const handleChangeVersion = (event) => {
    setVersion(event.target.value);
    handleSetClassPath(event.target.value)

handleSetversionName(event.target.value)
  };
  const handleSetversionName=(versionnum)=>{
    {selectDB === 10
        ? (
        
            setVersionName(versionnum))
         
        : selectDB === 20
        ? (
          (versionnum === '12c-v12.2.0.1'?setVersionName('12c'):versionnum === '10g-v10.2.0.5'?setVersionName('9i') :setVersionName(versionnum))
         
        ):selectDB === 30
        ? (
            versionnum === 2008 ? setVersionName("6.x") : setVersionName("7.x")
         
        ): (
            setVersionName(versionnum)
          )};
  }
  const handleSetClassPath=(versionnum)=>{
    selectDB===10? setClassPath(`postgresql-${versionnum}`)
    :selectDB===20? setClassPath(`oracle-${versionnum}`)
   :selectDB===30? setClassPath(`mssql-jdbc-${versionnum}`): setClassPath(`mysql-${versionnum}`)
  }



const handlechangeURL=(e)=>{

    setDatabaseName(e.target.value)
    (hostname.length>0&&port.length>0?
        (selectDB===10? 
            setURL(`jdbc:postgresql://${hostname}:${port}/${e.target.value}`):selectDB===20? 
            setURL(`jdbc:oracle:thin:@/${hostname}:${port}:${e.target.value}`):selectDB===30? 
            setURL(
              `jdbc:sqlserver://${hostname}:${port};databaseName=${e.target.value}`
            ): 
            setURL(`jdbc:mysql://${hostname}:${port}/${e.target.value}`)):null )
}
const handleCloseError=()=>{
    setConnectionError(false)
    setLoad(false)

}
const handleCloseCreated=()=>{
    setCreated(false)
    props.close()
}
  return (
    <Dialog
      sx={{ "& .MuiDialog-paper": { width: "100%", maxHeight: 500 } }}
      maxWidth="sm"
      open={props.open}
      {...other}
    >
      <form onSubmit={handlesubmit}>
        <DialogTitle>Database Details</DialogTitle>
        <DialogContent dividers>
          <FormControl sx={{ width: "100%" }}>
            <Box
              sx={{
                display: "flex",
                width: "100%",
                marginBottom: "10px",
                justifyContent: "space-between",
              }}
            >
              <InputLabel>Select DB</InputLabel>
              <Select
                required
                sx={{ width: "45%" }}
                value={selectDB}
                label="Select DB"
                onChange={(e) => handleChangeDrivername(e)}
              >
                <MenuItem value={10}>postgreSQL</MenuItem>
                <MenuItem value={20}>Oracle</MenuItem>
                <MenuItem value={30}>Microsoft SQL Server</MenuItem>
                <MenuItem value={40}>MYSQL</MenuItem>
              </Select>
              {selectDB === 10 ? (
                <FormControl sx={{ width: "45%" }}>
                  <InputLabel>Version</InputLabel>
                  <Select
                    required
                    value={version}
                    label="Version"
                    onChange={(e) => handleChangeVersion(e)}
                  >
                    <MenuItem value={8}>8</MenuItem>
                    <MenuItem value={9}>9</MenuItem>
                    <MenuItem value={10}>10</MenuItem>
                    <MenuItem value={11}>11</MenuItem>
                    <MenuItem value={12}>12</MenuItem>
                  </Select>
                </FormControl>
              ) : selectDB === 20 ? (
                <FormControl sx={{ width: "45%" }}>
                  <InputLabel>Version</InputLabel>

                  <Select
                    required
                    value={version}
                    label="Version"
                    onChange={(e) => handleChangeVersion(e)}
                  >
                    <MenuItem value={'9i'}>8i</MenuItem>
                    <MenuItem value={'10g-v10.2.0.5'}>9i</MenuItem>
                    <MenuItem value={'11g'}>11g</MenuItem>
                    <MenuItem value={'12c-v12.2.0.1'}>12c</MenuItem>
                    <MenuItem value={'18C'}>18c</MenuItem>
                    <MenuItem value={'19C'}>19c</MenuItem>
                    
                  </Select>
                </FormControl>
              ) : selectDB === 30 ? (
                <FormControl sx={{ width: "45%" }}>
                  <InputLabel>Version</InputLabel>

                  <Select
                    required
                    value={version}
                    label="Version"
                    onChange={(e) => handleChangeVersion(e)}
                  >
                    <MenuItem value={2008}>2008</MenuItem>
                    <MenuItem value={2012}>2012</MenuItem>
                    <MenuItem value={2014}>2014</MenuItem>
                    <MenuItem value={2016}>2016</MenuItem>
                    <MenuItem value={2017}>2017</MenuItem>
                  </Select>
                </FormControl>
              ) : (
                <FormControl sx={{ width: "45%" }}>
                  <InputLabel>Version</InputLabel>

                  <Select
                    required
                    value={version}
                    label="Version"
                    onChange={(e) => handleChangeVersion(e)}
                  >
                    <MenuItem value={4}>MYSQL4</MenuItem>
                    <MenuItem value={5}>MYSQL5</MenuItem>
                  </Select>
                </FormControl>
              )}
            </Box>
            <Box
              sx={{
                display: "flex",
                width: "100%",
                marginBottom: "10px",
                justifyContent: "space-between",
              }}
            >
              <TextField
                id="outlined-basic"
                required
                onChange={(e) => {
                  setHostname(e.target.value);
                }}
                label="Hostname"
                sx={{
                  m: 1,
                  width: "65%",
                  marginRight: "0",
                  marginLeft: "0",
                }}
                variant="outlined"
              />
              <TextField
                required
                id="outlined-basic"
                onChange={(e) => {
                  setPort(e.target.value);
                }}
                sx={{
                  marginRight: "0",
                  marginLeft: "0",
                  "input::-webkit-outer-spin-button, input::-webkit-inner-spin-button":
                    {
                      WebkitAppearance: "none",
                      margin: 0,
                    },
                  "input[type=number]": {
                    MozAppearance: "textfield",
                  },

                  m: 1,
                  width: "30%",
                }}
                type="number"
                label="Port"
                variant="outlined"
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                width: "100%",
                marginBottom: "10px",
                justifyContent: "space-between",
              }}
            >
              <TextField
                id="outlined-basic"
                onChange={(e) => {
                  handlechangeURL(e);
                }}
                required
                sx={{
                  m: 1,
                  width: "45%",
                  marginRight: "0",
                  marginLeft: "0",
                }}
                label="Database Name"
                variant="outlined"
              />

              <TextField
                required
                id="outlined-basic"
                onChange={(e) => {
                  setTableName(e.target.value);
                }}
                sx={{
                  m: 1,
                  width: "45%",
                  marginRight: "0",
                  marginLeft: "0",
                }}
                label="Database Table Name"
                variant="outlined"
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                width: "100%",
                marginBottom: "10px",
                justifyContent: "space-between",
              }}
            >
              <TextField
                id="outlined-basic"
                onChange={(e) => {
                  setUsername(e.target.value);
                }}
                required
                label="Username"
                variant="outlined"
                sx={{
                  m: 1,
                  width: "45%",
                  marginRight: "0",
                  marginLeft: "0",
                }}
              />
              <TextField
                required
                id="outlined-basic"
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                sx={{
                  m: 1,
                  width: "45%",
                  marginRight: "0",
                  marginLeft: "0",
                }}
                type="password"
                label="password"
                variant="outlined"
              />
            </Box>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button disabled={Load}  autoFocus onClick={props.close}>
            Cancel
          </Button>
          <Button disabled={Load} type="submit"> {Load?'connecting...':'Ok'}</Button>
        </DialogActions>
      </form>
      <Dialog  open={ConnectionError}>
        <DialogContent>
            Connection Error
        </DialogContent>
        <DialogActions>
            <Button onClick={handleCloseError}>
                Close
            </Button>
        </DialogActions>
        </Dialog>
        <Dialog  open={Created}>
        <DialogContent>
Table {tableName} is created Successfully in {database} Database with name: {databaseName}
        </DialogContent>
        <DialogActions>
            <Button onClick={handleCloseCreated}>
                Ok
            </Button>
        </DialogActions>
        </Dialog>
    </Dialog>

  );
}
export default Remote;
