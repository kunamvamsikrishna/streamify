import { Routes, Route, Navigate } from "react-router";
import Homepage from "./pages/Homepage.jsx";
import Loginpage from "./pages/Loginpage.jsx";
import Notifications from "./pages/Notifications.jsx";
import Chatpage from "./pages/Chatpage.jsx";
import Signup from "./pages/Signup.jsx";
import Callpage from "./pages/Callpage.jsx";
import Onboarding from "./pages/Onboarding.jsx";
import { Toaster } from "react-hot-toast";
import useAuthUser from "./hooks/useauth.js";
import PageLoader from "./components/PageLoader.jsx";
import Layout from "./components/Layout.jsx";
import { useState } from "react";
import {usetheme} from "./store/usetheme.js"

export default function App() {
  const { isLoading, authUser, error } = useAuthUser();
  const {theme} = usetheme();
  const isAuthenticated = Boolean(authUser);
  const isonboarded = authUser?.isonboarded;
  
  console.log("App State:", { isLoading, authUser, error, isAuthenticated, isonboarded });
  console.log("API URL:", import.meta.env.VITE_API_URL || "http://localhost:5001/api");
  console.log("Current path:", window.location.pathname);

  // Show loader while checking authentication
  if (isLoading) return <PageLoader />;
  return (
    <>
      <div className="h-screen" data-theme={theme}>
        <Routes>
          <Route
            path="/"
            element={
              isAuthenticated && isonboarded ? (
                <Layout showsidebar={true}><Homepage /></Layout>
              ) : (
                <Navigate to={isAuthenticated ? "/onboarding" : "/login"} />
              )
            }
          />
          <Route
            path="/signup"
            element={
              !isAuthenticated ? (
                <Signup />
              ) : (
                <Navigate to={isonboarded ? "/" : "/onboarding"} />
              )
            }
          />
          <Route
            path="/login"
            element={
              !isAuthenticated ? (
                <Loginpage />
              ) : (
                <Navigate to={isonboarded ? "/" : "/onboarding"} />
              )
            }
          />

          <Route
            path="/notifications"
            element={
              isAuthenticated && isonboarded ? (
                <Layout showSidebar={true}>
                  <Notifications />
                </Layout>
              ) : (
                <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
              )
            }
          />
          <Route
            path="/call/:id"
            element={
              isAuthenticated && isonboarded ? (
                <Layout showSidebar={false}>
                  <Callpage />
                </Layout>
              ) : (
                <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
              )
            }
          />
          <Route
            path="/chat/:id"
            element={
              isAuthenticated && isonboarded ? (
                <Layout showSidebar={false}>
                  <Chatpage />
                </Layout>
              ) : (
                <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
              )
            }
          />
          <Route
            path="/onboarding"
            element={
              isAuthenticated ? (
                !isonboarded ? (
                  <Onboarding />
                ) : (
                  <Navigate to="/" />
                )
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          {/* Catch-all route for debugging */}
          <Route
            path="*"
            element={
              <div className="min-h-screen flex items-center justify-center bg-base-100">
                <div className="text-center">
                  <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
                  <p className="mb-4">Path: {window.location.pathname}</p>
                  <p className="mb-4">Auth Status: {isAuthenticated ? "Logged In" : "Not Logged In"}</p>
                  <p className="mb-4">Onboarded: {isonboarded ? "Yes" : "No"}</p>
                  <button 
                    className="btn btn-primary"
                    onClick={() => window.location.href = "/"}
                  >
                    Go Home
                  </button>
                </div>
              </div>
            }
          />
        </Routes>
        <Toaster />
      </div>
    </>
  );
}
