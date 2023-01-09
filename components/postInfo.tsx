import { Inter } from '@next/font/google'
import styles from '../styles/post.module.css'
import { useSession, getSession, signOut } from 'next-auth/react';
import useSWR from 'swr';
import StatGraph from '../components/statgraph';

const inter = Inter({ subsets: ['latin'] })
const fetcher = (url) => fetch(url).then((res) => res.json())

export default function PostInfo() {
    const { data: session, status } = useSession();
    const id = session?.user._id;

    const { data: userData, mutate: mutateUser, isValidating: isValUser } = useSWR('api/getUser?id=' +id, fetcher);

    const postId = (userData && userData.document) ? userData.document.currPost : null;
    console.log('searching for post', postId);

    const { data: postData, mutate: mutatePost, isValidating: isValPost } = useSWR('api/getPost?id=' +postId, fetcher);

    function countWords(blurb: string) {
        const words = blurb.split(" ");
        return words.length;
    }

    return (
        <div>
            <h1 className="text-text-black my-3 px-4 text-4xl ">YOUR POST TODAY:</h1>
        <div className="flex w-full">
            <div className={styles.textbox + " w-2/3 border-text-black bg-whitish rounded-xl px-4 py-2 border-4 h-[65vh] resize-none"}>
                {isValPost && <p>Loading your awesome writing...</p>}
                {!isValPost && <p className="overflow-scroll">{postData.document.text}</p>}
            </div>
            <div className="mx-8 w-1/3">
                <h1 className="mb-3 text-2xl">REACTIONS:</h1>
                {isValPost && <p>Loading...</p>}
                {!isValPost && <StatGraph reactionArray={postData.document.reactions} />}
                <h1 className="my-3 text-2xl">STATS:</h1>
                {isValPost && <p>Stats incoming...</p>}
                {!isValPost && <div>
                    <p>TOTAL WORDS: <span>{countWords(postData.document.text).toString()}</span></p>
                    <p>WPM: <span>{Math.floor(countWords(postData.document.text)/3).toString()}</span></p>
                    {!postData.document.postSucess && 
                        <p>You did not include today's words in your post. Sad! We're sure you tried! Unfortunately,
                            due to this, your post is not visible to others today.
                        </p>
                        }
                </div>
                }
            </div>
        </div>
        </div>
    )
}