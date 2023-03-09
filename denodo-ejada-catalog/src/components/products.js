import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";

import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import excel from "exceljs";
import { saveAs } from "file-saver";
import LaunchIcon from "@mui/icons-material/Launch";
import InfoIcon from "@mui/icons-material/Info";
import Navbar from "./Navbar";
import Metadata from "./metadata";
import DownloadIcon from '@mui/icons-material/Download';
import { Box } from "@mui/system";
import axios from "axios";
import { useEffect, useState } from "react";
import secureLocalStorage from "react-secure-storage";
import Remote from './Remote';
import MoreDetails from './MoreDetails';
import { Button, Dialog, DialogActions, DialogContent, Divider, Menu, MenuItem, Portal } from "@mui/material";
import { Link } from "react-router-dom";
import CircularProgress from '@mui/material/CircularProgress';

function Products() {
  const [purchasedWs, setPurchasedWs] = useState([]);
  const [open, setOpen] = useState(false);
  const [openDownload, setOpenDownload] = useState();
  const [openRemote, setOpenRemote] = useState(false);
  const [OpenDetails, setOpenDetails] = useState(false);

  const [serviceName, setServiceName] = useState('');
  const [viewName, setViewName] = useState('');
  const [wsType, setWsType] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);

  const [DB, setDB] = useState('');
  const [context, setContext] = useState('');
  const [ipDenodo, setIpDenodo] = useState("");
  const [port, setPort] = useState("");
  const [LoadExcel, setLoadExcel] = useState(false);
  const [openExcel, setOpenExcel] = useState(false);

  useEffect(() => {
    secureLocalStorage.getItem("products") ?
      setPurchasedWs(secureLocalStorage.getItem("products"))
      :
      axios
        .get(
          "http://localhost:3000/webcontainer_services/" + secureLocalStorage.getItem("user") + ""
        )
        .then((response) => {
          setPurchasedWs(response.data);
          secureLocalStorage.setItem("products", response.data)
          console.log('here')

        })
  }, [])
  const handleDownload = async (key) => {
    setLoadExcel(true)
    setOpenExcel(true)
    await axios.get('http://localhost:3000/download-excel/' + key.database_name + '/' + key.service_name + '/' + key.service_name)
      .then((res) => {
        download(res.data, String(key.service_name));
      })
      .catch((e) => { console.log(e.message) })

  }
  const download = (objs, name) => {
    var workbook = new excel.Workbook();
    var worksheet = workbook.addWorksheet("Tutorials");
    var headers = Object.keys(objs[0]);
    console.log("headers", headers);
    var columns = [];
    headers.forEach((head) => {
      columns.push({ header: head, key: head });
    });
    worksheet.columns = columns;
    worksheet.addRows(objs); // Add data in worksheet
    console.log("second row", worksheet.getRow(2).values);

    // Making first line in excel bold
    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true };
    });

    try {
      saveFile(name + '_data.xlsx', workbook)

      async function saveFile(fileName, workbook) {
        const xls64 = await workbook.xlsx.writeBuffer({ base64: true })
        saveAs(
          new Blob([xls64], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
          fileName
        )
      }
      setOpenExcel(true)
      setLoadExcel(false)
    } catch (err) {
      console.log(err);
    }
  };
  const handleClickOpen = (key) => {
    console.log(key)

    setServiceName(key.service_name)
    setDB(key.database_name)
    setOpen(true);
    console.log(key.service_name)
    console.log(key.database_name)

  };
  const handleRedirect = (key) => {
    console.log(key)
    console.log(key.context)
    setServiceName(key.service_name)
    setDB(key.database_name)
    setContext(key.context)
  };
  const handleClose = () => {
    setAnchorEl(null)
    setOpenDownload(false)
  };
  const handleOpenRemote = (key) => {

    setContext(key.context)
    setServiceName(key.service_name)
    setDB(key.database_name)
    setOpenRemote(true)
    handleClose();
    console.log(openRemote)
  };
  const handleCloseDetails = () => {
    setAnchorEl(null)
    setOpenDetails(false)
  };
  const handleOpenDownload = (event, key) => {
    setOpenDownload(key);
    setAnchorEl(event.currentTarget);

    console.log(purchasedWs[key].database_name,purchasedWs[key].service_name)
    axios.get(
      `http://localhost:3000/ws-viewName/${purchasedWs[key].database_name}/${purchasedWs[key].service_name}`
    )
      .then((response) => {
        setViewName(response.data);
      })
  };
  const handleOpenDetails = (key) => {
    axios.get(
      "http://localhost:3000/connection-details"
    )
      .then((response) => {
        setIpDenodo(response.data[0]['server_ip'])
        setPort(response.data[0]['port'])
      })
      setWsType(key.service_type);

    setServiceName(key.service_name)
    setDB(key.database_name)
    setContext(key.context)
    console.log(key)
    console.log(key.service_name)

    console.log(key.context)
    console.log(context)
    setOpenDetails(true)
    handleClose();
    console.log(openRemote)
  };
  const handleCloseRemote = () => {
    setOpenRemote(false)
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
          {purchasedWs.map((item, key) => (item.subscripe ?
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
                  <Typography  variant="body2" color="text.secondary">
                  Product Description
                  </Typography>
                </CardContent>
                <Divider />

                <CardActions
                  sx={{ display: "flex", justifyContent: "end" }}
                  disableSpacing
                >
                  <IconButton onClick={() => handleRedirect(item)} href={'http://localhost:9090' + context} target="_blank" >
                    <LaunchIcon />
                  </IconButton>
                  <IconButton>
                    <InfoIcon onClick={() => handleClickOpen(item)} />
                  </IconButton>
                  <IconButton
                    onClick={(event) => handleOpenDownload(event, key)} >
                    <DownloadIcon />
                  </IconButton>
                  
                  {item.service_type==='SOAP'? <Menu
                    open={openDownload === key}
                    anchorEl={anchorEl}
                    onClose={handleClose}
                  >
                    <MenuItem onClick={() => {console.log(item); handleOpenDetails(item)}}>More Connection Details</MenuItem>
                  </Menu> : 
                  <Menu
                    open={openDownload === key}
                    anchorEl={anchorEl}
                    onClose={handleClose}
                  >
                    <MenuItem onClick={() => handleDownload(item)}>Excel</MenuItem>
                    <MenuItem onClick={() => handleOpenRemote(item)} >External Database</MenuItem>

                    <MenuItem onClick={() => {console.log(item); handleOpenDetails(item)}}>More Connection Details</MenuItem>
                  </Menu>}
                  </CardActions>

              </Card>
              <Dialog open={openExcel}>
                <DialogContent sx={{ width: '100%', textAlign: 'center' }}>
                  {LoadExcel ? <CircularProgress /> : 'Downloaded Successfully'}       </DialogContent>
                <DialogActions>
                  <Button disabled={LoadExcel} onClick={() => setOpenExcel(false)}>
                    Ok
                  </Button>
                </DialogActions>
              </Dialog>
              {open && <Metadata open={open} DB={DB} name={serviceName} setOpen={setOpen} />}
              {openRemote && <Remote viewName={viewName} DB={DB} wsName={serviceName} close={handleCloseRemote} open={openRemote} />}
              {OpenDetails && <MoreDetails wsType={wsType} viewName={viewName} DB={DB} wsName={serviceName} close={handleCloseDetails} context={context} open={OpenDetails} ipDenodo={ipDenodo} port={port} />}
            </Box>
            :
            <h1></h1>))}
        </Box>
      </Box>
    </Navbar>

  );
}
export default Products;
