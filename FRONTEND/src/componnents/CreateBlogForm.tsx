// USER CAN CREATE A BLOG POST
import { useState } from 'react';
import { TextField, Button, Typography, Box, Container, Alert } from '@mui/material';
import { api } from '../services/api';
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
    const [imageFile, setImageFile] = useState<File | null>(null);
    
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
            formData.append('tags', form.tags);
            if (imageFile) {
                formData.append('image', imageFile);
            }

            const res = await api.post('/blogs/create', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
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
            if (err && typeof err === 'object' && 'response' in err) {
                const axiosError = err as { response?: { data?: { message?: string } } };
                setError(axiosError.response?.data?.message || 'Failed to create blog post');
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
        
        <input
  type="file"
  accept="image/*"
  onChange={e => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  }}
  style={{ margin: '16px 0', display: 'block' }}
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