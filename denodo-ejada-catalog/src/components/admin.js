import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Navbar from './Navbar'
import axios from "axios";
import UsersAdmin from "./usersAdmin";
import ProductAdmin from "./productsAdmin";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3,borderBottom:'1px solid', borderLeft:'1px solid' , borderRight:'1px solid' , borderColor:'rgba(0, 0, 0, 0.12)' }}>
          <Typography >{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function Admin() {
  const [value, setValue] = React.useState(0);
  const {users, setUsers} = React.useState([]);


  const handleProducts = () => {
    axios.get(
      `http://localhost:3000/map-users-ws`
    )
      .then((response) => {
        console.log("maps", response.data);
        setUsers(response.data);
      })
  }

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Navbar>

    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Users" {...a11yProps(0)} />
          <Tab label="Products" {...a11yProps(1)} />
          <Tab label="Requests" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
       <UsersAdmin />
      </TabPanel>
      <TabPanel value={value} index={1}>
<ProductAdmin/>      </TabPanel>
      <TabPanel value={value} index={2}>
        Requests
      </TabPanel>
    </Box>
    </Navbar>

  );
}
