import{Box,Stack,Typography,Button,  } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export const LandingPage =() => {
    const navigate = useNavigate();

    return (
        <Box 
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',                
                backgroundColor: '#546e7a',
                color: '#ffffff',
                padding: 3,
                textAlign: 'center',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 015)',

                
                borderRadius: 2,
                
                margin: 0.1,
                
            }}>
            <Typography variant="h2" component="h1" gutterBottom >
                Welcome to Write Stack 
            </Typography>
            <Typography variant="h5" component="h2" gutterBottom>
                Your personal blogging platform
            </Typography>
            <Stack
                direction="row"
                spacing={7}
                sx={{ marginTop: 2 }}
                
            >
                <Button variant="contained" color="secondary" onClick={() => navigate('/login')}>
                    Login
                </Button>
                <Button variant="contained" color="secondary" onClick={() => navigate('/register')}>
                    Register
                </Button>
            </Stack>
           
        </Box>
    );
}

export default LandingPage;
