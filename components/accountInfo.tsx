import { Inter } from '@next/font/google'
import styles from '../styles/account.module.css'
import { useSession, getSession, signOut } from 'next-auth/react';
import useSWR from 'swr';

const inter = Inter({ subsets: ['latin'] })
const fetcher = (url) => fetch(url).then((res) => res.json())

export default function AccountInfo() {
    const { data: session, status } = useSession();
    const id = session?.user._id;

    const { data, mutate, isValidating } = useSWR('api/getUser?id=' +id, fetcher);
    const isPublic = (data && data.document) ? data.document.public : false;
    
    const daysAlive = (data && data.document) ? Math.floor((new Date().getTime() - Date.parse(data.document.dateCreated))/(1000 * 3600 * 24)): 0 ;

    function logoutHandler() {
        signOut({ callbackUrl: '/auth' });
    }

    const togglePublic = async (e: any) => {
        console.log('toggled');
        e.preventDefault();
        const id = session?.user._id;
        //Update user
        let newState = await fetch("/api/updateSettings?id=" + id, {
            method: "POST",
        })
        newState = await newState.json();
        
        console.log('searching for', id)

        //Update  post viewability
        let renewedState = await fetch("/api/updatePostPublicity?id=" + id, {
            method: "POST",
        })
        renewedState = await renewedState.json();
        console.log(renewedState);
        mutate();
    }

    if (isValidating) {
        return (
            <div className={styles.userInfo}>
                <p>Loading...</p>
            </div>
        )
    }

    return (
    <div className={styles.userInfo}>
        <div className="flex content-center">
            <p className="m-auto">Your account is <span>{isPublic ? 'public' : 'private'}</span>.</p>
            <button onClick={togglePublic} className={styles.button + " " + styles.pub}>{isPublic ? 'GO PRIVATE' : 'GO PUBLIC'}</button>
        </div>
        <div  className={styles.text}>
        <p>View all posts</p>
        <p>You have been a user for {daysAlive} days!</p>
        <button onClick={logoutHandler} className={styles.button}>Logout</button>
        </div>
    </div>
    )
}