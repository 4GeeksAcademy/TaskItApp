import React, { useEffect, useContext } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ScrollToTop from "./component/scrollToTop";
import { BackendURL } from "./component/backendURL";
import { Home } from "./pages/home";
import { User } from "./pages/user";
import { TaskFeed } from "./pages/tasks";
import { Seekers } from "./pages/seekers";
import { Task } from "./pages/task.js";
import injectContext from "./store/appContext";
import CategoryList from "./pages/categories";
import { Navbar } from "./component/navbar";
import { Footer } from "./component/footer";
import LoginUser from "./pages/login_user";
import SignupUser from "./pages/signup_user";
import { Context } from "./store/appContext"; 
import { Category } from "./pages/category.js";
import { SidebarComponent } from "./component/sidebar.js";
import { Applicants } from "./pages/applicants.js";
import EditProfile from "./pages/edit_profile";
import ChatList from "./component/chat/chat_list.jsx";
import SignupAdmin from "./pages/SignupAdmin";
import LoginAdmin from "./pages/LoginAdmin";
import useScreenWidth from './hooks/useScreenWidth.jsx';
import { BottomNavbar } from "./component/bottombar.jsx";
import UserTaskList from "./component/task/user_tasks_list.jsx";
import AppliedToTaskList from "./component/task/applied_to_tasks.jsx";
import CompletedTasksList from "./component/task/completed_tasks_list.jsx";


const Layout = () => {
    const basename = process.env.BASENAME || "";
    const { store, actions } = useContext(Context);
    const smallDevice = useScreenWidth();


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
                        { store.auth &&  ( smallDevice 
                            ? <BottomNavbar></BottomNavbar>
                            :  <SidebarComponent></SidebarComponent>
                        )}
                        <div className="w-100">
                            <Navbar />
                            <Routes>
                                <Route element={<Home />} path="/" />
                                <Route element={<CategoryList />} path="/categories" />
                                <Route element={<Category />} path="/categories/:thecategory" />
                                <Route element={<TaskFeed />} path="/tasks" />
                                <Route element={<Category />} path="/categories/:thecategory" />
                                <Route element={<Task />} path="/tasks/:theid" />
                                <Route element={<Applicants />} path="/tasks/:theid/applicants" />
                                <Route element={<Seekers />} path="/seekers" />
                                <Route element={<User />} path="/users/:theusername" />
                                <Route element={<LoginUser />} path="/login-user" />
                                <Route element={<SignupUser />} path="/signup-user" />
                                <Route element={<SignupAdmin />} path="/signup-admin" />
                                <Route element={<LoginAdmin />} path="/login-admin" />
                                <Route element={<EditProfile />} path="/edit-profile" />
                                {(store.user?.role == "requester" || store.user?.role == "both") && 
                                    <>
                                        <Route element={<UserTaskList />} path="/users/:theusername/my-tasks" />
                                        <Route element={<CompletedTasksList role={"requester"} />} path="/users/:theusername/requested-completed-tasks" />
                                    </>
                                }
                                {(store.user?.role == "task_seeker" || store.user?.role == "both") && 
                                    <>	
                                        <Route element={<AppliedToTaskList />} path="/users/:theusername/applied-to-tasks" />
                                        <Route element={<CompletedTasksList role={"seeker"} />} path="/users/:theusername/completed-tasks" />
                                    </>
                                }
                                <Route element={<h1>Not found!</h1>} />
                            </Routes>
                            <Footer />
                            { (store.auth && !smallDevice) && <ChatList></ChatList> }
                        </div>
                    </div>
                </ScrollToTop>
            </BrowserRouter>
        </div>
    );
};

export default injectContext(Layout);
