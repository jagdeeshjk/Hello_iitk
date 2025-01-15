import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import c1 from "../src/assets/c1.webp";
import c2 from "../src/assets/c2.jpg";
import c3 from "../src/assets/c3.jpg";
import c4 from "../src/assets/c4.jpg";
const courses = [
  {
    id: 1,
    name: "Machine Learning",
    code: "CS771",
    credits: 9,
    description: "An advanced course on machine learning algorithms.",
    image: c1, // Placeholder image
  },
  {
    id: 2,
    name: "Data Structures",
    code: "ESO207",
    credits: 11,
    description: "Learn about arrays, linked lists, trees, and more.",
    image: c2, // Placeholder image
  },
  {
    id: 3,
    name: "Artificial Intelligence",
    code: "CS778",
    credits: 9,
    description:
      "Explore the fundamentals of AI, including neural networks, search algorithms, and more.",
    image: c3, // Placeholder image
  },
  {
    id: 4,
    name: "Web Development",
    code: "CS601",
    credits: 6,
    description:
      "Build full-stack web applications using modern frameworks like React and Node.js.",
    image: c4, // Placeholder image
  },
];

const LandingPage = () => {
  const [openAdd, setOpenAdd] = useState(false);
  const navigate = useNavigate();

  const handleAddCourse = () => {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      alert("Please login first to add a new course.");
      navigate("/login");
    } else {
      navigate("/courses");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      {/* Title Bar */}
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Course Helper
          </Typography>
          <Button
            color="inherit"
            onClick={() => navigate("/login")}
            style={{ marginLeft: "auto" }}
          >
            Login
          </Button>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container
        sx={{
          flexGrow: 1,
          marginTop: 4,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Grid container spacing={3}>
          {courses.map((course) => (
            <Grid item xs={12} sm={6} md={4} key={course.id}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <CardMedia
                  component="img"
                  image={course.image}
                  alt={course.name}
                  height="150"
                />
                <CardContent
                  sx={{
                    flexGrow: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    <Typography variant="h6">{course.name}</Typography>
                    <Typography variant="subtitle1">
                      Code: {course.code}
                    </Typography>
                    <Typography variant="subtitle2">
                      Credits: {course.credits}
                    </Typography>
                    <Typography variant="body2">{course.description}</Typography>
                  </div>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Footer */}
      <footer
        style={{
          padding: 16,
          backgroundColor: "#f0f0f0",
          textAlign: "center",
        }}
      >
        <Button variant="contained" color="success" onClick={handleAddCourse}>
          Add New Course
        </Button>
      </footer>
    </Box>
  );
};

export default LandingPage;

