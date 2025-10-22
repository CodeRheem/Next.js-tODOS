
"use client";
import { useState } from "react";
import { Box, Button, Typography, Paper } from "@mui/material";
import { ReactErrorTest } from "../components/reactError";
// import Navbar from "../components/navbar";
import { useRouter } from "next/navigation";

// Add metadata export for the page
export const metadata = {
  title: "Error Boundary Test | My Todo App",
  description: "Test the error boundary by triggering an error on this page.",
};

const TestError = () => {
  // State to simulate an error
  // This state is used to trigger an error when the button is clicked
  const [error, setError] = useState<boolean>(false);
  const router = useRouter();

  // Simulate an error for demonstration purposes
  if (error) {
    throw new Error("This is a test error to demonstrate the error boundary");
  }

  return (
    <>
      {/*<Navbar />*/}
      <Box className="min-h-[70vh] flex items-center justify-center p-4">
        <Paper className="p-8 max-w-2xl w-full text-center">
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            className="bg-linear-to-r from-purple-700 to-pink-600 leading-right bg-clip-text text-transparent"
          >
            Error Boundary Test Page
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            This page demonstrates how the Error Boundary component works. Click
            the button below to trigger an error.
          </Typography>

          <ReactErrorTest />

          <div className="flex flex-col justify-center items-center gap-4">
            <Button
              variant="contained"
              color="error"
              onClick={() => setError(true)}
              className="mt-4"
            >
              Trigger Error
            </Button>
            <Button
              variant="outlined"
              onClick={() => router.push("/")}
              className="mt-4 transparent border-2 border-purple-700 border-solid"
            >
              Home
            </Button>
          </div>
        </Paper>
      </Box>
    </>
  );
};

export default TestError;