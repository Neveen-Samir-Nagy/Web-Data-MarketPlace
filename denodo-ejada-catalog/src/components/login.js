import { Avatar, Button, InputAdornment, TextField } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useState } from "react";
import KeyIcon from "@mui/icons-material/Key";
function LOGIN() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [failed, setfailed] = useState(false);
  const handleclick = (e) => {
    e.preventDefault();
    axios
      .get(
        "http://localhost:3000/connect-denodo/" + username + "/" + password + "/admin"
      )
      .then((response) => {
        localStorage.setItem("login", response.data);
        if (response.data) {
          axios
            .get(
              "http://localhost:3000/connect-denodo/admin/admin/admin"
            )
        }
        setfailed(false);
      })
      .then(() =>
        localStorage.getItem("login") === "true"
          ? (localStorage.setItem("user", username),
            window.location.replace("/products"))
          : setfailed(true)

      )
      .catch((error) => {
        console.log(error);
      });
  };
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
        sx={{
          left: "50%",
          transform: "translate(-50%,50%)",
          padding: "0 30px 0 30px",
          height: "50%",
          borderRadius: "10px",
          position: "absolute",
        }}
      >
        <Avatar
          sx={{
            margin: "auto",
            background: "#d8c1ae",
            width: "60px",
            height: "60px",
          }}
        />

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
            <TextField
              fullWidth
              onChange={(e) => {
                setUsername(e.target.value);
              }}
              InputProps={{
                startAdornment: (
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
                background: "#d8c1ae",
                borderRadius: 0,
                ".css-9ddj71-MuiInputBase-root-MuiOutlinedInput-root": {
                  borderRadius: 0,
                },
              }}
            />
            <TextField
              fullWidth
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              InputProps={{
                startAdornment: (
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
                background: "#d8c1ae",
                borderRadius: 0,
                ".css-9ddj71-MuiInputBase-root-MuiOutlinedInput-root": {
                  borderRadius: 0,
                },
              }}
            />

            <Button
              variant="contained"
              sx={{
                background: "#d8c1ae",
                boxShadow: "11px 6px -2px #04C",
                color: "#2e2524",
              }}
              type="submit"
            >
              Login
            </Button>

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
