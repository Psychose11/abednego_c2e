import React from 'react';
import ReactDOM from 'react-dom/client';

import {BrowserRouter} from "react-router-dom";

// import Grid from '@mui/material/Grid';
// import VerticalMenu from './NavBar';
// import Signin from './components/login/login';
// import EnhancedTable from './DataTable';
// import PrimarySearchAppBar from './AppBar';
import reportWebVitals from './reportWebVitals';
import App from './App';


// const router = createBrowserRouter([
//   {
//     path: "/",
//     element:<><PrimarySearchAppBar /><Grid container spacing={2}>

//       <Grid item xs={12} sm={3} md={2}>
//         <VerticalMenu />
//       </Grid>

//       <Grid item xs={12} sm={9} md={10} container justifyContent="center" style={{ paddingTop: '50px', paddingLeft: '20px', paddingRight: '20px' }}>
//         <EnhancedTable />
//       </Grid>
//     </Grid></> ,
//   },
// ]);




const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
<BrowserRouter>
<App/>
</BrowserRouter>,

);

reportWebVitals();
