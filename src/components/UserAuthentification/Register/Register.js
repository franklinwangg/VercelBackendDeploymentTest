import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./Register.css";

function Register() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();
    

    const apiEndpointUrl = process.env.REACT_APP_API_URL;


    const handleButtonClick = async (event) => {
        try {
            fetch(`${apiEndpointUrl}/api/users/`, {
            // fetch("https://vercel-backend-deployment-test-d24q.vercel.app/api/users/", {
                    method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            })
            navigate("/login");
        }
        catch (error) {
            console.log("Error : ", error);
        }
    };

    const changeUsername = (event) => {
        setUsername(event.target.value);
    };
    const changePassword = (event) => {
        setPassword(event.target.value);
    };

    return (
        <div id="register-container">

            <h1>Register Page</h1>

            <form>
                <input type="text" id="username" value={username} placeholder="Username" onChange={changeUsername}></input>
                <input type="text" id="password" value={password} placeholder="Password" onChange={changePassword}></input>
                <button id="register-button" onClick={handleButtonClick}>Register</button>
            </form>
        </div>
    );
}

export default Register;