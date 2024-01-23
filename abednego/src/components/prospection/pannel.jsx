import React from 'react';
import PrimarySearchAppBar from '../AppBarPros';
import Information from './information';
import Grid from '@mui/material/Grid';




const Dashboard = () => (
  <>
    <PrimarySearchAppBar />
    <Grid container spacing={2}>
      <Grid item container justifyContent="center" style={{ paddingTop: '50px', paddingLeft: '20px', paddingRight: '20px' }}>
      <Information />
      </Grid>
    </Grid>
  </>
);

export default Dashboard;