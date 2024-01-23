import React from 'react';
import PrimarySearchAppBar from '../AppBar';
import VerticalMenu from '../NavBar';
import EnhancedTable from '../projet/dataProject';
import Grid from '@mui/material/Grid';



const ProjectGestion = () => (
  <>
    <PrimarySearchAppBar />
    <Grid container spacing={2}>
      <Grid item xs={12} sm={3} md={2} style={{paddingTop:"20px"}}>
        <VerticalMenu />
      </Grid>
      <Grid item xs={12} sm={12} md={10}  justifyContent="center" style={{ paddingTop: '50px', }}>
       <EnhancedTable/>
      </Grid>
    </Grid>
  </>
);

export default ProjectGestion;