import React from 'react';
import { Card } from 'primereact/card';
import { Chart } from 'primereact/chart';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Badge from '@mui/material/Badge';
import deepPurple from '@mui/material/colors/deepPurple';
import QRCode from 'react-qr-code';



const Dashboard = () => {
  const cardContainerStyle = { display: 'flex', flexWrap: 'wrap' };
  const cardStyle = { margin: '16px', flex: '1', minWidth: '300px' };

  const chartData1 = {
    labels: ['A', 'B', 'C'],
    datasets: [
      {
        data: [300, 50, 100],
        backgroundColor: ['#198ccd', '#a00540', '#fdca50'],
        hoverBackgroundColor: ['#0056b3', '#c79100', '#218838'],
      },
    ],
  };

  const chartData2 = {
    labels: ['Janvier', 'Fevrier', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet'],
    datasets: [
      {
        label: 'Sales',
        backgroundColor: '#198ccd',
        borderColor: '#007BFF',
        borderWidth: 1,
        hoverBackgroundColor: '#0056b3',
        hoverBorderColor: '#0056b3',
        data: [65, 59, 80, 81, 56, 55, 40],
      },
    ],
  };

  return (
    <div style={cardContainerStyle}>
      <Card title="Payements effectués" style={cardStyle}>
       100
      </Card>
      <Card title="Total membre C2E" style={cardStyle}>
      1200
      </Card>
      <Card title="Bon retour 👌" style={cardStyle}>
      Abednego users
      </Card>

      <Card title="Profil Utilisateur" style={cardStyle}>
  <Stack direction="column" alignItems="center" spacing={2}>
    <Badge
      overlap="circular"
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      variant="dot"
    >
      <Avatar sx={{ bgcolor: deepPurple[500], width: 80, height: 80, fontSize: 32 }}>A</Avatar>
    </Badge>
    
    <Stack direction="column" alignItems="center" spacing={0}>
      <Typography variant="subtitle1" color="textPrimary">
        Abednego Users
      </Typography>
      <Typography variant="body2" color="textSecondary">
        Prospecteur
      </Typography>
    </Stack>
    
    <div style={{ marginTop: 16, paddingTop:50, }}>
      <QRCode value="Abednego Users" size={100} style={{ height: 'auto', maxWidth: '100%' }} />
    </div>
  </Stack>
</Card>


      <Card title="Graphique Circulaire" style={cardStyle}>
        <Chart type="doughnut" data={chartData1} />
      </Card>
      <Card title="Graphique en Barre" style={cardStyle}>
        <Chart type="bar" data={chartData2} />
      </Card>
    </div>
  );
};

export default Dashboard;
