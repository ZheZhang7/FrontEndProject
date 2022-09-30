import React from 'react';
import { Navigate, HashRouter, Routes, Route } from 'react-router-dom';
import Login from '../views/login/Login.js';
import Detail from '../views/news/Detail.js';
import News from '../views/news/News.js';
import NewsSandBox from '../views/sandbox/NewsSandBox.js';

export default function IndexRouter() {
    return (
        <HashRouter>
            <Routes>
                <Route path='/login' element={<Login></Login>}></Route>
                <Route path='/*' element={localStorage.getItem("token") ? <NewsSandBox></NewsSandBox> : <Navigate to='/login'></Navigate>}></Route>
                <Route path='/news' element={<News></News>}></Route>
                <Route path='/detail/:id' element={<Detail></Detail>}></Route>
            </Routes>
        </HashRouter>
    )
}