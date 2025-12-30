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
  const { isLoading, authUser } = useAuthUser();
  const {theme} = usetheme();
  // const [authuser,setauthuser] = useState(auth1user)
  const isAuthenticated = Boolean(authUser);
  const isonboarded = authUser?.isonboarded;
  console.log("authUser", authUser);

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
        </Routes>
        <Toaster />
      </div>
    </>
  );
}
