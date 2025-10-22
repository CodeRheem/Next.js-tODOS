"use client";

import Navbar from "../../components/navbar";
import TestError from "../error";
import Head from "next/head";

export default function TestErrorPage() {
  return (
    <>
      <Head>
        <title>Test Error | My Todo App</title>
      </Head>
      <Navbar />
      <TestError />
    </>
  );
}