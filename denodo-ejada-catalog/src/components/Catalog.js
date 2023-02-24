import React, { useState } from "react";
import axios from "axios";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Views from "./Views";
import Container from "@mui/material/Container";
import DBselect from "./DBselect";
import Data from "./Data";
import Login from "./login";
function ResponsiveAppBar() {
  const [showViews, setShowViews] = useState(false);

  const [selectedView, setSelectedView] = useState(null);
  const [showdata, setShowdata] = useState(false);
  const [showmetadata, setShowmetadata] = useState([]);
  var [selectedDB, setSelectedDB] = useState("");
  var [data, setdata] = useState([]);
  var [fields, setFields] = useState([]);
  var [values, setValues] = useState([]);
  const [loadingViews, setLoadingViews] = useState(false);
  const [loadingData, setLoadingData] = useState(false);

  const handleclick = (DBname) => {
    setLoadingViews(true);
    axios
      .get("http://localhost:3000/views/" + DBname + "/50/1")
      .then((response) => {
        setdata(response.data);
        console.log("views", data);
        setShowmetadata(new Array(response.data.length).fill(false));
        setLoadingViews(false);
      })
      .catch((error) => {
        console.log(error);
      });
    setSelectedDB(DBname);
    setShowViews(true);
  };
  const handleclose = () => {
    setShowViews(false);
  };

  const handleclickdata = () => {
    setShowdata(true);
  };

  const handleclosedata = () => {
    setSelectedView("");
    setValues([]);
    setFields([]);
    setShowdata(false);
  };

  const connectToDenodo = (db, index) => {
    console.log(db);
    axios
      .get("http://localhost:3000/connect-denodo/" + db + "")
      .then((response) => {
        getSampleData(index);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getSampleData = (Index) => {
    setLoadingData(true);

    //const DB = selectedDB;
    setSelectedView(data[Index]["name"]);
    axios
      .get(
        "http://localhost:3000/sample-data/" +
          data[Index]["databaseName"] +
          "/" +
          data[Index]["name"] +
          "/10"
      )
      .then((response) => {
        setFields(response.data[0]);
        setValues(response.data.slice(1, response.data.length));
        setLoadingData(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  if (localStorage.getItem("login") != "true") {
    return <Login />;
  }

  return (
    <Box>
      <AppBar position="static">
        <Container>
          <Toolbar disableGutters sx={{ justifyContent: "center" }}>
            <h1 sx={{ margin: 0 }}>Ejada</h1>
          </Toolbar>
        </Container>
      </AppBar>
      <Container maxWidth="xl">
        <Box>
          <h2>Please select category</h2>

          <DBselect
            clickedProps={(s) => handleclick(s)}
            closedata={handleclosedata}
            close={handleclose}
          />
        </Box>
      </Container>
      <Box
        sx={{
          padding: "20px",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-around",
        }}
      >
        {showViews && (
          <Box sx={{ width: "55%" }}>
            {console.log("http://localhost:3000/views/" + selectedDB + "/50/1")}
            <Views
              loadingViews={loadingViews}
              open={handleclickdata}
              samples={(index) => {
                connectToDenodo(data[index]["databaseName"], index);
              }}
              database={selectedDB}
              data={data}
              setshowmetadata={setShowmetadata}
              showmetadata={showmetadata}
            />
          </Box>
        )}

        {showdata && (
          <Box sx={{ width: "40%" }}>
            <Data
              loadingData={loadingData}
              DB={selectedDB}
              view={selectedView}
              fields={fields}
              values={values}
              close={handleclosedata}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
}
export default ResponsiveAppBar;
