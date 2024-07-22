import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';

import Registration from './euro2024/Registration';
import Login from './euro2024/Login';
import PickTeam from './euro2024/PickTeam';
import Draw from './euro2024/Draw';
import Header from './euro2024/Header';
import CreateTeam from './euro2024/CreateTeam';
import { Routes, Route, Navigate, BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(

  <React.StrictMode>
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path='/' element={<Navigate to='/login' />}></Route>
        <Route path='/login' exact element={<Login />}></Route>
        <Route path='/registration' exact element={<Registration />}></Route>
        <Route path='/pickTeam' exact element={(localStorage.getItem("loggedUserName") !== null) ? <PickTeam /> : <Navigate to='/login'/>}></Route>
        <Route path='/draw' exact element={(localStorage.getItem("loggedUserName") !== null) ? <Draw /> : <Navigate to='/login'/>}></Route>
        <Route path='/createTeam' exact element={(localStorage.getItem("loggedUserName") !== null) ? <CreateTeam /> : <Navigate to='/login'/>}></Route>
      </Routes>
    </BrowserRouter> 
  </React.StrictMode>

);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
