// USER CAN CREATE A BLOG POST
import { useState } from 'react';
import { TextField, Button, Typography, Box, Container, Alert } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


export const CreateBlogForm = () => {
    const [form, setForm] = useState({
        title: '',
        content: '',
        synopsis: '',
        image: '',
        tags: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };
    
    const handleSubmit = async () => {
        try {
            const res = await axios.post('http://localhost:5678/api/blogs', form, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (res.status === 201) {
                setForm({
                    title: '',
                    content: '',
                    synopsis: '',
                    image: '',
                    tags: ''
                });
                setError('');
            }
            navigate('/blogs');
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.message || 'Failed to create blog post');
            } else {
                setError('Unexpected Error occurred');
            }
        }
    };
    
    return (
        <Container maxWidth="md">
            <Box mt={8}>
                <Typography variant="h4" align="center" gutterBottom>Create your New Blog Post</Typography>
                
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
        
                <TextField
                    label="Tags (comma separated)"
                    name="tags"
                    fullWidth
                    margin="normal"
                    value={form.tags}
                    onChange={handleChange}
                />
                <Button
                    variant="contained"
                    fullWidth
                    sx={{ mt: 2 }}
                    onClick={handleSubmit}
                >
                    Create Post
                </Button>
            </Box>
            
        </Container>
    );
}
export default CreateBlogForm;