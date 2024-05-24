import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ScrollToTop from "./component/scrollToTop";
import { BackendURL } from "./component/backendURL";

import { Home } from "./pages/home";
import { Demo } from "./pages/demo";
import { Single } from "./pages/single";
import { TaskFeed } from "./pages/task_feed";
import { Users } from "./pages/users";
import Addresses from "./pages/addresses";
import injectContext from "./store/appContext";
import CategoryList from "./pages/categories";

import { Navbar } from "./component/navbar";
import { Footer } from "./component/footer";

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
                        <Route element={<TaskFeed />} path="/task-feed" />
                        <Route element={<Users />} path="/users" />
                        <Route element={<Single />} path="/single/:theid" />
                        <Route element={<Addresses />} path="/addresses" />
                        <Route element={<h1>Not found!</h1>} />
                        
                    </Routes>
                    <Footer />
                </ScrollToTop>
            </BrowserRouter>
        </div>
    );
};

export default injectContext(Layout);
