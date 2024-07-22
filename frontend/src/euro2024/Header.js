import React from "react";
import { Button } from '@mui/material';
import { useNavigate } from "react-router-dom";
import "./Header.css";

const Header = () => {

    const navigate = useNavigate();

    const logout = () => {
        if(localStorage.getItem("gameLost") !== null) gameOver();
        localStorage.clear();
        navigate("/login");
    }

    const gameOver = () => {
        const patch = async () => {
          await fetch(`http://localhost:8080/game/${localStorage.getItem("loggedUserID")}`, { method:"PATCH" })
                .then((res)=>res.json())
                .catch((err)=>console.log(err));
        }
        patch();
      }

    return (
        <div>
        {
            (localStorage.getItem("loggedUserName") !== null) ? 
                <header>
                    <nav className="header-nav">
                        <ul className="header-ul">
                            <li><strong>Welcome, {localStorage.getItem("loggedUserName")}</strong></li>
                            <li><Button onClick={logout} type="submit" variant="contained">Logout</Button></li>
                        </ul>
                    </nav>
                </header>
                : ""
        }
        </div>
    )
}

export default Header;