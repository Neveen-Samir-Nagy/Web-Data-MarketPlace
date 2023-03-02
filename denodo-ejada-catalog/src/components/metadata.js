
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
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import Navbar from "./Navbar";
import { Box } from "@mui/system";
import { Button, Container, Divider } from "@mui/material";
import axios from "axios";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";

import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import ListItemText from '@mui/material/ListItemText';
import ListItem from '@mui/material/ListItem';
import List from '@mui/material/List';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import { useEffect, useState } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import DoneIcon from '@mui/icons-material/Done';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
function Metadata(props) {

    const [Found, setFound] = useState(true);
    var [fields, setFields] = useState([]);
    var [values, setValues] = useState([]);
    const [openSampleData, setOpenSampleData] = React.useState(false);


    const handleClose = () => {
        props.setOpen(false);
        setOpenSampleData(!openSampleData);
    };

    const handlechangeSampleData = () => {
        setOpenSampleData(!openSampleData);
    }

    const getMetadata = () => {
        axios
            .get(
                "http://localhost:3000/sample-data/" + props.DB + "/" + props.name + ""
            )
            .then((response) => {
                console.log(response.data);
                setFields(response.data[0]);
                setValues(response.data.slice(1, response.data.length));
            })

    };


    //       axios
    //   .get(
    //     "http://localhost:3000/sample-data/" + props.DB + '/' + props.name
    //   )
    //   .then((response) => {
    //     setFields(response.data[0]);
    //     setValues(response.data.slice(1, response.data.length));
    //     setLoadingData(false);
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });


    return (

        <div>
            <Dialog
                fullScreen
                open={props.open}
                onClose={handleClose}
            >
                <AppBar sx={{ position: 'relative' }}>
                    <Toolbar>
                        <Typography sx={{ flex: 1 }} variant="h6" component="div">
                            Metadata {props.name}
                        </Typography>
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={handleClose}
                            aria-label="close"
                        >
                            <CloseIcon />
                        </IconButton>
                    </Toolbar>
                </AppBar>
                {props.loadingData ? <Table size="small" aria-label="purchases">
                    <TableHead>
                        <TableRow >
                            <TableCell style={{ fontWeight: "bold" }}>Category</TableCell>
                            <TableCell style={{ fontWeight: "bold" }}>Tag</TableCell>
                            <TableCell style={{ fontWeight: "bold" }}>Schema</TableCell>
                            <TableCell style={{ fontWeight: "bold" }}>Type</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {(
                            <TableRow>
                                <TableCell
                                    component="th"
                                    scope="row"
                                >
                                    {props.viewsCategories &&
                                        props.viewsCategories.map((value) => (
                                            <TableRow>
                                                <TableCell
                                                    component="th"
                                                    scope="row"
                                                >
                                                    <span style={{ display: "block" }}>
                                                        {value}
                                                    </span>
                                                </TableCell>
                                                <TableCell
                                                    component="th"
                                                    scope="row"
                                                >
                                                    { }
                                                </TableCell>
                                                <TableCell component="th"
                                                    scope="row">
                                                    { }
                                                </TableCell>
                                                <TableCell align="left">
                                                    { }
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                </TableCell>
                                <TableCell
                                    component="th"
                                    scope="row"
                                >
                                    {props.viewsTags &&
                                        props.viewsTags.map((value) => (
                                            <TableRow>
                                                <TableCell
                                                >
                                                    { }
                                                </TableCell>
                                                <TableCell
                                                    component="th"
                                                    scope="row"
                                                >
                                                    <span style={{ display: "block" }}>
                                                        {value}
                                                    </span>
                                                </TableCell>
                                                <TableCell >
                                                    { }
                                                </TableCell>
                                                <TableCell align="left">
                                                    { }
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                </TableCell>
                                {props.viewsMetaSchema &&
                                    props.viewsMetaSchema.map((value, index) => (
                                        <TableRow>
                                            <TableCell
                                                component="th"
                                                scope="row"
                                            >
                                                { }
                                            </TableCell>
                                            <TableCell
                                                component="th"
                                                scope="row"
                                            >
                                                { }
                                            </TableCell>
                                            <TableCell >
                                                <span style={{ display: "block" }}>
                                                    {index == 0 ? <TableRow >
                                                        <TableCell style={{ fontWeight: "bold" }}>Name</TableCell>
                                                        <TableCell style={{ fontWeight: "bold" }}>Name</TableCell>
                                                        <TableCell style={{ fontWeight: "bold" }}>Input</TableCell>
                                                        <TableCell style={{ fontWeight: "bold" }}>Output</TableCell>
                                                    </TableRow> : <TableRow> <TableCell >
                                                        {value[0]}
                                                    </TableCell>
                                                    <TableCell >
                                                        {value[1]}
                                                    </TableCell>
                                                        <TableCell >
                                                            {value[2] == 'true' ? <DoneIcon /> : <ClearOutlinedIcon />}
                                                        </TableCell>
                                                        <TableCell >
                                                            {value[3] == 'true' ? <DoneIcon /> : <ClearOutlinedIcon />}
                                                        </TableCell>
                                                    </TableRow>

                                                    }
                                                </span>
                                            </TableCell>
                                            <TableCell align="left">
                                                { }
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                <TableCell align="left">
                                    {props.wsType}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table> : <></>}

                <AppBar sx={{ position: 'relative' }}>
                    <Toolbar>

                        <Typography sx={{ flex: 1 }} variant="h6" component="div">
                            Sample Data
                        </Typography>
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={
                                openSampleData
                                    ? () => {
                                        handlechangeSampleData();
                                    }
                                    : !openSampleData
                                        ? () => {
                                            handlechangeSampleData();
                                            getMetadata();
                                        }
                                        : () => { }
                            }
                            aria-label="expand row"
                            size="small"
                        // onClick={
                        //   props.showmetadata[index]
                        //     ? () => {
                        //       changeMetadata(index);
                        //     }
                        //     : !props.showmetadata.includes(true)
                        //       ? () => {
                        //         changeMetadata(index);
                        //         getMetadata(index);
                        //       }
                        //       : () => { }
                        // }
                        >
                            {openSampleData ? (
                                <KeyboardArrowUpIcon />
                            ) : (
                                <KeyboardArrowDownIcon />
                            )}
                        </IconButton>

                    </Toolbar>
                </AppBar>

                {openSampleData ?
                    <Table stickyHeader sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                {fields.map((row) => (
                                    <TableCell component="tr" style={{ fontWeight: "bold" }}>
                                        {row}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {values.map((row) => (
                                <TableRow
                                    hover
                                    sx={{
                                        "&:last-child td, &:last-child th": { border: 0 },
                                        maxHeight: 450,
                                    }}
                                >
                                    {row.map((element) => (
                                        <TableCell
                                            component="th"
                                            scope="row"

                                        >
                                            {element}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    : <></>}

            </Dialog>
        </div>
    );
}
export default Metadata;
