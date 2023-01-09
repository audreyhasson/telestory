import styles from '../styles/read.module.css';
import {useSession} from 'next-auth/react';

export default function PostContainer({postArray}) {
    const { data: session, status } = useSession();
    const userId = session ? session?.user._id : "anonymous";

    async function handleReactionClick(e) {
        e.preventDefault();
        const container = e.target.parentNode;
        const allButtons = container.childNodes;
        for (let i=0; i<allButtons.length; i++) {
            const el = allButtons[i];
            el.classList.remove("clicked")
        }
        e.target.classList.add("clicked");

        const reaction = e.target.id;
        console.log(reaction)
        const postId = container.id;

        let newState = await fetch("/api/react?userId=" + userId + "&postId=" + postId + "&reaction=" + reaction, {
            method: "POST",
        })
        newState = await newState.json();
        console.log(newState);
    }

    function getPostHTML(content, id, username) {
        return (
            <div className={styles.post}>
                <div className={styles.postContent}>
                    <p>{content}</p>
                </div>
                <div className={styles.postBar + " postForceStyle"}>
                    <p className="text-xl">{username}</p>
                    <div id={id} className={styles.reactionContainer}>
                        <button onClick={handleReactionClick} id="laughs">i laughed</button>
                        <button onClick={handleReactionClick} id="cries">i cried</button>
                        <button onClick={handleReactionClick} id="screams">i screamed</button>
                        <button onClick={handleReactionClick} id="plots">dope plot</button>
                        <button onClick={handleReactionClick} id="crafts">great wordwork</button>
                    </div>
                </div>
            </div>
        )
    }

    const posts = [];

    const even = postArray.length%2==0;

    for (let i=0; i<(postArray.length-1); i=i+2){
        const content = postArray[i].text;
        const id = postArray[i]._id;
        const username = postArray[i].author ? postArray[i].author : "anonymous";
        const postHTML1 = getPostHTML(content, id, username)
        const content2 = postArray[i+1].text;
        const id2 = postArray[i+1]._id;
        const username2 = postArray[i+1].author ? postArray[i+1].author : "anonymous";
        const postHTML2 = getPostHTML(content2, id2, username2)
        
        posts.push(
            <tr>
                <td className="w-1/2">{postHTML1}</td>
                <td>{postHTML2}</td>
            </tr>
        )
    }

    if (!even) {
        //Get the last item and add it in its own little row
        const content = postArray[postArray.length-1].text;
        const id = postArray[postArray.length-1]._id;
        const username = postArray[postArray.length-1].author ? postArray[postArray.length-1].author : "anonymous";
        const postHTML = getPostHTML(content, id, username)
        posts.push(
            <tr>
                <td className="w-1/2">{postHTML}</td>
            </tr>
        )
    }

    return (
        <table>
            {posts}
        </table>
    )
}