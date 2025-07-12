// USER CAN VIEW CREATED BLOGS AND SEE A BUTTON TO CREATE A NEW BLOG POST

import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button as MuiButton,
  Box,
} from "@mui/material";

import { jwtDecode } from "jwt-decode";
import ProfileMenu from "../componnents/ProfileMenu";

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
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5678/api/blogs", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('Fetched blogs:', response.data.length, 'blogs');
        setBlogs(response.data);
      } catch (err) {
        setError("Failed to fetch blogs");
        console.error("Error fetching blogs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      type JwtPayload = { userId: string };
      const decoded = jwtDecode<JwtPayload>(token);
      setCurrentUserId(decoded.userId);
    }
  }, []);



  const handleCreateBlog = () => {
    navigate("/blogs/new");
  };

  const handleDeleteBlog = async (blogId: string) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5678/api/blogs/${blogId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBlogs((prev) => prev.filter((blog) => blog.id !== blogId));
    } catch (error:unknown) {
      console.log(error);
      alert("Failed to delete blog");
    }
  };



  return (
    <Box
      sx={{
        position: "relative",
        minHeight: "95vh",
        backgroundImage: 'url("./naturebg.png")',
        backgroundSize: "contain",
        backgroundPosition: "center",
        backgroundRepeat: "repeat",
        borderRadius: "10px",
      }}
    >
      <ProfileMenu />
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.2)",
          zIndex: 0,

        }}
      />

      <Box 
        sx={{ 
          position: "relative",
          zIndex: 1,
          p: 4,
        }}
      >
        <Typography 
          variant="h3" 
          align="center" 
          gutterBottom
          sx={{
            color: "white",
            fontWeight: "bold",
            marginBottom: "0px",
            fontFamily: "Fjalla One",
            letterSpacing: "5px",
            wordSpacing: "12px",
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            padding: "5px",
            borderRadius: "10px",
            marginTop: "10px",
            marginLeft: "-30px",
            width: "fit-content",
          }}
        >
          WRITE STACK
        </Typography>
        
        {loading && <Typography align="center">Loading...</Typography>}
        {error && (
          <Typography color="error" align="center">
            {error}
          </Typography>
        )}

        <Box display="flex" justifyContent="center" mb={3}>
          <MuiButton
            variant="contained"
            color="primary"
            onClick={handleCreateBlog}
            sx={{
              padding: "10px 15px",
              fontSize: "16px",
              fontWeight: "bold",
              backgroundColor: "#1976d2",
              "&:hover": {
                backgroundColor: "#1865c0",

              },
            }}
          >
            Create New Blog
          </MuiButton>
        </Box>

        {!loading && blogs.length === 0 && (
          <Typography align="center"
          sx={{
            color: "white",
            fontWeight: "bold",
            marginBottom: "15px",
          }}
          >
            No blogs found. Click the button above to create a new blog.
          </Typography>
        )}

        <Box>
          <Typography 
            variant="h5" 
            gutterBottom
            sx={{
              color: "white",
              fontWeight: "bold",
              marginBottom: "15px",
              textDecoration: "underline",
            }}
          >
            All Blogs
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 3 }}>
            {blogs.map((blog) => (
              <Box key={blog.id}>
                <Card
                  sx={{ 
                    height: 400, 
                    display: "flex", 
                    flexDirection: "column",
                    "&:hover": {
                      boxShadow: "0 8px 16px rgba(255, 255, 255, 0.5)",
                      transform: "translateY(-2px)",
                      transition: "all 0.3s ease",
                    },
                  }}
                >
                  {blog.image && (
                    <CardMedia
                      component="img"
                      height="180"
                      width="100%"
                      image={blog.image.startsWith('http') ? blog.image : 
                             blog.image.startsWith('/') ? `http://localhost:5678${blog.image}` :
                             blog.image.includes('uploads') ? `http://localhost:5678/${blog.image.replace(/\\/g, '/')}` :
                             `http://localhost:5678/uploads/${blog.image}`}
                      alt={blog.title}
                      style={{
                        objectFit: "cover",
                      }}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  )}
                  <CardContent sx={{ flexGrow: 1, paddingBottom: "20px" }}>
                    <Typography gutterBottom variant="h5" component="div">
                      {blog.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 1 }}
                    >
                      <b>{blog.synopsis}</b>
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 2 }}
                    >
                      {blog.content.length > 100
                        ? `${blog.content.substring(0, 100)}...`
                        : blog.content}
                    </Typography>

                    <Typography
                      variant="caption"
                      color="text.secondary"
                      display="block"
                      gutterBottom
                    >
                      <b>Created on</b>{" "}
                      {new Date(blog.dateCreated).toLocaleDateString()}
                    </Typography>
                    <MuiButton
                      variant="outlined"
                      size="small"
                      onClick={() => navigate(`/blogs/${blog.id}`)}
                      sx={{ mt: 1, mb: 1 }}
                    >
                      View Blog
                    </MuiButton>
                    
                    {blog.userId === currentUserId && (
                      <>
                        <MuiButton
                          variant="outlined"
                          size="small"
                          onClick={() => navigate(`/blogs/${blog.id}/edit`)}
                          sx={{ mt: 1, ml: 1, mb: 1 }}
                        >
                          Edit
                        </MuiButton>
                        <MuiButton
                          variant="outlined"
                          size="small"
                          color="error"
                          onClick={() => handleDeleteBlog(blog.id)}
                          sx={{ mt: 1, ml: 1, mb: 1 }}
                        >
                          Delete
                        </MuiButton>
                      </>
                    )}
                  </CardContent>
                </Card>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default BlogList;
