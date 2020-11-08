import React, { useState, useEffect } from 'react';

import PropTypes from 'prop-types';
import { makeStyles, unstable_createMuiStrictModeTheme } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
// import Collapse from '@material-ui/core/Collapse';
// import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
// import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
// import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
// import Checkbox from '@material-ui/core/Checkbox';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import apiService from "./mockApiService";

export default function Organizations() {
  const [organizationData, setOrganizationData] = useState([]);
  const [orgType, setOrgType] = useState('');
  const [orgStage, setOrgStage] = useState('');
  const [initialLoad, setInitialLoad] = useState(true);
  const handleOrgTypeChange = (event) => {
    setOrgType(event.target.value);
  };
  const handleOrgStageChange = (event) => {
    setOrgStage(event.target.value);
  };

  function searchOrganizations() {
    apiService.getRequest("organizations?type="+orgType+"&stage="+orgStage).then((organizationsResponse) => {
      setOrganizationData(organizationsResponse)
    });
  }

  /*Table logic */
  const useRowStyles = makeStyles({
    root: {
      '& > *': {
      borderBottom: 'unset',
      }
    }
  });

  const classes = useRowStyles();

  function Row(props) {
    const { row } = props;
    //const [open, setOpen] = useState(false);
    
    return (
      <React.Fragment>
        <TableRow className={classes.root}>
          <TableCell>
            {/* <IconButton aria-label="expand row" size="small" onClick={() => row.open = !row.open }>
              {row.open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton> */}
          </TableCell>
          <TableCell component="th" scope="row">
            {row.name}
          </TableCell>
          <TableCell align="right">{row.phone}</TableCell>
          <TableCell align="right">{row.email}</TableCell>
          <TableCell align="right">{row.businessStage}</TableCell>
          <TableCell align="right">{row.businessType}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            {/* <Collapse in={row.open} timeout="auto" unmountOnExit> */}
              <Box margin={1}>
                <Typography variant="h6" gutterBottom component="div">
                  Descripción
                </Typography>
                <Table size="small" aria-label="purchases">
                  {/* <TableHead>
                    <TableRow>
                      <TableCell>Descripción</TableCell>
                    </TableRow>
                  </TableHead> */}
                  <TableBody>
                    {row.moreInfo.map((historyRow) => (
                      <TableRow key={historyRow.description}>
                        <TableCell component="th" scope="row">
                          {historyRow.description}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            {/* </Collapse> */}
          </TableCell>
        </TableRow>
      </React.Fragment>
    );
  }

  Row.propTypes = {
    row: PropTypes.shape({
      phone: PropTypes.number.isRequired,
      email: PropTypes.number.isRequired,
      businessStage: PropTypes.number.isRequired,
      moreInfo: PropTypes.arrayOf(
      PropTypes.shape({
        amount: PropTypes.number.isRequired,
        customerId: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
      }),
      ).isRequired,
      name: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      businessType: PropTypes.number.isRequired,
    }).isRequired,
  };
      
  useEffect(()=>{
    searchOrganizations();
  },[initialLoad])

  return (
    <div style={{'padding-top': '50px'}}>
      <h2>Organizaciones</h2>
      <TableContainer component={Paper}>
        <div>
          <FormControl className={classes.formControl} style={{'margin':'15px'}}>
            <InputLabel>Tipo</InputLabel>
            <Select
              style={{'width':'150px'}}
              value={orgType}
              onChange={handleOrgTypeChange}>
              <MenuItem value=''>Todos</MenuItem>
              <MenuItem value='Microempresa'>Microempresa</MenuItem>
              <MenuItem value='Comerciante'>Comerciante</MenuItem>
              <MenuItem value='Empresa Basada en Innovación'>Empresa Basada en Innovación</MenuItem>
              <MenuItem value='Empresa en Crecimiento'>Empresa en Crecimiento</MenuItem>
              <MenuItem value='Acceso a Capital'>Acceso a Capital</MenuItem>
            </Select>
          </FormControl>
          <FormControl className={classes.formControl} style={{'margin':'15px'}}>
            <InputLabel>Etapa</InputLabel>
            <Select
              style={{'width':'150px'}}
              value={orgStage}
              onChange={handleOrgStageChange}>
              <MenuItem value=''>Todos</MenuItem>
              <MenuItem value='Idea'>Idea</MenuItem>
              <MenuItem value='Prototipo'>Prototipo</MenuItem>
              <MenuItem value='Expansión'>Expansión</MenuItem>
              <MenuItem value='Lanzamiento'>Lanzamiento</MenuItem>
            </Select>
          </FormControl>
          <Button style={{'margin':'15px'}} variant="contained" color="primary" onClick={()=>{ searchOrganizations(); }}>
            Filter
          </Button>
        </div>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Nombre</TableCell>
              <TableCell align="right">Teléfono</TableCell>
              <TableCell align="right">Correo Electrónico&nbsp;</TableCell>
              <TableCell align="right">Etapa&nbsp;</TableCell>
              <TableCell align="right">Tipo&nbsp;</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {organizationData.map((organization) => ( <Row key={organization.name} row={organization} /> ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}