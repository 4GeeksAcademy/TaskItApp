import React, { useEffect, useContext } from "react";
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
import { Navbar } from "./component/navbar";
import { Footer } from "./component/footer";
import Postulants from "./pages/postulants";
import LoginUser from "./pages/login_user";
import SignupUser from "./pages/signup_user";
import UserPanel from "./pages/user_panel";
import { Context } from "./store/appContext"; // Importa el contexto

const Layout = () => {
    const basename = process.env.BASENAME || "";
    const { actions } = useContext(Context); // Usa el contexto para acceder a las acciones

    useEffect(() => {
        actions.validateToken();
    }, []);

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
                        <Route element={<Postulants />} path="/postulants" />
                        <Route element={<LoginUser />} path="/login-user" />
                        <Route element={<SignupUser />} path="/signup-user" />
                        <Route element={<UserPanel />} path="/user-panel" />
                        <Route element={<h1>Not found!</h1>} />
                    </Routes>
                    <Footer />
                </ScrollToTop>
            </BrowserRouter>
        </div>
    );
};

export default injectContext(Layout);
