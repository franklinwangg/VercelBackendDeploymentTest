import React, { useState, useEffect } from 'react';
import "./CreatePost.css";

import { Link } from 'react-router-dom';


function CreatePost() {

    const [title, setTitle] = useState("");
    const [content, setcontent] = useState("");
    const [image, setImage] = useState(null);

    useEffect(() => {
        // This will run every time `image` is updated
        if (image) {
            console.log("final image : ", image);
        }
    }, [image]);

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };


    const handleCreatePostButtonClick = async () => {
        // two fetch methods?
        // first fetch method 1) sends in the title and content to database, 2) initializes the multer instance
        // await fetch("http://localhost:3000/api/posts/createPostTitleAndContent", {
        let postIdVar;

        await fetch("https://vercel-backend-deployment-test-d24q.vercel.app/api/createPostTitleAndContent", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title: title,
                content: content,
            })
        })
        .then((response) => {
            const jsonResponse = response.json();
            return jsonResponse;
        })
        .then((data) => {
            postIdVar = data.postId;
        })

        const formData = new FormData();

        if (image) {
            formData.append("image", image); // Append the image file

            formData.append("postId", postIdVar); // Append the image file            
        }
        else {}

        // second fetch method uploads the image using the multer instance
        await fetch("https://vercel-backend-deployment-test-d24q.vercel.app/api/createPostImage", {
            method: "POST",
            body: formData,
        })


    };

    const changeTitle = (event) => {
        setTitle(event.target.value);
    };
    const changecontent = (event) => {
        setcontent(event.target.value);
    };

    function adjustHeight(event) {
        const textarea = event.target;
        textarea.style.height = 'auto'; // Reset height
        textarea.style.height = `${textarea.scrollHeight}px`; // Set height to scrollHeight
    }



    return (
        <div className="container">
            <input
                id="create-new-post-title-input"
                placeholder="Title"
                onChange={changeTitle}
            ></input>
            <textarea
                id="create-new-post-content-input"
                placeholder="Content"
                onChange={changecontent}
                onInput={adjustHeight}
            ></textarea>
            <input type="file" id="image-input" accept="image/*" onChange={handleImageChange} required>

            </input>

            <button
                id="create-new-post-submit-button"
                onClick={handleCreatePostButtonClick}
            >
                Create New Post
            </button>
        </div>
    );

}

export default CreatePost;
