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

    function getUsersReaction(reactionArray) {
        let reaction = null;
        if (reactionArray.laughs.includes(userId)) {
            reaction = 'laughs';
        } else if (reactionArray.cries.includes(userId)) {
            reaction = 'cries';
        } else if (reactionArray.screams.includes(userId)) {
            reaction = 'screams';
        } else if (reactionArray.plots.includes(userId)) {
            reaction = 'plots';
        } else if (reactionArray.crafts.includes(userId)) {
            reaction = 'crafts';
        }
        return reaction
    }

    function getPostHTML(content, id, username, reaction) {
        return (
            <div className={styles.post}>
                <div className={styles.postContent}>
                    <p>{content}</p>
                </div>
                <div className={styles.postBar + " postForceStyle"}>
                    <p className="text-xl">{username}</p>
                    <div id={id} className={styles.reactionContainer}>
                        <button onClick={handleReactionClick} className={reaction=='laughs' ?'clicked' : ''} id="laughs">
                            i laughed</button>
                        <button onClick={handleReactionClick} className={reaction=='cries' ?'clicked' : ''} id="cries">i cried</button>
                        <button onClick={handleReactionClick} className={reaction=='screams' ?'clicked' : ''} id="screams">i screamed</button>
                        <button onClick={handleReactionClick} className={reaction=='plots' ?'clicked' : ''} id="plots">dope plot</button>
                        <button onClick={handleReactionClick} className={reaction=='crafts' ?'clicked' : ''} id="crafts">great wordwork</button>
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
        const reaction = getUsersReaction(postArray[i].reactions);
        const username = postArray[i].author ? postArray[i].author : "anonymous";
        const postHTML1 = getPostHTML(content, id, username, reaction)
        const content2 = postArray[i+1].text;
        const id2 = postArray[i+1]._id;
        const username2 = postArray[i+1].author ? postArray[i+1].author : "anonymous";
        const reaction2 = getUsersReaction(postArray[i+1].reactions);
        const postHTML2 = getPostHTML(content2, id2, username2, reaction2)
        
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
        const reaction = getUsersReaction(postArray[postArray.length-1].reactions);
        const postHTML = getPostHTML(content, id, username, reaction)
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