import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Avatar,
} from '@mui/material';
import { ArrowBack, Save } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

interface UserInfo {
  firstName: string;
  lastName: string;
  emailAddress: string;
  username: string;
}

export const EditProfileForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState<UserInfo>({
    firstName: '',
    lastName: '',
    emailAddress: '',
    username: '',
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = jwtDecode<{
          firstName: string;
          lastName: string;
          emailAddress: string;
          username: string;
        }>(token);
        
        setFormData({
          firstName: payload.firstName || '',
          lastName: payload.lastName || '',
          emailAddress: payload.emailAddress || '',
          username: payload.username || '',
        });
      } catch (error) {
        console.error('Error parsing token:', error);
        setError('Failed to load user information');
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleInputChange = (field: keyof UserInfo) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.patch(
        `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5678/api'}/auth/update`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }

      setSuccess('Profile updated successfully!');
      
      setTimeout(() => {
        navigate('/blogs');
      }, 2000);

    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Failed to update profile');
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  return (
    <Box
      sx={{
        position: "relative",
        minHeight: "95vh",
        backgroundImage: 'url("/naturebg.png")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        padding: "20px",
      }}
    >
      <Container maxWidth="md" sx={{ mt: 2, mb: 4 }}>
        <Card
          sx={{
            backgroundColor: "rgba(204, 204, 204, 0.95)",
            borderRadius: "15px",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
            backdropFilter: "blur(10px)",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              p: 3,
              borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <Button
              startIcon={<ArrowBack />}
              onClick={() => navigate('/blogs')}
              sx={{
                color: "#333",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.5)",
                },
              }}
            >
              Back to Blogs
            </Button>

            <Typography variant="h5" sx={{ fontWeight: "bold", color: "#333" }}>
              Edit Profile
            </Typography>
          </Box>

          <CardContent sx={{ p: 4 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            {success && (
              <Alert severity="success" sx={{ mb: 3 }}>
                {success}
              </Alert>
            )}

            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
              <Avatar
                sx={{
                  width: 100,
                  height: 100,
                  bgcolor: '#1976d2',
                  fontSize: '2rem',
                  fontWeight: 'bold',
                }}
              >
                {getInitials(formData.firstName, formData.lastName)}
              </Avatar>
            </Box>

            <form onSubmit={handleSubmit}>
              <Box sx={{ display: 'grid', gap: 3 }}>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
                  <TextField
                    label="First Name"
                    value={formData.firstName}
                    onChange={handleInputChange('firstName')}
                    required
                    fullWidth
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        },
                      },
                    }}
                  />
                  <TextField
                    label="Last Name"
                    value={formData.lastName}
                    onChange={handleInputChange('lastName')}
                    required
                    fullWidth
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        },
                      },
                    }}
                  />
                </Box>

                <TextField
                  label="Email Address"
                  type="email"
                  value={formData.emailAddress}
                  onChange={handleInputChange('emailAddress')}
                  required
                  fullWidth
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      },
                    },
                  }}
                />

                <TextField
                  label="Username"
                  value={formData.username}
                  onChange={handleInputChange('username')}
                  required
                  fullWidth
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      },
                    },
                  }}
                />

                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 3 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={loading ? <CircularProgress size={20} /> : <Save />}
                    disabled={loading}
                    sx={{
                      px: 4,
                      py: 1.5,
                      fontSize: '1.1rem',
                      fontWeight: 'bold',
                      backgroundColor: '#1976d2',
                      '&:hover': {
                        backgroundColor: '#1565c0',
                      },
                    }}
                  >
                    {loading ? 'Updating...' : 'Update Profile'}
                  </Button>
                </Box>
              </Box>
            </form>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default EditProfileForm; 