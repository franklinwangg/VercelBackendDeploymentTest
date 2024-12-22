import React, { useState, useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import Comment from '../Comment/Comment';
import UserContext from '../../../context/UserContext';
import "./Post.css";


const Post = () => {

    const location = useLocation();
    const [comments, setComments] = useState([]);
    const [articleContent, setArticleContent] = useState([]);
    const [articleImage, setArticleImage] = useState([]);

    const { username, setUsername } = useContext(UserContext);
    const [commentToPost, setCommentToPost] = useState("");
    const [isReadyToRender, setIsReadyToRender] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    

    // fetch comments
    //            const response = await fetch(`http://localhost:3001/api/comments/${postId}`); => FOR FETCHING PREEXISTING COMMENTS
    //                 await fetch(`http://localhost:3001/api/comments/${idOfParentPost}`, => FOR POSTING COMMENTS


    useEffect(() => {
        const fetchAndSortComments = async () => {           
            const fetchedComments = await fetchComments();
            // const fetchedCommentsJson = fetchedComments.json(); // isn't it already json?

            const sortedComments = sortCommentsOnLevel(fetchedComments); // after 
            setComments(sortedComments); 
        };

        fetchAndSortComments();
        setIsReadyToRender(true);

        fetchArticle();
    }, []);

    const handleReplySubmission = async () => {

        const fetchedComments = await fetchComments();
        setComments(fetchedComments.rows);

    };

    const handleSubmitCommentButton = async () => {

        if (username == null) {

        }
        else {

            const author = username;
            const comment = commentToPost;
            const idOfParentPost = location.state.id;

            console.log("1");
            setIsLoading(true);
            try {
                await fetch(`http://localhost:3001/api/comments?postId=${idOfParentPost}&commentId=null`, { // postId, commentId
                method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        author: author,
                        comment: comment,
                        idOfParentPost: idOfParentPost,
                        level: 0
                    })
                });

                const fetchedComments = await fetchComments();

                // while we await it, have the button turn grey, and have a little swirling loading sign replace the text on the button
                setComments(fetchedComments.rows);
                setCommentToPost("");
            }
            catch (error) {
                console.log("uh oh! error is ", error);
            }
            finally {
                // setIsLoading(false);
                setTimeout(() => {
                    setIsLoading(false);

                    const newCommentElement = document.getElementById('new-comment');
                    if (newCommentElement) {
                        newCommentElement.scrollIntoView({ behavior: 'smooth' });

                        // Add the highlight class for the fade effect
                        newCommentElement.classList.add('highlight');
                    }
                }, 1000);


            }
        }
    };

    const changeCommentToPost = (event) => {
        setCommentToPost(event.target.value);
    };

    const fetchComments = async () => {
        try {
            const postId = location.state.id;
            
            const response = await fetch(`http://localhost:3001/api/comments?postId=${postId}`);

            if(!response.ok) {
                throw new Error(`error fetching url : ${response.status}`);
            }

            const data = await response.json();
            console.log("Fetched comments : ", data.rows);

            return data.rows;
        }
        catch (error) {
            console.log("Error fetching comments : ", error);
        }
    };

    const sortCommentsOnLevel = (dataComments) => {
        // sort the comments on order, so all 0's in front, then 1's, etc

        if (dataComments.length === 0) {
            return dataComments;
        }

        const sortedDataComments = dataComments.sort((firstComment, secondComment) => {
            if (firstComment.level > secondComment.level) {
                return 1;
            }
            else if (firstComment.level === secondComment.level) {
                return 0;
            }
            else return -1;
        });
        // console.log("sorted data comments : ", sortedDataComments);

        return sortedDataComments;
    }

    const divideCommentsIntoLevelArrays = () => {
        // first, separate comments into new Level arrays - one array for all Level0's, another for Level1's, etc

        // why does dCILA get called again when button is clicked?
        const levelArrays = [];
        var currLevel = 0;

        while (true) {

            const temp = comments.filter((comment) => { // comments isn't an array yet
                return comment.level === currLevel;
            });
            if (temp.length === 0) {

                break;
            }
            else {

                levelArrays.push(temp);
                currLevel++;
            }
        }



        return levelArrays;
    };

    const renderEachLevel = (levelArrays, currentComment, level) => {

        const renderedComments = [];
        const temp = [];
        // render itself

        renderedComments.push(renderComment(currentComment));

        // if comment is on last level of levelArrays, we need to stop it cuz otherwise will 
        // trigger outOfBounds error
        if (level === levelArrays.length - 1) {

            return renderedComments;
        }
        else {
            // find all matching child comments in next level
            for (let i = 0; i < levelArrays[level + 1].length; i++) {
                if (levelArrays[level + 1][i].parent_comment_id == currentComment.comment_id) { // parentCommentId undefined?
                    temp.push(levelArrays[level + 1][i]);

                }
            }

            // render all of its child comments

            for (let i = 0; i < temp.length; i++) {
                const arrayOfChildElementsHTML = renderEachLevel(levelArrays, temp[i], level + 1);
                for (let j = 0; j < arrayOfChildElementsHTML.length; j++) {
                    renderedComments.push(arrayOfChildElementsHTML[j]);
                }
            }

            // if no children, then return renderedComments

            return renderedComments;
        }

        // 1) render itself

        // 2) make empty array
        // 3) go through next level array and add any posts whose parentComment matches postId to array
        // 4) for every element in array : 
        // 5) renderComment(postId, level + 1)

    };

    const renderComment = (comment) => {

        return (
            // <Comment />
            // id={index === comments.length - 1 ? "new-comment" : null} 

            <Comment post={location.state.id} author={comment.author} comment={comment.content} level={comment.level} id={comment.id}
                handleReplySubmission={handleReplySubmission} />
        );
    };

    const renderComments = () => {
        if (comments.length === 0) {
            // console.log("no comments available to render yet");
        }
        else {
            const overallRenderedComments = [];
            const levelArrays = divideCommentsIntoLevelArrays(); // not an array

            for (let i = 0; i < levelArrays[0].length; i++) {
                // console.log("i ", i);
                const arrayOfRecursiveElementsHTML = renderEachLevel(levelArrays, levelArrays[0][i], 0); // smth wrong with this
                // console.log("arrayOfRecursiveElements length : ", arrayOfRecursiveElementsHTML.length);
                for (let j = 0; j < arrayOfRecursiveElementsHTML.length; j++) {
                    overallRenderedComments.push(
                        React.cloneElement(arrayOfRecursiveElementsHTML[j], { key: arrayOfRecursiveElementsHTML[j].props.id })
                    );
                }
            }

            // for(let i = 0; i < overallRenderedComments.length; i ++) {
            //     console.log(i, " : ", overallRenderedComments[i]);  
            // }
            return overallRenderedComments;
        }
    }

    const fetchArticle = async () => {
        const response1 = await fetch(location.state.article_url);
        const articleContents = await response1.json();

        setArticleContent(articleContents.content);

        try {
            // const response2 = await fetch(location.state.image_url);
   
            // console.log("2");
            // const articleImageBlob = await response2.blob();
            // console.log("articleImage : ", articleImage);
    
            // const articleImageUrl = URL.createObjectURL(articleImageBlob);
    
    
            // setArticleImage(articleImageUrl);
            
        }
        catch(error) {
            console.log("Error : ", error);
        }
    };

    return (
        <div>
            <div id="post-title-and-content-section">
                <div id="post-title-div">{location.state.title}</div>
                <div id="post-image-div">
                    {articleImage == null ? (
                        <div></div>
                    ) : (
                        // <img id = "article-image" src={articleImage} alt="Article Image" />

                        <img id="article-image" src={location.state.image_url} alt={location.state.title} />

                    )}
                </div>
                <div id="post-content-div">
                    {articleContent == null ? (
                        <div></div>
                    ) : (
                        <div>{articleContent}</div>
                    )}
                </div>
            </div>

            <input type="text" id="post-new-comment-box" value={commentToPost}
                placeholder="Post comment here" onChange={changeCommentToPost}></input>
            <button id="submit-comment-button" onClick={handleSubmitCommentButton}>
                {isLoading ?
                    (<div className="spinner"></div>)
                    : (<div>
                        Submit
                    </div>)}
            </button>

            <div id="comments-section-title">All Comments : {comments.length}</div>

            <div className="comments-section">
                {isReadyToRender ? renderComments() : <p>Loading comments...</p>}

                {/* {comments.map((comment, index) => (
                    <div
                        key={comment.id}
                        id={index === comments.length - 1 ? "new-comment" : null} 
                        className="comment"
                    >
                        {comment.content}
                    </div>
                ))} */}
            </div>
        </div>
    );

}

export default Post;