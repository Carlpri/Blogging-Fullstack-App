import { useState, useEffect } from 'react';
import { TextField, Button, Typography, Box, Container, Alert } from '@mui/material';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

export const EditBlogForm = () => {
    const [form, setForm] = useState({
        title: '',
        content: '',
        synopsis: '',
        image: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { id } = useParams();
    
    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`http://localhost:5678/api/blogs/${id}`, {
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
            } catch (err:unknown) {
                    console.log(err);
                setError('Failed to fetch blog');
            } finally {
                setLoading(false);
            }
        };
        fetchBlog();
    }, [id]);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };
    
    const handleSubmit = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.patch(`http://localhost:5678/api/blogs/${id}`, form, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            navigate('/blogs');
        } catch (err:unknown) {
            console.log(err);
            setError('Failed to update blog');
        }
    };
    
    if (loading) return <Typography>Loading...</Typography>;
    
    return (
        <Container maxWidth="md">
            <Box mt={8}>
                <Typography variant="h4" align="center" gutterBottom>Edit Blog Post</Typography>
                
                {error && <Alert severity="error">{error}</Alert>}
        
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
        
                <TextField
                    label="Image URL"
                    name="image"
                    fullWidth
                    margin="normal"
                    value={form.image}
                    onChange={handleChange}
                />
        
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
    );
};

export default EditBlogForm;
