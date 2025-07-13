import { useState, useEffect } from 'react';
import { TextField, Button, Typography, Box, Container, Alert, Card, CardMedia } from '@mui/material';
import { api } from '../services/api';
import { useNavigate, useParams } from 'react-router-dom';

export const EditBlogForm = () => {
    const [form, setForm] = useState({
        title: '',
        content: '',
        synopsis: '',
        image: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(true);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [currentImage, setCurrentImage] = useState<string>('');
    const [previewUrl, setPreviewUrl] = useState<string>('');
    const navigate = useNavigate();
    const { id } = useParams();
    
    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await api.get(`/blogs/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const blog = response.data;
                setForm({
                    title: blog.title,
                    content: blog.content,
                    synopsis: blog.synopsis,
                    image: blog.image
                });
                setCurrentImage(blog.image);
            } catch (err:unknown) {
                    console.log(err);
                setError('Failed to fetch blog');
            } finally {
                setLoading(false);
            }
        };
        fetchBlog();
        
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [id, previewUrl]);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };
    
    const handleSubmit = async () => {
        try {
            const token = localStorage.getItem('token');
            const formData = new FormData();
            formData.append('title', form.title);
            formData.append('content', form.content);
            formData.append('synopsis', form.synopsis);
            
            if (imageFile) {
                formData.append('image', imageFile);
            } else if (form.image) {
                formData.append('image', form.image);
            }
            
            console.log('Updating blog with data:', form);
            
            const response = await api.patch(`/blogs/${id}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            
            console.log('Blog updated successfully:', response.data);
            setSuccess('Blog updated successfully!');
            setError('');
            setTimeout(() => {
                navigate('/blogs');
            }, 1500);
        } catch (err:unknown) {
            console.error('Error updating blog:', err);
            if (err && typeof err === 'object' && 'response' in err) {
                const axiosError = err as { response?: { data?: { message?: string } } };
                setError(axiosError.response?.data?.message || 'Failed to update blog');
            } else {
                setError('Failed to update blog');
            }
        }
    };
    
    if (loading) return <Typography>Loading...</Typography>;
    
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
                <Box
                    sx={{
                        backgroundColor: "rgba(204, 204, 204, 0.95)",
                        borderRadius: "15px",
                        padding: "40px",
                        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
                        backdropFilter: "blur(10px)",
                    }}
                >
                <Typography variant="h4" align="center" gutterBottom>Edit Blog Post</Typography>
                
                {error && <Alert severity="error">{error}</Alert>}
                {success && <Alert severity="success">{success}</Alert>}
        
                <TextField
                    label="Title"
                    name="title"
                    fullWidth
                    margin="normal"
                    value={form.title}
                    onChange={handleChange}
                />
        
                <TextField
                    label="Content"
                    name="content"
                    fullWidth
                    multiline
                    rows={4}
                    margin="normal"
                    value={form.content}
                    onChange={handleChange}
                />
        
                <TextField
                    label="Synopsis"
                    name="synopsis"
                    fullWidth
                    margin="normal"
                    value={form.synopsis}
                    onChange={handleChange}
                />
        
                {currentImage && (
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Current Image:
                        </Typography>
                        <Card sx={{ maxWidth: 300, mb: 2 }}>
                            <CardMedia
                                component="img"
                                height="200"
                                image={currentImage.startsWith('http') ? currentImage : 
                                       currentImage.startsWith('/') ? `${import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:5678'}${currentImage}` :
                                       currentImage.includes('uploads') ? `${import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:5678'}/${currentImage.replace(/\\/g, '/')}` :
                                       `${import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:5678'}/uploads/${currentImage}`}
                                alt="Current blog image"
                                sx={{ objectFit: 'cover' }}
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.style.display = 'none';
                                }}
                            />
                        </Card>
                    </Box>
                )}

                <Box sx={{ mb: 2 }}>
                    <Typography variant="h6" gutterBottom>
                        Update Image:
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        Upload a new image or keep the current one
                    </Typography>
                    
                    <input
                        type="file"
                        accept="image/*"
                        onChange={e => {
                            if (e.target.files && e.target.files[0]) {
                                const file = e.target.files[0];
                                setImageFile(file);
                                setForm(prev => ({ ...prev, image: '' }));
                                
                                const url = URL.createObjectURL(file);
                                setPreviewUrl(url);
                            }
                        }}
                        style={{ 
                            margin: '8px 0', 
                            display: 'block',
                            padding: '8px',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                            backgroundColor: 'rgba(255, 255, 255, 0.8)'
                        }}
                    />
                    
                    {previewUrl && (
                        <Box sx={{ mt: 2, mb: 2 }}>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                Preview of new image:
                            </Typography>
                            <Card sx={{ maxWidth: 300 }}>
                                <CardMedia
                                    component="img"
                                    height="150"
                                    image={previewUrl}
                                    alt="Preview of new image"
                                    sx={{ objectFit: 'cover' }}
                                />
                            </Card>
                        </Box>
                    )}
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 2, mb: 1 }}>
                        Or enter an image URL:
                    </Typography>
                    <TextField
                        label="Image URL (optional)"
                        name="image"
                        fullWidth
                        margin="normal"
                        value={form.image}
                        onChange={handleChange}
                        placeholder="https://example.com/image.jpg"
                        helperText="Leave empty to keep current image or upload a new file above"
                    />
                </Box>
        
                <Button
                    variant="contained"
                    fullWidth
                    sx={{ mt: 2 }}
                    onClick={handleSubmit}
                >
                    Update Blog
                </Button>
                </Box>
            </Container>
        </Box>
    );
};

export default EditBlogForm;
