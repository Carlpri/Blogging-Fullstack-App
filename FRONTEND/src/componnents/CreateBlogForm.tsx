// USER CAN CREATE A BLOG POST
import { useState } from 'react';
import { TextField, Button, Typography, Box, Container, Alert } from '@mui/material';
import { api } from '../services/api';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { presetName, CLOUDINARY_URL } from './Cloudinary.tsx'; 

export const CreateBlogForm = () => {

    const [form, setForm] = useState({
        title: '',
        content: '',
        synopsis: '',
        image: '',
        tags: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };
    
    

    const handleSubmit = async () => {
        setError('');
        setIsLoading(true);

        try {
            const response = await api.post('/api/blogs/create', form, {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (response.status === 201) {
                navigate('/blogs');
            }
        } catch (err: unknown) {
            if (err && typeof err === 'object' && 'response' in err) {
                const axiosError = err as { response?: { data?: { message?: string } } };
                setError(axiosError.response?.data?.message || 'Failed to create blog post');
            } else {
                setError('Unexpected Error occurred');
            }
        }finally {
            setIsLoading(false);
        }
    }

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) {
            setError('Please select an image file');
            return;
        }
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', presetName);

            const res = await axios.post(CLOUDINARY_URL, formData);
            console.log(res.data)

            const imageUrl = res.data.secure_url;
            setForm(prev => ({ ...prev, image: imageUrl }));

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
                    onChange={handleFileUpload}
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
                    disabled={isLoading}
                >
                    {isLoading ? 'Creating...' : 'Create Blog Post'}
                </Button>
            </Box>
            
        </Container>
    );
}
export default CreateBlogForm;