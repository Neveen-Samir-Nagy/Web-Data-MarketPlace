import * as React from "react";

import Button from "@mui/material/Button";

import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Dialog from "@mui/material/Dialog";

import axios from "axios";
import { fontWeight } from "@mui/system";


function Remote(props) {
  const { onClose, value: valueProp, open, ...other } = props;
  const [URL, setURL] = React.useState("");
  const [Load, setLoad] = React.useState(false);

  return (
    <Dialog
      sx={{ "& .MuiDialog-paper": { width: "100%", maxHeight: 500 } }}
      maxWidth="sm"
      open={props.open}
      {...other}
    >
      <DialogTitle>connection Details</DialogTitle>
      <DialogContent>
        <span style={{ fontWeight: "bold" }}>Server: </span>
        {props.ipDenodo}
      </DialogContent>
      <DialogContent>
      <span style={{ fontWeight: "bold" }}>Port: </span>
        {props.port}
      </DialogContent>
      <DialogContent>
      <span style={{ fontWeight: "bold" }}>Database: </span>
        {props.DB}
      </DialogContent>
      <DialogContent>
      <span style={{ fontWeight: "bold" }}>Link: </span>
        {props.context}
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={props.close}>
          Cancel
        </Button>
        {props.wsType=='REST' ?        <Button href={`http://localhost:9090/swagger-ui/index.html?url=http://localhost:9090${props.context}/OpenAPIv3/openapi.json`} target='_blank'> {Load ? 'Redirecting...' :  "More APIs Details" }</Button>
:null}
      </DialogActions>

    </Dialog>
  );
}
export default Remote;
