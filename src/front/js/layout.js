import React, { useEffect, useContext } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
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
import LoginAdmin from "./pages/LoginAdmin";
import useScreenWidth from './hooks/useScreenWidth.jsx';
import { BottomNavbar } from "./component/bottombar.jsx";
import UserTaskList from "./component/task/user_tasks_list.jsx";
import AppliedToTaskList from "./component/task/applied_to_tasks.jsx";
import CompletedTasksList from "./component/task/completed_tasks_list.jsx";
import About from "./pages/about";
import PhoneChatList from "./pages/phone_chat_list.js";
import ProtectedRoute from "./component/protected_route.js";
import { WebSocketProvider } from "./store/webSocketContext";
import PhoneChat from "./component/chat/phone_chat.jsx";
import { PhoneTask } from "./pages/phone_task.js";
import { PhoneUser } from "./pages/phone_profile.js";

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
                    <WebSocketProvider>
                        <div className="d-flex container-fluid m-0 p-0 bg-light">
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
                                    <Route element={<ProtectedRoute element={<TaskFeed />} />} path="/tasks" />
                                    <Route element={<ProtectedRoute element={ smallDevice ? <PhoneTask /> : <Task />} />} path="/tasks/:theid" />
                                    <Route element={<ProtectedRoute element={<Applicants />} />} path="/tasks/:theid/applicants" />
                                    <Route element={<Seekers />} path="/seekers" />
                                    <Route element={ smallDevice ? <PhoneUser /> : <User /> } path="/users/:theusername" />
                                    <Route element={<LoginUser />} path="/login" />
                                    <Route element={<SignupUser />} path="/signup" />
                                    <Route element={<LoginAdmin />} path="/login-admin" />
                                    <Route element={<About />} path="/about" />
                                    <Route element={<ProtectedRoute element={<EditProfile />} />} path="/edit-profile" />
                                    { smallDevice  && <Route element={<ProtectedRoute element={<PhoneChatList />} />} path="/chats" />}
                                    { smallDevice  && <Route element={<ProtectedRoute element={<PhoneChat />} />} path="/chats/:chatid" />}
                                    {(store.user?.role === "requester" || store.user?.role === "both") && 
                                        <>
                                            <Route element={<ProtectedRoute element={<UserTaskList />} roles={["requester", "both"]} />} path="/users/:theusername/active-requests" />
                                            <Route element={<ProtectedRoute element={<CompletedTasksList role={"requester"} />} roles={["requester", "both"]} />} path="/users/:theusername/completed-requests" />
                                        </>
                                    }
                                    {(store.user?.role === "task_seeker" || store.user?.role === "both") && 
                                        <>    
                                            <Route element={<ProtectedRoute element={<AppliedToTaskList />} roles={["task_seeker", "both"]} />} path="/users/:theusername/applications" />
                                            <Route element={<ProtectedRoute element={<CompletedTasksList role={"seeker"} />} roles={["task_seeker", "both"]} />} path="/users/:theusername/completed-tasks" />
                                        </>
                                    }
                                    <Route element={<h1>Not found!</h1>} />
                                    <Route path="*" element={<Navigate to="/" />} />
                                </Routes>
                                <Footer />
                                { (store.auth && !smallDevice) && <ChatList></ChatList> }
                            </div>
                        </div>
                    </WebSocketProvider>
                </ScrollToTop>
            </BrowserRouter>
        </div>
    );
};

export default injectContext(Layout);
