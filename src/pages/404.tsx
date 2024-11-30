import { useState } from "react";
import Head from "next/head";

const NotFound: React.FC = () => {
  return (
    <>
      <Head>
        <title>Page Not Found</title>
      </Head>
      <div className="h-screen w-screen bg-gray-900">
        <div className="h-full w-full max-w-screen-lg bg-gray-800 shadow-lg rounded-lg flex flex-col mx-auto">
          {/* Title Bar */}
          <div className="bg-gray-700 px-4 py-2 flex items-center justify-between border-b border-gray-600">
            <div className="flex space-x-2">
              <span className="w-3 h-3 bg-red-500 rounded-full"></span>
              <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
              <span className="w-3 h-3 bg-green-500 rounded-full"></span>
            </div>
            <h1 className="font-semibold text-white">WikiBrowse</h1>
          </div>

          {/* 404 Message */}
          <div className="flex-grow p-6 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">This page has either been deleted or does not exist.</h2>
            <p className="text-white mb-4">The page you're looking for could not be found. Please check the URL or go back to the homepage.</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotFound;
