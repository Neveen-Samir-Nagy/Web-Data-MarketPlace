import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

import { Badge, Menu, MenuItem, Tooltip } from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import LibraryAddIcon from "@mui/icons-material/LibraryAdd";
import StorageIcon from "@mui/icons-material/Storage";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Link } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";
import Login from "./login";
import ViewStreamIcon from "@mui/icons-material/ViewStream";
import axios from "axios";
const drawerWidth = 300;

const openedMixin = (theme) => ({
  width: drawerWidth,

  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),

  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",

  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  backgroundColor: "#3c8dbc",

  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,

  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

export default function MiniDrawer(props) {
  const { children } = props;
  const [cartLength, setCartLength] = React.useState("");

  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  if (secureLocalStorage.getItem("login") !== true) {
    window.location.replace("/");
  }

  React.useEffect(() => {
    secureLocalStorage.removeItem("cartLength")
    axios
      .get(
        `http://localhost:3000/request-withStatus/${secureLocalStorage.getItem(
          "user"
        )}/IN CART`
      )
      .then((res) => (secureLocalStorage.setItem('cartLength',res.data.length)))
      .then(()=>(setCartLength(secureLocalStorage.getItem("cartLength"))))
      .catch((error) => {
        console.log(error);
      });
    console.log(cartLength);
  }, [props.useEffect]);
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      <AppBar position="fixed" open={open}>
        <Toolbar
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {secureLocalStorage.getItem("user") === "admin" ||
            secureLocalStorage.getItem("admin") === "yes" ||
            secureLocalStorage.getItem("manager") === "yes" ? null : (
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                onClick={handleDrawerOpen}
                aria-label="open drawer"
                sx={{ ...(open && { display: "none" }) }}
              >
                <MenuIcon />
              </IconButton>
            )}
            <Typography
              variant="h6"
              component={
                secureLocalStorage.getItem("user") === "admin" ||
                secureLocalStorage.getItem("admin") === "yes" ||
                secureLocalStorage.getItem("manager") === "yes"
                  ? null
                  : Link
              }
              to={
                secureLocalStorage.getItem("user") === "admin" ||
                secureLocalStorage.getItem("admin") === "yes" ||
                secureLocalStorage.getItem("manager") === "yes"
                  ? null
                  : "/products"
              }
              noWrap
              sx={{
                padding: 0,
                color: "#fff",
                textDecoration: "none",
                cursor:
                  secureLocalStorage.getItem("user") === "admin" ||
                  secureLocalStorage.getItem("admin") === "yes" ||
                  secureLocalStorage.getItem("manager") === "yes"
                    ? "context-menu"
                    : "pointer",
                ml: 2,
              }}
            >
              Ejada Products
            </Typography>
          </div>

          <div>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              {secureLocalStorage.getItem("Guest") === "yes" ? null : (
                <Typography sx={{ padding: "6px 12px" }}>
                  {secureLocalStorage.getItem("user")}
                </Typography>
              )}
              {secureLocalStorage.getItem("user") === "admin" ||
              secureLocalStorage.getItem("admin") === "yes" ||
              secureLocalStorage.getItem("manager") === "yes" ? null : (
                <Divider />
              )}
              <MenuItem
                onClick={() => {
                  secureLocalStorage.clear();
                  window.location.replace("/");
                }}
              >
                Logout <LogoutIcon style={{ marginLeft: "10px" }} />{" "}
              </MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
      {secureLocalStorage.getItem("user") === "admin" ||
      secureLocalStorage.getItem("admin") === "yes" ||
      secureLocalStorage.getItem("manager") === "yes" ? null : (
        <Drawer variant="permanent" open={open}>
          <DrawerHeader>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === "rtl" ? (
                <ChevronRightIcon />
              ) : (
                <ChevronLeftIcon />
              )}
            </IconButton>
          </DrawerHeader>
          <Divider />
          <List>
            {["Products", "New", "Cart", "Requests"].map((text, index) => (
              <Tooltip
                title={text}
                disableHoverListener={open ? true : false}
                placement="right"
                arrow
                PopperProps={{
                  sx: {
                    "& .MuiTooltip-tooltipArrow	": {
                      fontSize: "15px",
                    },
                  },
                }}
              >
                <ListItem
                  key={text}
                  disablePadding
                  sx={{
                    display: "block",
                    color: "#000",
                    textDecoration: "none",
                  }}
                >
                  <ListItemButton
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? "initial" : "center",
                      px: 2.5,
                    }}
                    component={Link}
                    to={"/" + text}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 3 : "auto",
                        justifyContent: "center",
                      }}
                    >
                      {index % 4 === 0 ? (
                        <StorageIcon />
                      ) : index % 4 === 1 ? (
                        <LibraryAddIcon />
                      ) : index % 4 === 2 ? (
                        <Badge
                          badgeContent={secureLocalStorage.getItem("cartLength")?secureLocalStorage.getItem("cartLength") : 0}
                          color="primary"
                          anchorOrigin={{
                            vertical: "top",
                            horizontal: "right",
                          }}
                        >
                          <ShoppingCartIcon />
                        </Badge>
                      ) : (
                        <ViewStreamIcon />
                      )}
                    </ListItemIcon>
                    <ListItemText
                      primary={text}
                      sx={{ opacity: open ? 1 : 0 }}
                    />
                  </ListItemButton>
                </ListItem>
              </Tooltip>
            ))}
          </List>
        </Drawer>
      )}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        <main>{children}</main>
      </Box>
    </Box>
  );
}
