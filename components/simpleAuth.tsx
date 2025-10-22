"use client";

import { useSession } from "next-auth/react";
import { Typography } from "@mui/material";

export function NextAuthTest() {
  const { data: session, status } = useSession();

  return (
    <div className="p-[20px] mx-[20px] font-sans">
      <Typography
        sx={{
          fontWeight: "bold",
          color: "#9f54d6",
          background:
            "linear-gradient(135deg,rgb(242, 88, 204) 0%,rgb(67, 8, 109) 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        NextAuth Debug Info
      </Typography>
      <div>
        <strong
          style={{
            background:
              "linear-gradient(135deg,rgb(242, 88, 204) 0%,rgb(67, 8, 109) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Status:
        </strong>{" "}
        {status}
      </div>
      <div>
        <strong
          style={{
            background:
              "linear-gradient(135deg,rgb(242, 88, 204) 0%,rgb(67, 8, 109) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Session:
        </strong>
      </div>
      <pre
        style={{ background: "#d720d123", padding: "10px", fontSize: "12px" }}
      >
        {JSON.stringify(session, null, 2)}
      </pre>
    </div>
  );
}