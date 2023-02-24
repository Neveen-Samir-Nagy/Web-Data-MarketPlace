import { useState, useEffect } from "react";
import axios from "axios";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { Alert, Box, Button, Snackbar } from "@mui/material";
import Slide from "@mui/material/Slide";

export default function MultipleSelect(props) {
  const [namedone, setNamedone] = useState(null);
  const [DBs, setDBs] = useState([]);
  const [sync, setSync] = useState(false);

  const getDatabases = () => {
    console.log("DBs");
    axios
      .get("http://localhost:3000/databases")
      .then((response) => {
        setDBs(
          response.data.map(function (el) {
            return el.name;
          })
        );
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const connectToDenodo = (db) => {
    console.log(db);
    axios
      .get("http://localhost:3000/connect-denodo/" + db + "")
      .then((response) => {})
      .catch((error) => {
        console.log(error);
      });
  };

  const synchronize = () => {
    console.log("sync");
    axios
      .get("http://localhost:3000/sync")
      .then((response) => {
        setSync(true);
        getDatabases();
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  useEffect(() => {
    synchronize();
  }, []);

  const handlechange = (e) => {
    setNamedone(e.target.value);
    connectToDenodo("admin");
  };

  const handleclose = () => {
    setNamedone(null);
    props.close();
    props.closedata();
  };
  return (
    <div>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Box>
          <Snackbar
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
            onClose={() => {
              setSync(false);
            }}
            open={sync}
            TransitionComponent={Slide}
          >
            <Alert severity="success">synchronized</Alert>
          </Snackbar>

          <FormControl sx={{ m: 1, width: 300 }}>
            <InputLabel>Select</InputLabel>
            <Select
              disabled={DBs.length === 0}
              value={namedone}
              onChange={(e) => {
                handlechange(e);
              }}
              input={<OutlinedInput label="Name" />}
            >
              {DBs.map((name) => (
                <MenuItem key={name} value={name}>
                  {name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Box sx={{ marginLeft: "20px" }}>
          <Button
            disabled={!namedone}
            onClick={() => props.clickedProps(namedone)}
          >
            Select
          </Button>
        </Box>
        <Box sx={{ marginLeft: "20px" }}>
          <Button disabled={!namedone} onClick={handleclose}>
            close
          </Button>
        </Box>
      </Box>
    </div>
  );
}
