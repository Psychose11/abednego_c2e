
import React from 'react';
import PrimarySearchAppBar from '../AppBar';
import VerticalMenu from '../NavBar';
import EnhancedTable from './dataCustomers';
import Grid from '@mui/material/Grid';



const Client = () => (
  <>
    <PrimarySearchAppBar />
    <Grid container spacing={2}>
      <Grid item xs={12} sm={3} md={2} style={{paddingTop:"20px"}}>
        <VerticalMenu />
      </Grid>
      <Grid item xs={12} sm={9} md={10} container justifyContent="center" style={{ paddingTop: '50px', paddingLeft: '20px', paddingRight: '20px' }}>
        <EnhancedTable />
      </Grid>
    </Grid>
  </>
);

export default Client;