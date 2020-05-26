import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Card';
import './table.css';
import Axios from 'axios';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Skeleton from '@material-ui/lab/Skeleton';


let lastupdatedtime;
const StyledTableCell = withStyles((theme) => ({
    head: {
      backgroundColor: '#636363',
      color: theme.palette.common.white,
    },
    body: {
      fontSize: 14,
    },
  }))(TableCell);
  
  const StyledTableRow = withStyles((theme) => ({
    root: {
      '&:nth-of-type(odd)': {
        backgroundColor: 'white',
        border:'none',
      },
      '&:nth-of-type(even)': {
        backgroundColor: 'white',
        border:'none',
      },
    },
  }))(TableRow);
class StateTable extends React.Component{
    constructor(props) {
        super(props);
    this.state={
      tableHeader : [],
      tableData : [],
      lastupdatedtime:0
    }
  }
 
  componentDidMount(){
    Axios.get('https://script.google.com/macros/s/AKfycbxSoELl1el6cJHtsdNcldXYgh4Tn69ofoVyNSfKGj9n2ar5YV4/exec').then(response=>{
      this.setState({
        tableHeader : Object.keys(response.data[0]),
        tableData: response.data
      })

      
    }).catch(error=>{
      //we can update state to an error to show meaningful message on screen
   });
  }
  render(){
 
  return (this.state.tableHeader.length > 0 && this.state.tableData.length > 0) ?<Paper style={{
        width: '100%',
        overflowX: 'auto',
      }}>
      <Table  size="small" padding='checkbox' aria-label="a dense table">
        {lastupdatedtime && <caption>Last updated : {lastupdatedtime}</caption>}
        <TableHead > 
          <TableRow>
            {this.state.tableHeader.map(v => (v!= 'statecode' && v != 'lastupdatedtime') && <StyledTableCell  style={{fontWeight:"600"}}>{v}</StyledTableCell>)}
          </TableRow>
        </TableHead>
        <TableBody>
          {this.state.tableData.map((row) => 
            row.statecode != 'TT' && <StyledTableRow key={row.id}>
              {Object.values(row).map(u => {
                  if(row['lastupdatedtime'] == u ){
                    lastupdatedtime = u;
                  }
                  return (row['statecode'] != u && row['lastupdatedtime'] != u) && <TableCell component="th" scope="row">
                {u}
              </TableCell>
            })}
            </StyledTableRow>
          )}
        </TableBody>
      </Table>
    </Paper>:
<Skeleton animation="wave"  height='100%'/>
  }
}

export default StateTable;
