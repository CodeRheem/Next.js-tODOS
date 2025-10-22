"use client";
import Link from "next/link";
import Head from "next/head";

function DynamicHead() {
  return (
    <Head>
      <title>404 Not Found | My Todo App</title>
      <meta
        name="description"
        content="The page you are looking for does not exist."
      />
    </Head>
  );
}

const NotFound = () => {
  // Set the page title using the dynamic head component
  DynamicHead();
  // Return the Not Found page

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-6xl font-bold text-shadow-gray-800 mb-4 font-serif bg-linear-to-r from-purple-700 to-pink-600 leading-right bg-clip-text text-transparent">
          404
        </h1>
        <h2 className="text-2xl font-semibold text-shadow-gray-600 mb-4 font-serif bg-linear-to-r from-purple-700 to-pink-600 leading-right bg-clip-text text-transparent">
          Page Not Found
        </h2>
        <p className="text-gray-500 mb-6 font-serif text-xl">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-block bg-purple-900 text-white px-6 py-2 rounded-md hover:bg-purple-600 font-serif"
        >
          Go Back Home
        </Link>
      </div>
    </section>
  );
};

export default NotFound;