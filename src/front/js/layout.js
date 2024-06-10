import React, { useEffect, useContext } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ScrollToTop from "./component/scrollToTop";
import { BackendURL } from "./component/backendURL";
import { Home } from "./pages/home";
import { User } from "./pages/user";
import { TaskFeed } from "./pages/tasks";
import { Users } from "./pages/users";
import { Requesters } from "./pages/requesters";
import { Seekers } from "./pages/seekers";
import { Task } from "./pages/task.js";
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
import { Context } from "./store/appContext"; 
import { Category } from "./pages/category.js";
import { SidebarComponent } from "./component/sidebar.js";
import { Applicants } from "./pages/applicants.js";
import EditProfile from "./pages/edit_profile";
import ChatList from "./component/chat/chat_list.jsx";
import SignupAdmin from "./pages/SignupAdmin";
import LoginAdmin from "./pages/LoginAdmin";
import About from "./pages/about"


const Layout = () => {
    const basename = process.env.BASENAME || "";
    const { store, actions } = useContext(Context);

    useEffect(() => {
        // Verifica el token almacenado cuando la aplicación se carga
        const token = localStorage.getItem('admin_access_token');
        if (token) {
            actions.validateAdminToken();
        }
    }, []);

    useEffect(() => {
        actions.validateToken();
    }, []);



    if (!process.env.BACKEND_URL || process.env.BACKEND_URL === "") return <BackendURL />;

    return (
        <div>
            <BrowserRouter basename={basename}>
                <ScrollToTop>
                    <div className="d-flex container-fluid m-0 p-0">
                        { store.auth && <SidebarComponent></SidebarComponent> }
                        <div className="w-100">
                            <Navbar />
                            <Routes>
                                <Route element={<Home />} path="/" />
                                <Route element={<CategoryList />} path="/categories" />
                                <Route element={<Category />} path="/categories/:thecategory" />
                                <Route element={<Home />} path="/" />
                                <Route element={<TaskFeed />} path="/tasks" />
                                <Route element={<Category />} path="/categories/:thecategory" />
                                <Route element={<Task />} path="/tasks/:theid" />
                                <Route element={<Applicants />} path="/tasks/:theid/applicants" />
                                <Route element={<Users />} path="/users" />
                                <Route element={<Requesters />} path="/requesters" />
                                <Route element={<Seekers />} path="/seekers" />
                                <Route element={<User />} path="/users/:theusername" />
                                <Route element={<Addresses />} path="/addresses" />
                                <Route element={<RatingPage />} path="/ratings" />
                                <Route element={<Postulants />} path="/postulants" />
                                <Route element={<LoginUser />} path="/login-user" />
                                <Route element={<SignupUser />} path="/signup-user" />
                                <Route element={<SignupAdmin />} path="/signup-admin" />
                                <Route element={<LoginAdmin />} path="/login-admin" />
                                <Route element={<UserPanel />} path="/user-panel" />
                                <Route element={<EditProfile />} path="/edit-profile" />
                                <Route element={<About />} path="/about" />
                                <Route element={<h1>Not found!</h1>} />
                            </Routes>
                            <Footer />
                            { store.auth && <ChatList></ChatList> }
                        </div>
                    </div>
                </ScrollToTop>
            </BrowserRouter>
        </div>
    );
};

export default injectContext(Layout);
