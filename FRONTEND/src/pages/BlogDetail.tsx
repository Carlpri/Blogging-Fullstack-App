import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Container, 
  Typography, 
  Card, 
  CardContent, 
  Button, 
  Chip,
  Avatar,
  Divider,
  CircularProgress,
  Alert
} from '@mui/material';
import { ArrowBack, Edit, Delete } from '@mui/icons-material';
import axios from 'axios';

interface Blog {
  id: string;
  title: string;
  content: string;
  synopsis: string;
  image: string;
  tags: string;
  dateCreated: string;
  lastUpdated: string;
  userId: string;
  user: {
    firstName: string;
    lastName: string;
  };
}

export const BlogDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setCurrentUserId(payload.userId || payload.id);
      } catch (error) {
        console.error('Error parsing token:', error);
      }
    }
  }, []);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5678/api'}/blogs/${id}`);
        console.log('Blog data received:', response.data);
        console.log('Date fields:', {
          dateCreated: response.data.dateCreated,
          lastUpdated: response.data.lastUpdated
        });
        setBlog(response.data);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.message || 'Failed to fetch blog post');
        } else {
          setError('An unexpected error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBlog();
    }
  }, [id]);

  const handleDeleteBlog = async () => {
    if (!window.confirm('Are you sure you want to delete this blog post?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5678/api'}/blogs/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate('/blogs');
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Failed to delete blog post');
      } else {
        setError('An unexpected error occurred');
      }
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Unknown date';
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      console.error('Invalid date string:', dateString);
      return 'Invalid date';
    }
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  if (loading) {
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
        }}
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error || !blog) {
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
        }}
      >
        <Container maxWidth="md">
          <Alert severity="error" sx={{ fontSize: '1.1rem' }}>
            {error || 'Blog post not found'}
          </Alert>
        </Container>
      </Box>
    );
  }

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
      <Container maxWidth="lg" sx={{ mt: 2, mb: 4 }}>
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

            {blog.userId === currentUserId && (
              <Box sx={{ display: "flex", gap: 1 }}>
                <Button
                  startIcon={<Edit />}
                  onClick={() => navigate(`/blogs/${blog.id}/edit`)}
                  sx={{
                    color: "#1976d2",
                    "&:hover": {
                      backgroundColor: "rgba(25, 118, 210, 0.3)",
                    },
                  }}
                >
                  Edit
                </Button>
                <Button
                  startIcon={<Delete />}
                  onClick={handleDeleteBlog}
                  sx={{
                    color: "#d32f2f",
                    "&:hover": {
                      backgroundColor: "rgba(211, 47, 47, 0.1)",
                    },
                  }}
                >
                  Delete
                </Button>
              </Box>
            )}
          </Box>

          <CardContent sx={{ p: 4 }}>
            {blog.image && (
              <Box
                sx={{
                  width: "100%",
                  height: "400px",
                  borderRadius: "10px",
                  overflow: "hidden",
                  mb: 3,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                }}
              >
                <img
                  src={blog.image}
                  alt={blog.title}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                  }}
                />
              </Box>
            )}

            <Typography
              variant="h3"
              component="h3"
              sx={{
                fontWeight: "bold",
                color: "#333",
                mb: 1,
                textAlign: "center",
              }}
            >
              {blog.title}
            </Typography>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 3,
                mb: 1,
                flexWrap: "wrap",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Avatar
                  sx={{
                    bgcolor: "#1976d2",
                    width: 32,
                    height: 32,
                    fontSize: "0.75rem",
                  }}
                >
                  {getInitials(blog.user?.firstName || '', blog.user?.lastName || '')}
                </Avatar>
                <Typography variant="body1" color="text.secondary">
                  {blog.user?.firstName} {blog.user?.lastName}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Created: {formatDate(blog.dateCreated)}
              </Typography>
            </Box>
            {blog.lastUpdated && blog.lastUpdated !== blog.dateCreated && (
              <Typography variant="body2" color="text.secondary">
                Updated: {formatDate(blog.lastUpdated)}
              </Typography>
            )}

            {blog.synopsis && (
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="h6"
                  sx={{
                    color: "#333",
                    fontStyle: "italic",
                    textAlign: "center",
                    lineHeight: 1.5,
                  }}
                >
                  "{blog.synopsis}"
                </Typography>
              </Box>
            )}

            <Divider sx={{ my: 3 }} />

            <Typography
              variant="body1"
              sx={{
                lineHeight: 1.8,
                fontSize: "1.1rem",
                color: "#333",
                whiteSpace: "pre-wrap",
              }}
            >
              {blog.content}
            </Typography>

            {blog.tags && (
              <Box sx={{ mt: 4 }}>
                <Typography variant="h6" sx={{ mb: 2, color: "#333", fontWeight: "bold" }}>
                  Tags:
                </Typography>
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                  {blog.tags.split(',').map((tag, index) => (
                    <Chip
                      key={index}
                      label={tag.trim()}
                      sx={{
                        backgroundColor: "rgba(25, 118, 210, 0.1)",
                        color: "#1976d2",
                        "&:hover": {
                          backgroundColor: "rgba(25, 118, 210, 0.2)",
                        },
                      }}
                    />
                  ))}
                </Box>
              </Box>
            )}
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default BlogDetail; 