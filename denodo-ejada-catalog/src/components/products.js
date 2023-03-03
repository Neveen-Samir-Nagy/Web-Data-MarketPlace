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
import DownloadIcon from '@mui/icons-material/Download';
import { Box } from "@mui/system";
import axios from "axios";
import excel from "exceljs";
import { saveAs } from "file-saver";
import { useEffect, useState } from "react";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';

import { Button, Container, Divider } from "@mui/material";
import { Link } from "react-router-dom";
function Products() {
  const [purchasedWs, setPurchasedWs] = useState([]);
  const [open, setOpen] = useState(false);

  const [serviceName, setServiceName] = useState('');

  const [DB, setDB] = useState('');

  const [viewsMetaSchema, setViewsMetaSchema] = useState([]);
  const [viewsTags, setViewsTags] = useState([]);
  const [viewsCategories, setViewsCategories] = useState([]);
  const [wsType, setWsType] = useState('');
  const [loadingData, setLoadingData] = useState(false);
  var ip = 'localhost';
  var port_denodo = '9090';
  var protocol_denodo = 'http';

  console.log('products');
  useEffect(() => {
    axios
      .get(
        "http://localhost:3000/webcontainer_services/" + localStorage.getItem("user") + ""
      )
      .then((response) => {
        setPurchasedWs(response.data);
        console.log(response.data);
      })
  }, [])

  const handleDownload = async (key) => {
    await axios.get('http://localhost:3000/download-excel/' + purchasedWs[key].database_name + '/' + purchasedWs[key].service_name + '/' + purchasedWs[key].service_name)
      .then((res) => {
        download(res.data, String(purchasedWs[key].service_name));
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
      saveFile(name+'_data.xlsx', workbook)

      async function saveFile(fileName, workbook) {
        const xls64 = await workbook.xlsx.writeBuffer({ base64: true })
        saveAs(
          new Blob([xls64], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
          fileName
        )
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleClickOpen = (key) => {
    setServiceName(purchasedWs[key].service_name)
    setDB(purchasedWs[key].database_name)
    setOpen(true);

    { console.log(purchasedWs[key].service_name) }
    //setViewsMetaSchema([]);
    var arr_schema = [];
    arr_schema.push(['Name', 'Type', 'Input', 'Output'])
    axios.get('http://localhost:3000/ws-details/' + purchasedWs[key].database_name + '/' + purchasedWs[key].service_name)
      .then((res) => {
        Object.keys(JSON.parse(res.data)["schema"]).forEach(function (key) {
          JSON.parse(res.data)["schema"][key].map((item) => { arr_schema.push([String(item.name), String(item.type), String(item.input), String(item.output)]); });
        });
        setViewsMetaSchema(arr_schema);
        //setViewsMetaSchema(JSON.parse(res.data)["schema"][0])
        setViewsTags(
          JSON.parse(res.data)["tags"].map((item) => item.name)
        );
        console.log(viewsMetaSchema);

        setViewsCategories(
          JSON.parse(res.data)["categories"].map((item) => item.name)
        );
        setWsType(JSON.parse(res.data)["wsType"]);
        //setLoadingData(false);
        setLoadingData(true);
      })
      .catch((error) => {
        console.log(error);
      });

  };

  const handleClickApi = (key) => {
    window.open(''+protocol_denodo+'://'+ip+':'+port_denodo + purchasedWs[key].context);
  }

  const handleMoreDetails = (key) => {
    axios.get('http://localhost:3000/more-details/' + purchasedWs[key].database_name + '/' + purchasedWs[key].service_name)
      .then((res) => {
        window.open(res.data);
      })
      .catch((e) => { console.log(e.message) })
  }

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
                  <IconButton onClick={() => handleClickApi(key)}>
                    <LaunchIcon />
                  </IconButton>
                  <IconButton>
                    <InfoIcon onClick={() => handleClickOpen(key)} />
                  </IconButton>
                    {purchasedWs[key].service_type == 'REST' ? <IconButton><DownloadIcon onClick={() => handleDownload(key)} />  </IconButton> : <></>} 
                    {purchasedWs[key].service_type == 'REST' ? <IconButton><UnfoldMoreIcon onClick={() => handleMoreDetails(key)} />  </IconButton> : <></>} 
                </CardActions>
              </Card>
              <Metadata open={open} DB={DB} name={serviceName} setOpen={setOpen} viewsCategories={viewsCategories}
                viewsTags={viewsTags} viewsMetaSchema={viewsMetaSchema} loadingData={loadingData} wsType={wsType} />
            </Box>
            : <></>))}
        </Box>
      </Box>
    </Navbar>

  );
}
export default Products;
