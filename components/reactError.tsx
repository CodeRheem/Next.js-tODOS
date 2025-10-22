
"use client";

import { useState } from "react";
import { Button } from "@mui/material";

export function ReactErrorTest() {
  const [shouldError, setShouldError] = useState(false);

  if (shouldError) {
    throw new Error(
      "This is a React component error! (Caught by ErrorFallback)",
    );
  }

  return (
    <div className="p-4 border rounded mb-4">
      <h3 className="text-lg font-bold mb-2">React Error Boundary Test</h3>
      <Button
        variant="contained"
        color="error"
        onClick={() => setShouldError(true)}
      >
        Trigger React Error
      </Button>
    </div>
  );
}