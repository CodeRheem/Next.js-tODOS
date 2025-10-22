"use client";

import { useEffect } from "react";
import { Button, Typography, Box, Paper } from "@mui/material";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Global error caught:", error);
  }, [error]);

  return (
    <html>
      <body>
        <div
          style={{
            minHeight: "100vh",
            background: "linear-gradient(135deg, #e0cbda 0%, #9f54d6 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
          }}
        >
          <Paper
            elevation={3}
            sx={{
              p: 4,
              textAlign: "center",
              maxWidth: 600,
              width: "100%",
            }}
          >
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              sx={{
                background: "linear-gradient(to right, #7c3aed, #ec4899)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                color: "transparent",
                fontFamily: "Playfair Display, serif",
                mb: 3,
              }}
            >
              Oops! Something went wrong
            </Typography>
            
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ mb: 3, fontFamily: "Playfair Display, serif" }}
            >
              We encountered an unexpected error. Don&apos;t worry, our team has been notified.
            </Typography>

            {process.env.NODE_ENV === "development" && (
              <Box
                sx={{
                  mb: 3,
                  p: 2,
                  bgcolor: "#f5f5f5",
                  borderRadius: 1,
                  textAlign: "left",
                  fontFamily: "monospace",
                  fontSize: "0.875rem",
                  color: "#d32f2f",
                  overflow: "auto",
                }}
              >
                <Typography variant="body2" component="pre">
                  {error.message}
                </Typography>
              </Box>
            )}

            <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
              <Button
                variant="contained"
                onClick={reset}
                sx={{
                  bgcolor: "#7c3aed",
                  "&:hover": {
                    bgcolor: "#6d28d9",
                  },
                  fontFamily: "Playfair Display, serif",
                }}
              >
                Try Again
              </Button>
              
              <Button
                variant="outlined"
                href="/"
                sx={{
                  color: "#7c3aed",
                  borderColor: "#7c3aed",
                  "&:hover": {
                    borderColor: "#6d28d9",
                    bgcolor: "rgba(124, 58, 237, 0.04)",
                  },
                  fontFamily: "Playfair Display, serif",
                }}
              >
                Go Home
              </Button>
            </Box>
          </Paper>
        </div>
      </body>
    </html>
  );
}