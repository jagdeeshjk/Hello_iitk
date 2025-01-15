import React from "react";
import { Card, CardContent, Typography, Button } from "@mui/material";

const CourseDetailCard = ({ course, onViewDetails }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6">{course.title}</Typography>
        <Typography variant="body2" color="textSecondary">
          {course.description}
        </Typography>
        <Button variant="contained" color="primary" onClick={() => onViewDetails(course)}>
          View Details
        </Button>
      </CardContent>
    </Card>
  );
};

export default CourseDetailCard;
