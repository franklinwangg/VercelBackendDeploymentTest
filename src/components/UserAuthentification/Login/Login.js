import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import UserContext from '../../../context/UserContext';
import "./Login.css";

function Login() {

    const [enteredUsername, setEnteredUsername] = useState("");
    const [enteredPassword, setEnteredPassword] = useState("");
    const { username, setUsername } = useContext(UserContext); // Access username and setUsername from context
    const [errorMessage, setErrorMessage] = useState(""); // State to handle the error message

    const apiEndpointUrl = process.env.REACT_APP_API_URL;

    const navigate = useNavigate();

    const handleButtonClick = async () => {

        try {
            console.log(`api endpoint url : ${apiEndpointUrl}`);
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
                setErrorMessage("Sorry, your username or password is invalid."); // Set the error message
                console.log("login failed");
            }
            setEnteredUsername("");
            setEnteredPassword("");
        } catch (error) {
            console.error("Error during login:", error);
        }
    };

    const changeEnteredUsername = (event) => {
        const newUsername = event.target.value;
        setEnteredUsername(newUsername);
        printUsername(newUsername); // Call function to print the username
    };

    const changeEnteredPassword = (event) => {
        setEnteredPassword(event.target.value);
    };

    // Function to print the username
    const printUsername = (username) => {
        console.log("Entered Username: ", username);
    };

    // UseEffect to print the username right when the page is loaded
    useEffect(() => {
        printUsername(enteredUsername);  // Call the function to print username on load
    }, []);  // Empty dependency array means this runs once after the component mounts

    return (
        <div id="login-container">
            {/* Conditionally render the error message */}
            {errorMessage && <div style={{ color: "red", marginBottom: "10px" }}>{errorMessage}</div>}

            <input 
                type="text" 
                id="username" 
                value={enteredUsername} 
                placeholder="Username" 
                onChange={changeEnteredUsername} 
                autoComplete="off" // Disable autocomplete
            />
            <input 
                type="password" 
                id="password" 
                value={enteredPassword} 
                placeholder="Password" 
                onChange={changeEnteredPassword} 
                autoComplete="new-password" // Disable autocomplete for password field
            />
            <button id="login-button" onClick={handleButtonClick}>Login</button>
            <div></div>
            <Link to="/register">Register here</Link>
        </div>
    );
}

export default Login;
