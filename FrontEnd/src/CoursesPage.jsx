import React, { useState, useEffect } from "react";
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
import axios from "axios";

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [openEdit, setOpenEdit] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [newCourse, setNewCourse] = useState({
    name: "",
    code: "",
    credit: "", // Update to match database schema
    description: "",
    image: "", // Update to match database schema
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await axios.get("http://localhost:5000/api/courses", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCourses(response.data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, [navigate]);

  const handleEditClick = (course) => {
    setSelectedCourse(course);
    setOpenEdit(true);
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
    setSelectedCourse(null);
  };

  const handleAddCourse = () => {
    setOpenAdd(true);
  };

  const handleCloseAdd = () => {
    setOpenAdd(false);
    setNewCourse({ name: "", code: "", credit: "", description: "", image: "" }); // Update to match database schema
  };

  const handleAddNewCourse = async () => {
    const token = localStorage.getItem("jwtToken");
    try {
      const response = await axios.post("http://localhost:5000/api/courses", newCourse, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCourses([...courses, response.data]);
      handleCloseAdd();
    } catch (error) {
      console.error("Error adding course:", error);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    const token = localStorage.getItem("jwtToken");
    try {
      await axios.delete(`http://localhost:5000/api/courses/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCourses(courses.filter((course) => course.id !== courseId));
    } catch (error) {
      console.error("Error deleting course:", error);
    }
  };

  const handleUpdateCourse = async () => {
    const token = localStorage.getItem("jwtToken");
    try {
      const response = await axios.put(
        `http://localhost:5000/api/courses/${selectedCourse.id}`,
        selectedCourse,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCourses(
        courses.map((course) =>
          course.id === selectedCourse.id ? response.data : course
        )
      );
      handleCloseEdit();
    } catch (error) {
      console.error("Error updating course:", error);
    }
  };

  const handleViewClick = (course) => {
    setSelectedCourse(course);
    setOpenView(true);
  };

  const handleCloseView = () => {
    setOpenView(false);
    setSelectedCourse(null);
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
            My Courses
          </Typography>
          <Button
            color="inherit"
            onClick={() => {
              localStorage.removeItem("jwtToken");
              navigate("/login");
            }}
            style={{ marginLeft: "auto" }}
          >
            Logout
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
                  transition: "transform 0.3s",
                  "&:hover": {
                    transform: "scale(1.05)",
                  },
                }}
              >
                <CardMedia
                  component="img"
                  image={course.image || "default-image-url.jpg"}
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
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    sx={{ marginTop: 1 }}
                    onClick={() => handleEditClick(course)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    size="small"
                    sx={{ marginTop: 1 }}
                    onClick={() => handleDeleteCourse(course.id)}
                  >
                    Delete
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    size="small"
                    sx={{ marginTop: 1 }}
                    onClick={() => handleViewClick(course)}
                  >
                    View
                  </Button>
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

      {/* Edit Course Dialog */}
      <Dialog open={openEdit} onClose={handleCloseEdit}>
        <DialogTitle>Edit Course Details</DialogTitle>
        <DialogContent>
          {selectedCourse && (
            <>
              <TextField
                fullWidth
                label="Course Name"
                value={selectedCourse.name}
                onChange={(e) =>
                  setSelectedCourse((prev) => ({ ...prev, name: e.target.value }))
                }
                margin="normal"
              />
              <TextField
                fullWidth
                label="Course Code"
                value={selectedCourse.code}
                onChange={(e) =>
                  setSelectedCourse((prev) => ({ ...prev, code: e.target.value }))
                }
                margin="normal"
              />
              <TextField
                fullWidth
                label="Credits"
                value={selectedCourse.credit} // Ensure correct field name
                onChange={(e) =>
                  setSelectedCourse((prev) => ({ ...prev, credit: e.target.value })) // Ensure correct field name
                }
                margin="normal"
              />
              <TextField
                fullWidth
                label="Description"
                value={selectedCourse.description}
                onChange={(e) =>
                  setSelectedCourse((prev) => ({ ...prev, description: e.target.value }))
                }
                margin="normal"
              />
              <TextField
                fullWidth
                label="Image URL"
                value={selectedCourse.image} // Ensure correct field name
                onChange={(e) =>
                  setSelectedCourse((prev) => ({ ...prev, image: e.target.value })) // Ensure correct field name
                }
                margin="normal"
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="primary" onClick={handleUpdateCourse}>
            Update
          </Button>
          <Button variant="contained" color="error" onClick={handleCloseEdit}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add New Course Dialog */}
      <Dialog open={openAdd} onClose={handleCloseAdd}>
        <DialogTitle>Add New Course</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Course Name"
            value={newCourse.name}
            onChange={(e) =>
              setNewCourse((prev) => ({ ...prev, name: e.target.value }))
            }
            margin="normal"
          />
          <TextField
            fullWidth
            label="Course Code"
            value={newCourse.code}
            onChange={(e) =>
              setNewCourse((prev) => ({ ...prev, code: e.target.value }))
            }
            margin="normal"
          />
          <TextField
            fullWidth
            label="Credits"
            value={newCourse.credit} // Ensure correct field name
            onChange={(e) =>
              setNewCourse((prev) => ({ ...prev, credit: e.target.value })) // Ensure correct field name
            }
            margin="normal"
          />
          <TextField
            fullWidth
            label="Description"
            value={newCourse.description}
            onChange={(e) =>
              setNewCourse((prev) => ({ ...prev, description: e.target.value }))
            }
            margin="normal"
          />
          <TextField
            fullWidth
            label="Image URL"
            value={newCourse.image} // Ensure correct field name
            onChange={(e) =>
              setNewCourse((prev) => ({ ...prev, image: e.target.value })) // Ensure correct field name
            }
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="success"
            onClick={handleAddNewCourse}
          >
            Add
          </Button>
          <Button variant="contained" color="error" onClick={handleCloseAdd}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Course Dialog */}
      <Dialog open={openView} onClose={handleCloseView}>
        <DialogTitle>Course Details</DialogTitle>
        <DialogContent>
          {selectedCourse && (
            <>
              <Typography variant="h6">{selectedCourse.name}</Typography>
              <Typography variant="subtitle1">Code: {selectedCourse.code}</Typography>
              <Typography variant="subtitle2">Credits: {selectedCourse.credits}</Typography>
              <Typography variant="body2">Description: {selectedCourse.description}</Typography>
              <Typography variant="body2">Image URL: {selectedCourse.image || "No image available"}</Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="primary" onClick={handleCloseView}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CoursesPage;
