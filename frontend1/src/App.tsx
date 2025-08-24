import React from "react";
import HomePage from "./pages/HomePage";
import GeneratorPage from "./pages/GeneratorPage";
import PreviewPage from "./pages/PreviewPage";
import Layout from "./components/Layout";
import {
  SignedIn,
  SignedOut,
  RedirectToSignIn,
  SignIn,
  SignUp,
} from "@clerk/clerk-react";
import Dashboard from "./pages/Dashboard";
// import Home from "./pages/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    // <Layout>
    //   <Routes>
    //     <Route path="/" element={<HomePage />} />
    //     <Route path="/generator" element={<GeneratorPage />} />
    //     <Route path="/preview" element={<PreviewPage />} />
    //   </Routes>
    // </Layout>

    <Routes>
      {/* Public Route */}
      <Route
        path="/"
        element={
          <Layout>
            <HomePage />
          </Layout>
        }
      />
      {/* <Route
          path="/sign-in/*"
          element={<SignIn routing="path" path="/sign-in" />}
          />
          <Route
          path="/sign-up/*"
          element={<SignUp routing="path" path="/sign-up" />}
          /> */}

      {/* Protected Route */}
      <Route
        path="/dashboard"
        element={
          <>
            <SignedIn>
              <Dashboard />
            </SignedIn>
            <SignedOut>
              <RedirectToSignIn />
            </SignedOut>
          </>
        }
      />

      <Route
        path="/generate"
        element={
          <>
            <SignedIn>
              <Layout>
                <GeneratorPage />
              </Layout>
            </SignedIn>
            <SignedOut>
              <RedirectToSignIn />
            </SignedOut>
          </>
        }
      />
    </Routes>
  );
}

export default App;
