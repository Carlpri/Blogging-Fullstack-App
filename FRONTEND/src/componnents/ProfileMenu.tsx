import { useState, useEffect } from 'react';
import {
  Avatar,
  Menu,
  MenuItem,
  Typography,
  Box,
  IconButton,
  Divider,
  CircularProgress,
} from '@mui/material';
import {  Logout, Edit,  Article, Person } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { api } from '../services/api';

export const ProfileMenu = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [blogCount, setBlogCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const fetchBlogCount = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      setLoading(true);
      const response = await api.get('/blogs/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBlogCount(response.data.length);
    } catch (error) {
      console.error('Error fetching blog count:', error);
      setBlogCount(0);
    } finally {
      setLoading(false);
    }
  };

  const getUserInfo = () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode<{ 
          firstName?: string; 
          lastName?: string; 
          emailAddress?: string;
          username?: string;
        }>(token);
        
        console.log('Decoded token:', decoded); 
        
        return {
          firstName: decoded.firstName || 'User',
          lastName: decoded.lastName || 'Name',
          emailAddress: decoded.emailAddress || 'user@example.com',
          username: decoded.username || '',
        };
      } catch (error) {
        console.error('Error decoding token:', error);
        return {
          firstName: 'User',
          lastName: 'Name',
          emailAddress: 'user@example.com',
          username: '',
        };
      }
    }
    return null;
  };

  useEffect(() => {
    fetchBlogCount();
  }, []);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    fetchBlogCount();
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
    handleMenuClose();
  };

  const handleChangePassword = () => {
    navigate('/change-password');
    handleMenuClose();
  };

  const getInitials = (firstName: string, lastName: string) => {
    if (!firstName || !lastName) {
      return 'U';
    }
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const userInfo = getUserInfo();

  if (!userInfo) {
    return null;
  }

  return (
    <Box sx={{ position: 'relative' }}>
      <IconButton
        onClick={handleMenuOpen}
        sx={{
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 1)',
            transform: 'scale(1.05)',
          },
          transition: 'all 0.2s ease',
        }}
      >
        <Avatar
          sx={{
            bgcolor: '#1976d2',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '18px',
          }}
        >
          {getInitials(userInfo.firstName, userInfo.lastName)}
        </Avatar>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 280,
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            borderRadius: '12px',
          },
        }}
      >
        <Box sx={{ p: 2, textAlign: 'center' }}>
          <Avatar
            sx={{
              width: 60,
              height: 60,
              bgcolor: '#1976d2',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '24px',
              mx: 'auto',
              mb: 1,
            }}
          >
            {getInitials(userInfo.firstName, userInfo.lastName)}
          </Avatar>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333' }}>
            {userInfo.firstName} {userInfo.lastName}
          </Typography>
          <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
            {userInfo.emailAddress}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
            <Article sx={{ fontSize: 16, color: '#666' }} />
            {loading ? (
              <CircularProgress size={16} sx={{ color: '#666' }} />
            ) : (
              <Typography variant="body2" sx={{ color: '#666' }}>
                {blogCount} blogs
              </Typography>
            )}
          </Box>
        </Box>

        <Divider />

        <MenuItem onClick={() => { navigate('/edit-profile'); handleMenuClose(); }} sx={{ py: 1.5 }}>
          <Person sx={{ mr: 2, color: '#666' }} />
          <Typography>Edit Profile</Typography>
        </MenuItem>

        <MenuItem onClick={handleChangePassword} sx={{ py: 1.5 }}>
          <Edit sx={{ mr: 2, color: '#666' }} />
          <Typography>Change Password</Typography>
        </MenuItem>

        <Divider />

        <MenuItem onClick={handleLogout} sx={{ py: 1.5, color: '#d32f2f' }}>
          <Logout sx={{ mr: 2 }} />
          <Typography>Logout</Typography>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default ProfileMenu; 