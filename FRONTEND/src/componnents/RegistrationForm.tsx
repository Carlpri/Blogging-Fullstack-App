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
      await axios.post('http://localhost:5678/api/auth/register', form);
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
    <Container maxWidth="sm">
      <Box mt={8}>
        <Typography variant="h4" align="center" gutterBottom>Register</Typography>

        <TextField label="First Name" name="firstName" fullWidth margin="normal" value={form.firstName} onChange={handleChange} />
        <TextField label="Last Name" name="lastName" fullWidth margin="normal" value={form.lastName} onChange={handleChange} />
        <TextField label="Email" name="emailAddress" fullWidth margin="normal" value={form.emailAddress} onChange={handleChange} />
        <TextField label="Username" name="username" fullWidth margin="normal" value={form.username} onChange={handleChange} />
        <TextField label="Password" name="password" type="password" fullWidth margin="normal" value={form.password} onChange={handleChange} />

        <Button variant="contained" fullWidth sx={{ mt: 2 }} onClick={handleSubmit}>Register</Button>

        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
      </Box>
    </Container>
  );
};

export default RegisterForm;
