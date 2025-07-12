import { useState } from 'react';
import {
  Avatar,
  Menu,
  MenuItem,
  Typography,
  Box,
  IconButton,
  Divider,
  Button,
} from '@mui/material';
import { AccountCircle, Logout, Edit, Email, Article } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

type User = {
  firstName: string;
  lastName: string;
  emailAddress: string;
  blogCount: number;
};

export const ProfileMenu = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  // Get user info from token
  const getUserInfo = () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode<{ firstName?: string; lastName?: string; emailAddress?: string }>(token);
        return {
          firstName: decoded.firstName || 'User',
          lastName: decoded.lastName || 'Name',
          emailAddress: decoded.emailAddress || 'user@example.com',
          blogCount: 0, // This will be updated when we fetch user's blogs
        };
      } catch (error) {
        console.error('Error decoding token:', error);
        return {
          firstName: 'User',
          lastName: 'Name',
          emailAddress: 'user@example.com',
          blogCount: 0,
        };
      }
    }
    return null;
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    const userInfo = getUserInfo();
    setUser(userInfo);
    setAnchorEl(event.currentTarget);
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
    // Navigate to change password page (you can create this later)
    navigate('/change-password');
    handleMenuClose();
  };

  const getInitials = (firstName: string, lastName: string) => {
    if (!firstName || !lastName) {
      return 'U'; // Default to 'U' for User if names are missing
    }
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const userInfo = getUserInfo();

  if (!userInfo) {
    return null;
  }

  return (
    <Box sx={{ position: 'absolute', top: 20, right: 20, zIndex: 10 }}>
      <IconButton
        onClick={handleMenuOpen}
        sx={{
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 1)',
          },
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
        {/* User Info Section */}
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
            <Typography variant="body2" sx={{ color: '#666' }}>
              {userInfo.blogCount} blogs
            </Typography>
          </Box>
        </Box>

        <Divider />

        {/* Menu Items */}
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