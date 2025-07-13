import { useState } from 'react';
import { 
  TextField, 
  Button, 
  Typography, 
  Box, 
  Container, 
  Alert, 
  InputAdornment, 
  IconButton 
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { api } from '../services/api';
import { useNavigate } from 'react-router-dom';

export const ChangePasswordForm = () => {
  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('You must be logged in to change your password');
        return;
      }

      if (form.newPassword !== form.confirmPassword) {
        setError('New passwords do not match');
        return;
      }

      if (form.newPassword.length < 8) {
        setError('New password must be at least 8 characters long');
        return;
      }

      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;
      if (!passwordRegex.test(form.newPassword)) {
        setError('New password must contain at least one uppercase letter, one lowercase letter, and one number');
        return;
      }

      const response = await api.post(
        '/auth/change-password',
        {
          currentPassword: form.currentPassword,
          newPassword: form.newPassword,
          confirmPassword: form.confirmPassword
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 200) {
        setSuccess('Password changed successfully!');
        setForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        
        setTimeout(() => {
          navigate('/blogs');
        }, 2000);
      }
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response?: { data?: { message?: string } } };
        setError(axiosError.response?.data?.message || 'Failed to change password');
      } else {
        setError('An unexpected error occurred');
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
        backgroundImage: 'url("/naturebg.png")',
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
          Change Password
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        <TextField
          label="Current Password"
          name="currentPassword"
          type={showCurrentPassword ? 'text' : 'password'}
          autoComplete="current-password"
          fullWidth
          margin="normal"
          value={form.currentPassword}
          onChange={handleChange}
          sx={{
            "& .MuiOutlinedInput-root": {
              backgroundColor: "rgba(255, 255, 255, 0.9)",
            },
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton 
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)} 
                  edge="end"
                >
                  {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            )
          }}
        />

        <TextField
          label="New Password"
          name="newPassword"
          type={showNewPassword ? 'text' : 'password'}
          autoComplete="new-password"
          fullWidth
          margin="normal"
          value={form.newPassword}
          onChange={handleChange}
          sx={{
            "& .MuiOutlinedInput-root": {
              backgroundColor: "rgba(255, 255, 255, 0.9)",
            },
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton 
                  onClick={() => setShowNewPassword(!showNewPassword)} 
                  edge="end"
                >
                  {showNewPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            )
          }}
        />

        <TextField
          label="Confirm New Password"
          name="confirmPassword"
          type={showConfirmPassword ? 'text' : 'password'}
          autoComplete="new-password"
          fullWidth
          margin="normal"
          value={form.confirmPassword}
          onChange={handleChange}
          sx={{
            "& .MuiOutlinedInput-root": {
              backgroundColor: "rgba(255, 255, 255, 0.9)",
            },
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton 
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
                  edge="end"
                >
                  {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            )
          }}
        />

        <Typography 
          variant="body2" 
          sx={{ 
            mt: 2, 
            mb: 2, 
            color: "#666",
            fontSize: "0.875rem"
          }}
        >
          Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number.
        </Typography>

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
          Change Password
        </Button>

        <Button
          variant="outlined"
          fullWidth
          sx={{ 
            padding: "12px",
            fontSize: "16px",
            fontWeight: "bold",
            borderColor: "#666",
            color: "#666",
            "&:hover": {
              borderColor: "#333",
              color: "#333",
            },
          }}
          onClick={() => navigate('/blogs')}
        >
          Cancel
        </Button>
      </Container>
    </Box>
  );
};

export default ChangePasswordForm; 