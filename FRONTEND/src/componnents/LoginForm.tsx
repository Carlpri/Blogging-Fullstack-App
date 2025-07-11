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
      const res = await axios.post('http://localhost:5678/api/auth/login', form);
      localStorage.setItem('token', res.data.token);
      navigate('/dashboard');
    } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
            setError(err.response?.data?.message || 'Login failed');
        } else {
      setError('Unexpected Error occurred');
        }
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={8}>
        <Typography variant="h4" align="center" gutterBottom>Login</Typography>

        <TextField
          label="Your Email or Username"
          name="identifier"
          autoComplete="off"
          fullWidth
          margin="normal"
          value={form.identifier}
          onChange={handleChange}
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
          sx={{ mt: 2 }}
          onClick={handleSubmit}
        >
          Login
        </Button>

        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      </Box>
    </Container>
  );

};



export default LoginForm;