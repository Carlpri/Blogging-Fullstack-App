// src/components/LoginForm.tsx
import { useState } from 'react';
import { TextField, Button, Typography, Box, Container, Alert, InputAdornment, IconButton } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';



export const LoginForm = () => {
  const [form, setForm] = useState({ identifier: '', password: '' });
  const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

 const handleSubmit = async () => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5678/api'}/auth/login`, form);
      localStorage.setItem('token', res.data.token);
      navigate('/blogs');
    } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
            setError(err.response?.data?.message || 'Login failed');
        } else {
      setError('Unexpected Error occurred');
        }
    }
  };

  return (
    <Box
      sx={{
        position: "relative",
        minHeight: "95vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundImage: 'url("./naturebg.png")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        borderRadius: "10px",
      }}
    >
      
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 0,
        }}
      />
      <Container 
        maxWidth="sm"
        sx={{
          position: "relative",
          zIndex: 1,
          backgroundColor: "rgba(204, 204, 204, 0.95)",
          borderRadius: "15px",
          padding: "40px",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
          backdropFilter: "blur(10px)",
        }}
      >
        <Typography 
          variant="h4" 
          align="center" 
          gutterBottom
          sx={{
            color: "#333",
            fontWeight: "bold",
            marginBottom: "30px",
          }}
        >
          Login
        </Typography>

        <TextField
          label="Your Email or Username"
          name="identifier"
          autoComplete="off"
          fullWidth
          margin="normal"
          value={form.identifier}
          onChange={handleChange}
          sx={{
            "& .MuiOutlinedInput-root": {
              backgroundColor: "rgb(255, 255, 255)",
            },
          }}
        />

        <TextField
          label="Password"
          name="password"
          type={showPassword ? 'text':"password"}
          autoComplete="off"
          fullWidth
          margin="normal"
          value={form.password}
          onChange={handleChange}
          sx={{
            "& .MuiOutlinedInput-root": {
              backgroundColor: "rgba(255, 255, 255, 0.9)",
            },
          }}
          InputProps ={{
            endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={()=> setShowPassword(!showPassword)} edge="end">
                    {showPassword ? <VisibilityOff/> : <Visibility />}
                    </IconButton>
                </InputAdornment>
            )
          }}
        />

        <Button
          variant="contained"
          fullWidth
          sx={{ 
            mt: 3, 
            mb: 2,
            padding: "12px",
            fontSize: "16px",
            fontWeight: "bold",
            backgroundColor: "#1976d2",
            "&:hover": {
              backgroundColor: "#1565c0",
            },
          }}
          onClick={handleSubmit}
        >
          Login
        </Button>

        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      </Container>
    </Box>
  );

};



export default LoginForm;