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

function createData(name, calories, fat, carbs, protein, price) {

    return {
        name,
        calories,
        fat,
        carbs,
        protein,
        price,
        history: [
            {
                date: '2020-01-05',
                customerId: '11091700',
                amount: 3,
            },
            {
                date: '2020-01-02',
                customerId: 'Anonymous',
                amount: 1,
            },
        ],
    };
}

const Row = ({ request, open , index}) => {
    console.log(request)
console.log(open);
console.log(index);

    return (
        <TableBody>
        <TableRow key={request.id}>
            <TableCell component="th" scope="row">
                {request.username}
            </TableCell>
            <TableCell align="right">{request.status}</TableCell>

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


    }, [])
    return (

        <TableContainer>
            <Table aria-label="collapsible table">
                <TableHead  >
                    <TableRow >
                        <TableCell />
                        <TableCell sx={{ fontWeight: 'bold' }}>Request </TableCell>

                    </TableRow>
                </TableHead>
                <TableBody>
                    {request && Object.keys(request).map((key, index) => (
                        <>
                            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                                <TableCell>
                                    <IconButton
                                        aria-label="expand row"
                                        size="small"
                                        onClick={() => setOpen(open===index? null : index)}
                                    >
                                        {open===index ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                                    </IconButton>
                                </TableCell>
                                <TableCell component="th" scope="row">
                                    {key}
                                </TableCell>
                                
                            </TableRow>
                            
                            
                            <TableRow>
                                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                                    <Collapse in={open===index} timeout="auto" unmountOnExit>
                                        <Box sx={{ margin: 1 }}>
                                
                                            <Table size="small" aria-label="purchases">
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>username</TableCell>
                                                        <TableCell align="right">status</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                {
                                request[key].map((requestItem) => {
                                    return (
                                     <Row request={requestItem} open={open} index={index} />
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