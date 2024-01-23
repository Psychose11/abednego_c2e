import React from 'react';
import Typography from '@mui/material/Typography';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import { Card } from 'primereact/card';

const ProspectionInfo = () => {
  const infoStyle = {
    color: '#424242',
    borderRadius: '8px',
    marginBottom: '20px',
  };
  const labelStyle = {
    marginBottom: '8px',
    display: 'block',
  };
  const detailStyle = {
    marginBottom: '16px',
  };
  return (

    <Card title="Informations de Prospection" >
        <div style={infoStyle}>
      
      <div>
      <strong style={labelStyle}>Raison Sociale:</strong>
        <Typography variant="body1" style={detailStyle}>
          Canon Inc
        </Typography>
      </div>
      <div>
        <strong style={labelStyle}>Nom du Propriétaire:</strong>
        <Typography variant="body1" style={detailStyle}>
          Yoshida Gorō
        </Typography>
      </div>
      <div>
        <strong style={labelStyle}>Adresse du Local:</strong>
        <Typography variant="body1" style={detailStyle}>
          <LocationOnIcon style={{ fontSize: '1.2em', verticalAlign: 'middle', marginRight: '8px' }} />
          Saint-Leu 97436 La Réunion
        </Typography>
      </div>
      <div>
        <strong style={labelStyle}>Numéro de Téléphone:</strong>
        <Typography variant="body1" style={detailStyle}>
          <PhoneIcon style={{ fontSize: '1.2em', verticalAlign: 'middle', marginRight: '8px' }} />
          02 62 12 15 56
        </Typography>
      </div>
    </div>
    </Card>
    
  );
};

export default ProspectionInfo;
