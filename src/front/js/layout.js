import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ScrollToTop from "./component/scrollToTop";
import { BackendURL } from "./component/backendURL";

import { Home } from "./pages/home";
import { Demo } from "./pages/demo";
import { User } from "./pages/user";
import { TaskFeed } from "./pages/task_feed";
import { Users } from "./pages/users";
import { Requesters } from "./pages/requesters";
import { Seekers } from "./pages/seekers";
import Addresses from "./pages/addresses";
import injectContext from "./store/appContext";
import CategoryList from "./pages/categories";
import RatingPage from "./component/rating/rating.jsx";
import AdminUserManagement from "./component/adminlogin/AdminUserManagement.jsx";
import ProtectedPage from "./component/adminlogin/ProtectedPage.jsx";



import { Navbar } from "./component/navbar";
import { Footer } from "./component/footer";
import Login from "./component/adminlogin/login.jsx";

const Layout = () => {
    const basename = process.env.BASENAME || "";

    if (!process.env.BACKEND_URL || process.env.BACKEND_URL === "") return <BackendURL />;

    return (
        <div>
            <BrowserRouter basename={basename}>
                <ScrollToTop>
                    <Navbar />
                    <Routes>
                        <Route element={<CategoryList />} path="/categories" />
                        <Route element={<Home />} path="/" />
                        <Route element={<Demo />} path="/demo" />
                        <Route element={<TaskFeed />} path="/tasks" />
                        <Route element={<Users />} path="/users" />
                        <Route element={<Requesters />} path="/requesters" />
                        <Route element={<Seekers />} path="/seekers" />
                        <Route element={<User />} path="/users/:theusername" />
                        <Route element={<Addresses />} path="/addresses" />
                        <Route element={<RatingPage />} path="/ratings" />
                        <Route element={<Login />} path="/login" />
                        <Route element={<AdminUserManagement />} path="/admin-management" /> {/* Añadir la ruta para AdminUserManagement */}
                        <Route element={<ProtectedPage />} path="/random-name" />
                        <Route element={<h1>Not found!</h1>} path="*" />
                    </Routes>
                    <Footer />
                </ScrollToTop>
            </BrowserRouter>
        </div>
    );
};

export default injectContext(Layout);
