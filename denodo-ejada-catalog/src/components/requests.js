import * as React from 'react';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import axios from 'axios';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import CancelIcon from '@mui/icons-material/Cancel';
import { Chip } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';

const Row = ({ request,wsname, index, unique,handleNewStatus }) => {

    const [isHovering, setIsHovering] = React.useState('');
    const [isHoveringClose, setIsHoveringClose] = React.useState('');

    const handleMouseOver = (key) => {
        setIsHovering(key);
    };

    const handleMouseOut = () => {
        setIsHovering('');
    };

    const handleMouseOverClose = (key) => {
        setIsHoveringClose(key);
    };

    const handleMouseOutClose = () => {
        setIsHoveringClose('');
    };
    const approve =(item)=>{
        axios.get(`http://localhost:3000/update-user-requests/${item.username}/${wsname}/APPROVED`)
        .then((response)=>(console.log(response.data))).then(
            ()=>{
                handleNewStatus()            }
        ).then(()=>(        setIsHoveringClose('')        ))
    }
    const reject = (item) =>{
        axios.get(`http://localhost:3000/update-user-requests/${item.username}/${wsname}/REJECT`)
        .then((response)=>(console.log(response.data))).then(
            ()=>{
                handleNewStatus()            }
                ).then(()=>(        setIsHoveringClose('')        ))

   }
        return (
        <TableBody sx={{ width: '100%' }}>
            <TableRow key={request.id} >
                <TableCell align="center" sx={{ borderBottom: 'none' }} component="th" scope="row">
                    <div style={{ border: '1px solid rgba(0,0,0,0.21)', backgroundColor: request.status === 'UNDERAPPROVAL' ? 'rgba(0, 0, 0, 0.08)' : request.status === 'IN PROGRESS' ? '#1976d2' : request.status === 'REJECT' ? '#d32f2f' : '#2e7d32', width: '20px', height: '20px', borderRadius: '50%' }}>

                    </div>
                </TableCell>
                <TableCell align="center" sx={{ borderBottom: 'none' }} component="th" scope="row">
                    {request.id}
                </TableCell>
                <TableCell align="center" sx={{ borderBottom: 'none' }} component="th" scope="row">
                    {request.username}
                </TableCell>
                <TableCell align="center" sx={{ borderBottom: 'none' }}>
                    <Chip label={request.status} sx={{
                        width: '50%', '.css-1j447d8-MuiChip-root': {
                            justifyContent: 'space-between'
                        }
                    }}
                        color={request.status == 'UNDERAPPROVAL' ? 'default' : request.status === 'IN PROGRESS' ? 'primary' : request.status === 'REJECT' ? 'error' : 'success'} size='small' variant="filled" /></TableCell>
                <TableCell align="center" sx={{ borderBottom: 'none' }}>{request.creation_date}</TableCell>
                <Tooltip title="Reject" arrow>
                    <IconButton
                        disabled={request.status === 'UNDERAPPROVAL'||request.status === 'REJECT'}
                        label='agree'
                        sx={{
                            color: 'rgba(0,0,0,0.8)',

                            ':hover': {
                                backgroundColor: 'rgba(0, 0, 0, 0)'

                            }
                        }}
                        onMouseOver={() => handleMouseOverClose(index)}
                        onMouseOut={handleMouseOutClose}
                        onClick={()=>reject(request)}
                    >
                        {isHoveringClose === index ? <CancelIcon /> : <CancelOutlinedIcon />}</IconButton>
                </Tooltip>
                <Tooltip title="Accept" arrow>
                    <IconButton

                        disabled={request.status === 'UNDERAPPROVAL'||request.status === 'APPROVED'}
                        sx={{
                            color: 'rgba(0,0,0,0.8)',
                            ':hover': {
                                backgroundColor: 'rgba(0, 0, 0, 0)'

                            }
                        }} onMouseOver={() => handleMouseOver(index)}
                        onMouseOut={handleMouseOut}
                        onClick={()=>approve(request)}
                        >

                        {isHovering === index ? <CheckCircleIcon /> : <CheckCircleOutlineOutlinedIcon />}
                    </IconButton>


                </Tooltip>


            </TableRow>

        </TableBody>);
}

Row.propTypes = {
    row: PropTypes.shape({
        calories: PropTypes.number.isRequired,
        carbs: PropTypes.number.isRequired,
        fat: PropTypes.number.isRequired,
        history: PropTypes.arrayOf(
            PropTypes.shape({
                amount: PropTypes.number.isRequired,
                customerId: PropTypes.string.isRequired,
                date: PropTypes.string.isRequired,
            }),
        ).isRequired,
        name: PropTypes.string.isRequired,
        price: PropTypes.number.isRequired,
        protein: PropTypes.number.isRequired,
    }).isRequired,
};

export default function CollapsibleTable() {
    const [request, setRequest] = useState()
    const [open, setOpen] = React.useState('');
    const [newStatus, setNewStatus] = React.useState(false);

    useEffect(() => {

        axios.get(
            `http://localhost:3000/all-requests`
        )
            .then((response) => {

                var nreq = response.data.reduce(
                    (requests, curRequest) => {
                        var reqs = (requests[curRequest.ws] || []);
                        reqs.push(curRequest);
                        requests[curRequest.ws] = reqs;
                        return requests;
                    }, {}
                )

                setRequest(nreq);
            })


    }, [newStatus])
    const handleNewStatus=()=>{
        setNewStatus(!newStatus)
    }
    return (

        <TableContainer>
            <Table aria-label="collapsible table">
                <TableHead  >
                    <TableRow >

                        <TableCell sx={{ fontWeight: 'bold' }}>Product Name </TableCell>
                        <TableCell />

                    </TableRow>
                </TableHead>
                <TableBody>
                    {request && Object.keys(request).map((key, index) => (
                        <>
                            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                              
                              
                                <TableCell component="th" scope="row">
                                    {key}
                                </TableCell>
                                <TableCell align='right'>
                                    <IconButton
                                        aria-label="expand row"
                                        size="small"
                                        onClick={() => setOpen(open === index ? null : index)}
                                    >
                                        {open === index ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                                    </IconButton>
                                </TableCell>
                            </TableRow>


                            <TableRow>
                                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                                    <Collapse in={open === index} timeout="auto" unmountOnExit>
                                        <Box sx={{ margin: 1 }}>

                                            <Table size="small" aria-label="purchases">
                                                <TableHead>
                                                    <TableRow >
                                                        <TableCell sx={{ fontWeight: '600' }} align="center"></TableCell>
                                                        <TableCell sx={{ fontWeight: '600' }} align="center">Request ID</TableCell>
                                                        <TableCell sx={{ fontWeight: '600' }} align="center">creation date</TableCell>
                                                        <TableCell sx={{ fontWeight: '600' }} align="center">status</TableCell>
                                                        <TableCell sx={{ fontWeight: '600' }} align="center">username</TableCell>
                                                        <TableCell sx={{ fontWeight: '600' }} align="center"></TableCell>

                                                    </TableRow>
                                                </TableHead>
                                                {
                                                    request[key].map((requestItem, id) => {
                                                        return (
                                                            <Row request={requestItem} handleNewStatus={handleNewStatus} wsname={key} unique={id} index={index} />
                                                        )
                                                    })


                                                }
                                            </Table>
                                        </Box>
                                    </Collapse>
                                </TableCell>
                            </TableRow>
                        </>

                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}     