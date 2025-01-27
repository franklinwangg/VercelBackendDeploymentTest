import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import UserContext from '../../../context/UserContext';
import "./Login.css";

function Login() {

    const [enteredUsername, setEnteredUsername] = useState("");
    const [enteredPassword, setEnteredPassword] = useState("");
    const { username, setUsername } = useContext(UserContext); // Access username and setUsername from context

    const apiEndpointUrl = process.env.REACT_APP_API_URL;

    const navigate = useNavigate();

    const handleButtonClick = async () => {

        try {
            // fetch(`${apiEndpointUrl}/api/users?action=login`)

            // const response = await fetch("https://vercel-backend-deployment-test-d24q.vercel.app/api/users?action=login", {
            const response = await fetch(`${apiEndpointUrl}/api/users?action=login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: enteredUsername,
                    password: enteredPassword,
                }),
            });

            const responseJSON = await response.json();

            if (responseJSON.success === true) {
                setUsername(enteredUsername);
                navigate("/");
            } else {
                console.log("login failed");
            }
        } catch (error) {
            console.error("Error during login:", error);
        }
    };


    const changeEnteredUsername = (event) => {
        setEnteredUsername(event.target.value);
    };
    const changeEnteredPassword = (event) => {
        setEnteredPassword(event.target.value);
    };

    return (
        <div id="login-container">
            <input type="text" id="username" value={enteredUsername} placeholder="Username" onChange={changeEnteredUsername}></input>
            <input type="text" id="password" value={enteredPassword} placeholder="Password" onChange={changeEnteredPassword}></input>
            <button id="login-button" onClick={handleButtonClick}>Login</button>
            <div></div>
            <Link to="/register">Register here</Link>
        </div>
    );
}

export default Login;