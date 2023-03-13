import {
  Avatar,
  Button,
  InputAdornment,
  InputLabel,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useEffect, useState } from "react";
import KeyIcon from "@mui/icons-material/Key";
import secureLocalStorage from "react-secure-storage";
import CircularProgress from "@mui/material/CircularProgress";

function LOGIN() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [failed, setfailed] = useState(false);
  const [Load, setLoad] = useState(false);

  useEffect(() => {
    axios.get("http://localhost:3000/sync")
      .then((response) => { console.log(response.data) })
      .catch((error) => { console.log(error); });
  }, []);

  const handleclick = (e) => {
    e.preventDefault();
    setLoad(true);
    if (username === 'sysadmin' && password === 'admin') {
      setLoad(false)
      secureLocalStorage.setItem("admin", 'yes')
      secureLocalStorage.setItem("user", 'sysadmin')
      secureLocalStorage.setItem("login", true)
      window.location.replace("/admin")
      console.log('in sysadmin')
    } else {
    axios
      .get(
        "http://localhost:3000/connect-denodo/" +
        username +
        "/" +
        password +
        "/admin"
      )
      .then((response) => {
        secureLocalStorage.setItem("login", response.data);

        if (response.data) {
          axios.get("http://localhost:3000/connect-denodo/admin/admin/admin");
        }
        setfailed(false);
      })
      .then(() =>
        secureLocalStorage.getItem("login") === true
          ? (secureLocalStorage.setItem("user", username),
            window.location.replace("/products"),
            setLoad(false))
          : (setfailed(true), setLoad(false))
      )
      .catch((error) => {
        console.log(error);
        setLoad(false);
      });
    }
  };
  const handleGuestLogin = (e) => {
    e.preventDefault();
    setLoad(true);
    
      axios.get("http://localhost:3000/connect-denodo/admin/admin/admin")
        .then((response) => {
          secureLocalStorage.setItem("login", response.data);
          secureLocalStorage.setItem("user", 'admin');
          secureLocalStorage.setItem("Guest", 'yes');
          window.location.replace("/home")
        })
        .then(() => { setLoad(false) })
        .catch((error) => { console.log(error); setLoad(false); });
    
  }
  return (
    <Box
      sx={{
        textAlign: "center",
        background:
          "linear-gradient(103deg, rgba(42,208,228,1) 0%, rgba(42,167,228,1) 34%, rgba(23,77,142,1) 84%, rgba(29,49,131,1) 100%)",
        height: "100vh",
        position: "relative",
      }}
    >
      <Box
        display="flex"
        flexDirection="column"
        alignItems="flex-start"
        sx={{
          position: "absolute",
          transform: "translate(-50%,-50%)",
          top: "15%",
          right: "31%",
        }}
        justifyContent="space-between"
      >
        <h1
          style={{
            color: "#fff",
            marginBottom: "0",
          }}
        >
          <span style={{ fontWeight: '700', color: 'rgb(43 43 43)' }}>
            Data {''}</span>
          <span style={{ fontWeight: '300' }}>
            MarketPlace</span>{" "}
        </h1>

      </Box>
      <Box
        sx={{
          left: "50%",
          top: "25%",
          transform: "translate(-50%,0)",
          padding: "30px 40px 0 40px",
          height: "50%",
          background: "#fff",
          borderRadius: "10px",
          position: "absolute",
          boxShadow:
            " 0px 0px 10px 2px rgb(82 73 73)",
        }}
      >
        <h2 style={{ margin: '0', color: '#828282' }}>
          Login
        </h2>
        <form
          style={{
            height: "100%",
            color: "#2e2524",
          }}
          onSubmit={handleclick}
        >

          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            style={{ height: "92%" }}
            justifyContent="space-evenly"
          >
            <Box
              display="flex"
              flexDirection="column"
              alignItems="flex-start"

              justifyContent="space-between"
            >
              <TextField
                fullWidth
                variant="outlined"
                id="outlined-basic"
                label="Username"
                onChange={(e) => {
                  setUsername(e.target.value);
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="start">

                      <Avatar
                        sx={{
                          background: "transparent",
                          color: "#2e2524",
                          width: "fit-content",
                        }}
                      />
                    </InputAdornment>
                  ),
                }}
                type="text"
                sx={{
                  background: "#fff",

                }}
              /></Box>
            <Box
              display="flex"
              flexDirection="column"
              alignItems="flex-start"


              justifyContent="space-between"
            >

              <TextField
                fullWidth
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                variant="outlined"
                id="outlined-basic"
                label="Password"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="start">
                      <KeyIcon
                        sx={{
                          background: "transparent",
                        }}
                      />
                    </InputAdornment>
                  ),
                }}
                type="password"
                sx={{
                  background: "#fff",

                }}
              />
            </Box>


            <Box
              sx={{
                display: "flex",
                width: "100%",
                justifyContent: "space-evenly",
                alignItems: "center",
              }}
            >
              <Button
                variant="contained"
                sx={{
                  boxShadow: "11px 6px -2px #04C",
                  color: "#fff",
                }}
                type="submit"
                disabled={Load}
              >
                {Load ? "logging in..." : "Login"}
              </Button>
              <Button
                onClick={handleGuestLogin}
                variant="contained"
                sx={{
                  boxShadow: "11px 6px -2px #04C",
                  color: "#fff",
                }}
                disabled={Load}
              >
                Guest
              </Button>
            </Box>

            {failed && (
              <div
                style={{
                  padding: "5px 10px",
                  background: "#ff000075",
                  color: "#2d2d2d",
                }}
              >
                <p style={{ margin: 0 }}>Invalid username or password</p>
              </div>
            )}
          </Box>
        </form>
      </Box>
    </Box>
  );
}

export default LOGIN;
