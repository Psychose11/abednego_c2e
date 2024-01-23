
import React from 'react';
import PrimarySearchAppBar from '../AppBar';
import VerticalMenu from '../NavBar';
import Grid from '@mui/material/Grid';
import UserTable from './dataUsers';



const Users = () => (
  <>
   <PrimarySearchAppBar />
<Grid container spacing={2}>
  <Grid item xs={12} sm={3} md={2} style={{paddingTop:"20px"}}>
    <VerticalMenu />
  </Grid>
  <Grid item xs={12} sm={12} md={10} container justifyContent="center" style={{ paddingTop: '50px', }}>
    <UserTable/>
  </Grid>
</Grid>
  </>
);

export default Users;