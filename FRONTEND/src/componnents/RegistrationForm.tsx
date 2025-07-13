// src/components/RegisterForm.tsx
import { useState } from 'react';
import { TextField, Button, Typography, Box, Container, Alert } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RegisterForm = () => {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    emailAddress: '',
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5678/api'}/auth/register`, form);
      setSuccess('Registration successful. You can now login.');
      setError('');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Registration failed');
      } else {
        setError('Unexpected error occurred');
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
          padding: "10px",
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
            marginBottom: "10px",
          }}
        >
          Register
        </Typography>

        <TextField 
          label="First Name" 
          name="firstName" 
          fullWidth 
          margin="normal" 
          value={form.firstName} 
          onChange={handleChange}
          sx={{
            "& .MuiOutlinedInput-root": {
              backgroundColor: "rgb(255, 255, 255)",
            },
          }}
        />
        <TextField 
          label="Last Name" 
          name="lastName" 
          fullWidth 
          margin="normal" 
          value={form.lastName} 
          onChange={handleChange}
          sx={{
            "& .MuiOutlinedInput-root": {
              backgroundColor: "rgb(255, 255, 255)",
            },
          }}
        />
        <TextField 
          label="Email" 
          name="emailAddress" 
          fullWidth 
          margin="normal" 
          value={form.emailAddress} 
          onChange={handleChange}
          sx={{
            "& .MuiOutlinedInput-root": {
              backgroundColor: "rgb(255, 255, 255)",
            },
          }}
        />
        <TextField 
          label="Username" 
          name="username" 
          fullWidth 
          margin="normal" 
          value={form.username} 
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
          type="password" 
          fullWidth 
          margin="normal" 
          value={form.password} 
          onChange={handleChange}
          sx={{
            "& .MuiOutlinedInput-root": {
              backgroundColor: "rgb(255, 255, 255)",
            },
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
          Register
        </Button>

        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
      </Container>
    </Box>
  );
};

export default RegisterForm;
