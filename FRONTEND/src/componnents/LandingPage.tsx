import { Box, Typography, Button, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { keyframes } from '@mui/system';

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
`;



export const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        position: "relative",
        marginLeft: "0px",
        marginBottom: "0px",
        height: "100%",
        overflow: "hidden",
        borderRadius: "10px",
        alignItems: "center",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'url("./Landing bg.png")',
          backgroundSize: "cover",
          borderRadius: "10px",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          zIndex: -1,
          animation: `${float} 6s ease-in-out infinite`,
        }}
      />

      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          zIndex: 0,

          opacity: 0.6,
        }}
      />

      <Container
        sx={{
          position: "relative",
          zIndex: 1,
          height: "93vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          marginLeft: "50px",
          alignItems: "flex-start",
          textAlign: "center",
          color: "white",
          paddingTop: "20px",
        }}
      >
        <Typography variant="h1" gutterBottom 
        sx={{ mb: 4, 
        fontSize: "70px", 
        fontWeight: "bold", 
        color: "#f5f5f5" ,
        fontFamily: "Fjalla One",
        letterSpacing: "5px",
        wordSpacing: "12px",
        textShadow: "2px 2px 4px rgba(37, 116, 180, 0.9)",
        textAlign: "left",
        animation: `${fadeInUp} 1s ease-out`,
        }}>
          Welcome to BlogIt
        </Typography>
        <Typography variant="h1"
         sx={{
           mb: 6,
           fontSize: "40px",
           fontWeight: "bold",
           color: "white",
           fontFamily: "Bilbo",
           letterSpacing: "5px",
           wordSpacing: "12px",
           textShadow: "2px 2px 4px rgba(37, 116, 180, 0.9)",
           textAlign: "left",
          animation: `${fadeInUp} 1s ease-out 0.3s both`,
         }}>
          Share your thoughts with the world
        </Typography>
        <Box sx={{ display: "flex", gap: 4 }}>
          <Button
            variant="contained"
            size="large"
            sx={{
              boxShadow:"2px 2px 4px rgba(255, 255, 255, 0.9)",
              animation: `${fadeInUp} 1s ease-out 0.6s both`,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-3px) scale(1.05)',
                boxShadow: '0 10px 20px rgba(0,0,0,0.3)',
              },
            }}
            onClick={() => navigate("/login")
              
            }
          >
            Login
          </Button>
          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate("/register")}
            sx={{ 
              color: "black", 
              borderColor: "#2979ff",
              borderWidth:"3px",
              fontWeight:"bold",
              backgroundColor:"ButtonShadow",
              boxShadow:"2px 2px 4px rgba(255, 255, 255, 0.9)",
              animation: `${fadeInUp} 1s ease-out 0.9s both`,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-3px) scale(1.05)',
                boxShadow: '0 10px 20px rgba(0,0,0,0.3)',
              },
              
            }}
          >
            Register
          </Button>
        </Box>
      </Container>

      <Box
        sx={{
          position: "absolute",
          bottom: "120px",
          right: "120px",
          zIndex: 2,
          maxWidth: "400px",
          textAlign: "left",
          backdropFilter:"blur(10px)",
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.5)",
          opacity: 0.8,
          border: "1px solid rgba(255, 255, 255, 0.2)",
          animation: `${fadeInUp} 1s ease-out 1.2s both`,
        }}
      >
        <Typography
          variant="body1"
          sx={{
            color: "whitesmoke",
            fontSize: "17px",
            fontWeight:"bold",
            lineHeight: 1.5,
            textShadow: "1px 1px 2px rgba(0, 0, 0, 0.8)",
            fontFamily: "Arial, sans-serif"
          }}
        >
          Discover the power of storytelling through our innovative blogging platform. 
          Connect with readers worldwide and share your unique perspective on topics 
          that matter to you. Start your journey today and become part of our 
          growing community of writers and thinkers.
        </Typography>
      </Box>
    </Box>
  );
};

export default LandingPage;
