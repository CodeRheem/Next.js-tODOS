"use client";
import { Box, Typography, Button, Stack } from "@mui/material";
import { useRouter } from "next/navigation";
import Navbar from "@/components/navbar";
import { AuthButtons } from "@/components/authButton";
import { NextAuthTest } from "@/components/simpleAuth";
import {useSession} from "next-auth/react";

import Head from "next/head";

function DynamicHead() {
  return (
    <Head>
      <title>Welcome | My Todo App</title>
      <meta
        name="description"
        content="Welcome to My Todo App. Organize your tasks efficiently."
      />
    </Head>
  );
}

const WelcomePage = () => {
  const router = useRouter();
  const { data: session } = useSession();

  return (
    <>
      <DynamicHead />
      <Navbar />
      {/* Main Content */}
      <Box
        sx={{
          height: "50vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          padding: 3,
          textAlign: "center",
        }}
      >
        <Typography
          variant="h2"
          component="h1"
          sx={{
            fontFamily: " serif",
            fontWeight: "bold",
            color: "#9f54d6",
            marginBottom: 4,
            background:
              "linear-gradient(135deg,rgb(242, 88, 204) 0%,rgb(67, 8, 109) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Welcome to My Todo App
        </Typography>
        <Stack
          spacing={2}
          direction="column"
          alignItems="center"
          sx={{ mt: 2 }}
        >
          <Typography
            variant="h5"
            component="h3"
            sx={{
              fontFamily: " serif",
              fontWeight: "medium",
              color: "#9f54d6",
              marginBottom: 4,
              background:
                " linear-gradient(135deg, rgb(242, 88, 204) 0%, rgb(67, 8, 109) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Start Curating Your Todo List
          </Typography>
          <AuthButtons />
          {session && (
            <Button
              variant="contained"
              size="large"
              onClick={() => router.push("/todos")}
              sx={{
                bgcolor: "#7127b5",
                "&:hover": {
                  bgcolor: "#551c89",
                },
                fontFamily: " serif",
                fontSize: "1.1rem",
                padding: "12px 24px",
                textTransform: "none",
              }}
            >
              Your Todo List
            </Button>
          )}
          <Button
            onClick={() => router.push("/test-error")}
            variant="outlined"
            color="error"
            sx={{ fontFamily: "Playfair Display, serif" }}
          >
            Test Error Boundary
          </Button>
          <Button
            onClick={() => router.push("/not-found")}
            variant="outlined"
            color="secondary"
            sx={{ fontFamily: " serif" }}
          >
            Test 404 Page
          </Button>
        </Stack>
      </Box>
      <NextAuthTest />
    </>
  );
};

export default WelcomePage;