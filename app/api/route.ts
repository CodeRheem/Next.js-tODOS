



import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions); // Initialize NextAuth with authOptions

export { handler as GET, handler as POST }; // Export the handler for GET and POST requests