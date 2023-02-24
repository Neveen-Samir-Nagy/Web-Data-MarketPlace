import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Button, CircularProgress } from "@mui/material";
import { Box } from "@mui/system";

export default function BasicTable(props) {
  return (
    <Box
      component={Paper}
      sx={{
        maxHeight: 440,
        height: 440,
        boxShadow: "#727272a3 2px 2px 8px",
      }}
    >
      <Button
        onClick={props.close}
        style={{
          paddingBottom: "5px",
          position: "sticky",
          top: "0",
          zIndex: "200",
          float: "right",
        }}
      >
        x
      </Button>

      <TableContainer
        sx={{
          overflow: "scroll",
          maxHeight: 400,
          height: 400,
          position: "relative",
        }}
      >
        {props.loadingData ? (
          <Box
            sx={{
              display: "flex",
              position: "absolute",
              top: "50%",
              right: "50%",
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <Table stickyHeader sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                {props.fields.map((row) => (
                  <TableCell component="tr" style={{ fontWeight: "bold" }}>
                    {row}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {props.values.map((row) => (
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
                      style={{ fontWeight: "bold" }}
                    >
                      {element}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </TableContainer>
    </Box>
  );
}
