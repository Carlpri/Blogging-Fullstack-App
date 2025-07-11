// USER CAN VIEW CREATED BLOGS AND SEE A BUTTON TO CREATE A NEW BLOG POST
 
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardMedia, Typography, Button as MuiButton, Box } from '@mui/material';
import Grid from '@mui/material/Grid';



import { jwtDecode } from "jwt-decode";


type Blog = {
    id: string;
    title: string;
    synopsis: string;
    dateCreated: string;
    content: string;
    image: string;
    userId: string;
};

const BlogList = () => {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);
    const[error, setError] = useState('');
    const navigate = useNavigate();
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);

    useEffect(() => {
        const fetchBlogs = async () => {
            try{
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:5678/api/blogs', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setBlogs(response.data);
            }catch(err){
                setError('Failed to fetch blogs');
                console.error("Error fetching blogs:", err);
            }finally {
                setLoading(false);
            }
        }
        fetchBlogs();

    }, []);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            type JwtPayload = { userId: string };
            const decoded = jwtDecode<JwtPayload>(token);
            setCurrentUserId(decoded.userId); // adjust this based on your JWT payload
        }
    }, []);

    const handleCreateBlog = () => {
        navigate('/blogs/new');
    };

    const userBlogs = blogs
  .filter(blog => blog.userId === currentUserId)
  .sort((a, b) => new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime());

   

    const otherBlogs = blogs.filter(blog => blog.userId !== currentUserId);

    return(
        <Box sx={{ p: 4 }}>
            <Typography variant="h3" align="center" gutterBottom>My Blogs</Typography>
            {loading && 
                <Typography align="center">Loading...</Typography>
            }
            { error && 
                <Typography color="error" align="center">{error}</Typography>
            }

            <Box display="flex" justifyContent="center" mb={3}>
                <MuiButton variant="contained" color="primary" onClick={handleCreateBlog}>
                    Create New Blog
                </MuiButton>
            </Box>

            {!loading && blogs.length === 0 &&(
                <Typography align="center">No blogs found. Click the button above to create a new blog.</Typography>
            )}

            {userBlogs.length > 0 && (
                <Box mb={4}>
                    <Typography variant="h5" gutterBottom>My Recent Blogs</Typography>
                    <Grid container spacing={3}>
                        {userBlogs.map(blog => (
                            <Grid key={blog.id} item xs={12} sm={6} md={4}>
                                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                    {blog.image && (
                                        <CardMedia
                                            component="img"
                                            height="180"
                                            image={blog.image}
                                            alt={blog.title}
                                        />
                                    )}
                                    <CardContent sx={{ flexGrow: 1 }}>
                                        <Typography gutterBottom variant="h5" component="div">
                                            {blog.title}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                            {blog.synopsis}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                            {blog.content.length > 100 ? `${blog.content.substring(0, 100)}...` : blog.content}
                                        </Typography>

                                        <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                                            Created on {new Date(blog.dateCreated).toLocaleDateString()}
                                        </Typography>
                                        <MuiButton variant="outlined" size="small" onClick={() => navigate(`/blogs/${blog.id}`)} sx={{ mt: 1 }}>
                                            View Blog
                                        </MuiButton>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            )}

            <Box>
                <Typography variant="h5" gutterBottom>Other Blogs</Typography>
                <Grid container spacing={3}>
                    {otherBlogs.map(blog => (
                        <Grid key={blog.id} item xs={12} sm={6} md={4}>
                            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                {blog.image && (
                                    <CardMedia
                                        component="img"
                                        height="180"
                                        image={blog.image}
                                        alt={blog.title}
                                    />
                                )}
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Typography gutterBottom variant="h5" component="div">
                                        {blog.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                        {blog.synopsis}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                        {blog.content.length > 100 ? `${blog.content.substring(0, 100)}...` : blog.content}
                                    </Typography>

                                    <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                                        Created on {new Date(blog.dateCreated).toLocaleDateString()}
                                    </Typography>
                                    <MuiButton variant="outlined" size="small" onClick={() => navigate(`/blogs/${blog.id}`)} sx={{ mt: 1 }}>
                                        View Blog
                                    </MuiButton>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </Box>
    );
}

export default BlogList;
