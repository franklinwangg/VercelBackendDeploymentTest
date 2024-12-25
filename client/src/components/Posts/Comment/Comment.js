
import React, { useState, useContext, useEffect, useRef } from 'react';
import "./Comment.css";
import { useLocation } from 'react-router-dom';

import UserContext from '../../../context/UserContext';
import Post from '../Post/Post';



const Comment = (props) => {
    const [replyCommentToPost, setReplyCommentToPost] = useState("");
    const [showReplyButton, setShowReplyButton] = useState(false);

    const { username, setUsername } = useContext(UserContext);
    const location = useLocation();

    const replyBoxRef = useRef(null);



    useEffect(() => {
        const handleClickOutside = (event) => {
            if (replyBoxRef.current && !replyBoxRef.current.contains(event.target)) {
                setShowReplyButton(false); // Hide reply box when clicking outside
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const changeReplyCommentToPost = (event) => {
        setReplyCommentToPost(event.target.value);
    };

    const handleClickReplyButton = () => {
        if(username == null) {

        }
        else {
            setShowReplyButton(true);
        }
    };

    const handleReplySubmission = () => {
        // Call the passed function

        props.handleReplySubmission();
    };

    const handleClickSubmitReplyButton = async () => {

        const post_id = props.post_id;
        const comment_id = props.comment_id;

        console.log("props : ", props);
        try {

                        // <Comment comment_id = {comment.comment_id} post_id = {location.state.id} author = {comment.author} level = {comment.level}
                        //     handleReplySubmission = {handleReplySubmission}/>
            const response = await fetch(`http://localhost:3001/api/comments?post_id=${post_id}&comment_id=${comment_id}`, { // ???
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    // post_id : props.post,
                    author : username,
                    content : replyCommentToPost,
                    level : props.level + 1,
                    // parent_comment_id : props.post,
                }),
            });

            // const result = await client.query(
            //     "INSERT INTO comments (post_id, author, content, created_at, level, parent_comment_id) VALUES ($1, $2, $3, NOW(), $4, $5) RETURNING *",
            //     [postId, author, content, parseInt(level), commentId] // level + 1 previously
            //   );

            if (response.ok) {
                handleReplySubmission();
                setReplyCommentToPost("");


            } else {
                console.error("Failed to post reply");
            }
        } catch (error) {
            console.error("Error posting reply:", error);
        }
    };

    return (
        <div className="comment-container" style={{ marginLeft: props.level * 20 + 'px' }}>
            <div className="comment-box">

                <div className="comment-author">    {props.author ? props.author.toUpperCase() : 'Anonymous'}
                </div>


                <div className="comment-contents">{props.content}</div>
            </div>


            <div className="reply-section" ref={replyBoxRef}>
                {showReplyButton && (
                    <div>
                        <input
                            type="text"
                            className="reply-input"
                            value={replyCommentToPost}
                            placeholder="Reply to this comment..."
                            onChange={changeReplyCommentToPost}
                        />

                        {/* <button className="submit-reply-button" onClick={handleClickSubmitReplyButton}>
                            Submit
                        </button> */}
                        <button className="submit-reply-button" onClick={() => handleClickSubmitReplyButton()}>
                            <span className="reply-arrow">&#x21B5;</span>
                            Submit

                        </button>

                    </div>
                )
                }

                {!showReplyButton && (
                    <button className="reply-button" onClick={handleClickReplyButton}>
                        <span className="reply-arrow">&#x21B5;</span>
                        Reply
                    </button>
                )}

            </div>
        </div>
    );
};

export default Comment;
