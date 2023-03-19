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

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import axios from 'axios';
import secureLocalStorage from "react-secure-storage";

import { Chip } from '@mui/material';
import Navbar from "./Navbar";

const Row = ({ request }) => {
    return (
        <TableBody sx={{ width: '100%' }}>
            <TableRow key={request.id} >
                <TableCell align="center" sx={{ borderBottom: 'none' }} component="th" scope="row">
                    <div style={{ border: '1px solid rgba(0,0,0,0.21)', backgroundColor: request.status === 'UNDERAPPROVAL' ? 'rgba(0, 0, 0, 0.08)' : request.status === 'IN PROGRESS' ? '#1976d2' : request.status === 'REJECT' ? '#d32f2f' : '#2e7d32', width: '20px', height: '20px', borderRadius: '50%' }}>

                    </div>
                </TableCell>
                <TableCell align="center" sx={{ borderBottom: 'none' }} component="th" scope="row">
                    {request.ws}
                </TableCell>
                <TableCell align="center" sx={{ borderBottom: 'none' }}>
                    <Chip label={request.status} sx={{
                        width: '40%', '.css-1j447d8-MuiChip-root': {
                            justifyContent: 'space-between'
                        }
                    }}
                        color={request.status == 'UNDERAPPROVAL' ? 'default' : request.status === 'IN PROGRESS' ? 'primary' : request.status === 'REJECT' ? 'error' : 'success'} size='small' variant="filled" /></TableCell>
                <TableCell align="center" sx={{ borderBottom: 'none' }}>{request.creation_date}</TableCell>


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

export default function UserRequests() {
    const [request, setRequest] = useState()
    const [open, setOpen] = React.useState('');
    const [newStatus, setNewStatus] = React.useState(false);

    useEffect(() => {

        axios.get(
            `http://localhost:3000/user-requests/${secureLocalStorage.getItem('user')}`
        )
            .then((response) => {
                setRequest(response.data)

            })


    }, [])

    return (
        <Navbar>
            <TableContainer>
                <Table aria-label="collapsible table">
                    <TableHead  >
                        <TableRow >
                            <TableCell sx={{ fontWeight: '600' }} align="center"></TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }} align="center">Request ID</TableCell>

                            <TableCell sx={{ fontWeight: 'bold' }} align="center">Product Name </TableCell>
                            <TableCell sx={{ fontWeight: '600' }} align="center">creation date</TableCell>
                            <TableCell sx={{ fontWeight: '600' }} align="center">status</TableCell>

                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {request && request.map((key, index) => (
                  key.status==='IN CART'?null:
                  <>
                  <TableRow >
                      <TableCell align="center" component="th" scope="row">
                          <div style={{ border: '1px solid rgba(0,0,0,0.21)', backgroundColor: key.status === 'UNDERAPPROVAL' ? 'rgba(0, 0, 0, 0.08)' : key.status === 'IN PROGRESS' ? '#1976d2' : key.status === 'REJECT' ? '#d32f2f' : '#2e7d32', width: '20px', height: '20px', borderRadius: '50%' }}>

                          </div>
                      </TableCell>
                      <TableCell align="center" component="th" scope="row">
                          {key.id}
                      </TableCell>

                      <TableCell align="center" component="th" scope="row">
                          {key.ws}
                      </TableCell>
                      <TableCell align="center" component="th" scope="row">
                          {key.creation_date}
                      </TableCell>

                      <TableCell align="center" >
                          <Chip label={key.status} sx={{
                              width: '50%', '.css-1j447d8-MuiChip-root': {
                                  justifyContent: 'space-between'
                              }
                          }}
                              color={key.status == 'UNDERAPPROVAL' ? 'default' : key.status === 'IN PROGRESS' ? 'primary' : key.status === 'REJECT' ? 'error' : 'success'} size='small' variant="filled" />
                              </TableCell>
              </TableRow>


           

          </>

                    ))}
                </TableBody>
            </Table>
        </TableContainer>
</Navbar>
     
    );
}     