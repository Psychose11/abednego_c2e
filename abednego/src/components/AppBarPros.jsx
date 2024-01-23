import * as React from 'react';
import { styled} from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Badge from '@mui/material/Badge';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import Image from '../assets/abednego.png';
import { useNavigate } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import { deepPurple } from '@mui/material/colors';

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#44b700',
    color: '#44b700',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: 'ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""',
    },
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0,
    },
  },
}));
export default function PrimarySearchAppBar() {
  const navigate = useNavigate();

  const deconnexion = () => {
navigate("/login");
  };
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" elevation={1} sx={{ backgroundColor: 'white'}}>
        <Toolbar>
          <img src={Image} alt="abednego" width="70" height="50"/>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ display: { xs: 'none', sm: 'block' ,color : 'grey'}}}
          >
            Prospections 
          </Typography>
          
          <Box sx={{ flexGrow: 1 }} />

          <Box sx={{ flexGrow: 1 }}>
          <Stack direction="row" spacing={2}>          
              <StyledBadge
        overlap="circular"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        variant="dot"
      >
       <Avatar sx={{ bgcolor: deepPurple[500] }}>A</Avatar>
      </StyledBadge>
         <Typography color="grey"> Abednego users </Typography>
        </Stack>
           </Box>      
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>

            <IconButton
              size="large"
              aria-label=""
              color="inherit"
              sx={{ display: { xs: 'none', sm: 'block' ,color : 'grey'}}}
            >
              <Badge>
              <PowerSettingsNewIcon onClick={deconnexion}/>
              </Badge>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
     
    </Box>
  );
}