import { useState, Fragment } from "react";
import axios from "axios";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";

export default function BasicTable(props) {
  //const [viewsMeta,setViewsMeta]=useState()
  const [viewsTags, setViewsTags] = useState();
  const [viewsMetaSchema, setViewsMetaSchema] = useState();
  const changeMetadata = (index) => {
    setViewsMetaSchema();
    var meta = JSON.parse(JSON.stringify(props.showmetadata));
    meta[index] = !meta[index];
    props.setshowmetadata(meta);
  };

  const getMetadata = (index) => {
    axios
      .get(
        "http://localhost:3000/view-details/" +
          props.data[index]["databaseName"] +
          "/" +
          props.data[index]["name"]
      )
      .then((response) => {
        //setViewsMeta(JSON.parse(response.data));
        setViewsMetaSchema(JSON.parse(response.data)["schema"]);
        setViewsTags(
          JSON.parse(response.data)["tags"].map((item) => item.name)
        );
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const Row = (row, index) => {
    return (
      <Fragment>
        <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
          <TableCell>
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={
                props.showmetadata[index]
                  ? () => {
                      changeMetadata(index);
                    }
                  : !props.showmetadata.includes(true)
                  ? () => {
                      changeMetadata(index);
                      getMetadata(index);
                    }
                  : () => {}
              }
            >
              {props.showmetadata[index] ? (
                <KeyboardArrowUpIcon />
              ) : (
                <KeyboardArrowDownIcon />
              )}
            </IconButton>
          </TableCell>
          <TableCell component="th" scope="row">
            {row["name"]}
          </TableCell>
          <TableCell align="center">
            <Button sx={{ color: "#000" }}>
              <RemoveRedEyeIcon onClick={() => handleopen(index)} />
            </Button>
          </TableCell>
          <TableCell align="center">
            <Button
              onClick={() => handleopenDialog(row["name"])}
              variant="contained"
              color="success"
              sx={{
                color: "#FFF",
                borderRadius: "10%",
                boxShadow: "#434241 0px 0px 3px 1px;",
              }}
            >
              Get API
            </Button>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse
              in={props.showmetadata[index]}
              timeout="auto"
              unmountOnExit
            >
              <Box sx={{ margin: 1 }}>
                <Typography variant="h6" gutterBottom component="div">
                  Metadata
                </Typography>
                <Table size="small" aria-label="purchases">
                  <TableHead>
                    <TableRow>
                      <TableCell>Description</TableCell>
                      <TableCell>Tag</TableCell>
                      <TableCell>Schema</TableCell>
                      <TableCell align="right">Modification Date</TableCell>
                      <TableCell align="right">Type</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {!props.showmetadata[index] ? (
                      "Not authorized"
                    ) : (
                      <TableRow>
                        <TableCell
                          id={"desc_" + index}
                          component="th"
                          scope="row"
                        >
                          {"description"}
                        </TableCell>
                        <TableCell
                          id={"desc_" + index}
                          component="th"
                          scope="row"
                        >
                          {String(viewsTags)}
                        </TableCell>
                        {viewsMetaSchema &&
                          viewsMetaSchema.map((value) => (
                            <TableRow>
                              <TableCell
                                id={"desc_" + index}
                                component="th"
                                scope="row"
                              >
                                {}
                              </TableCell>
                              <TableCell
                                id={"desc_" + index}
                                component="th"
                                scope="row"
                              >
                                {}
                              </TableCell>
                              <TableCell id={"schema_" + index}>
                                <span style={{ display: "block" }}>
                                  {value.name}
                                </span>
                              </TableCell>
                              <TableCell id={"date_" + index} align="left">
                                {}
                              </TableCell>
                              <TableCell id={"type_" + index} align="left">
                                {}
                              </TableCell>
                            </TableRow>
                          ))}
                        <TableCell id={"date_" + index} align="left">
                          {"11/11/2022"}
                        </TableCell>
                        <TableCell id={"type_" + index} align="left">
                          {"view"}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </Fragment>
    );
  };

  const [openDialog, setOpenDialog] = useState(false);
  const [viewnameselected, setViewnameselected] = useState("");
  const [databasenameselected, setDatabasenameselected] = useState("");

  const handleopenDialog = (viewname) => {
    setViewnameselected(viewname);
    setDatabasenameselected(
      props.data.find((x) => x.name === viewname).databaseName
    );
    setOpenDialog(true);
  };

  const handlecloseDialog = () => {
    setOpenDialog(false);
  };

  const handleopen = (index) => {
    props.samples(index);
    props.open();
  };

  const getAPI = () => {
    axios
      .get(
        "http://localhost:3000/get-api/" +
          props.data.find((x) => x.name === viewnameselected).databaseName +
          "/" +
          viewnameselected
      )
      .then((response) => {
        var url = String(response.data);
        window.open(url);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <TableContainer
      component={Paper}
      sx={{
        height: 440,
        maxHeight: 440,
        boxShadow: "#727272a3 2px 2px 8px",
        position: "relative",
      }}
    >
      <Table stickyHeader sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell style={{ fontWeight: "bold" }}></TableCell>
            <TableCell style={{ fontWeight: "bold" }}>View name</TableCell>
            <TableCell align="center" style={{ fontWeight: "bold" }}>
              Show Data
            </TableCell>
            <TableCell align="center" style={{ fontWeight: "bold" }}>
              URL
            </TableCell>
          </TableRow>
        </TableHead>
        {props.loadingViews ? (
          <Box
            sx={{
              display: "flex",
              position: "absolute",
              top: "50%",
              right: "50%",
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <TableBody>
            {props.data.map((row, index) => Row(row, index))}
          </TableBody>
        )}
      </Table>

      <Dialog open={openDialog}>
        <DialogTitle>View's link</DialogTitle>
        <DialogContent dividers>
          <h4>
            http://localhost:9090/denodo-restfulws/{databasenameselected}/views/
            {viewnameselected}
          </h4>
        </DialogContent>

        <DialogActions>
          <Button autoFocus onClick={handlecloseDialog}>
            Cancel
          </Button>
          <Button onClick={getAPI}>GET</Button>
        </DialogActions>
      </Dialog>
    </TableContainer>
  );
}
