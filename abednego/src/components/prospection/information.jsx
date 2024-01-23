import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { Card, CardContent } from '@mui/material';
import HorizontalNonLinearStepper from './steps';
import ProspectionForm from './form';
import ProspectionInfo from './info';


function CustomTabPanel(props) {
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
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
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


export default function BasicTabs() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '90%', minHeight: '500px'}}> 


      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <Card>
            <CardContent>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                  <Tab label="Informations Prospect" {...a11yProps(0)} />
                  <Tab label="Formulaire Prospect" {...a11yProps(1)} />
                </Tabs>
              </Box>
              <CustomTabPanel value={value} index={0}>
                <ProspectionInfo/>
              </CustomTabPanel>
              <CustomTabPanel value={value} index={1}>
                <ProspectionForm />
              </CustomTabPanel>
            </CardContent>
          </Card>
        </Grid>



        <Grid item xs={12} sm={6}>
          <Card>
            <CardContent>

              <HorizontalNonLinearStepper />

            </CardContent>
          </Card>
        </Grid>
      </Grid>







    </Box>
  );
}