import { Inter } from '@next/font/google'
import styles from '../styles/account.module.css'
import { useSession, getSession, signOut } from 'next-auth/react';
import useSWR from 'swr';
import type { Session } from "next-auth";


const inter = Inter({ subsets: ['latin'] })
const fetcher = (url: string) => fetch(url).then((res) => res.json())

// type Session = {
//     user?: {
//       _id?: string;
//       username?: string;
//       dateCreated?: string;
//       passHash?: string;
//       postIds?: Array<string>;
//       currPost?: null | string;
//       public?: boolean;
//       family?: Array<string>;
//       email?: string;
//     };
//   };

export default function AccountInfo() {
    const { data: Session, status } = useSession();
    const id = Session?.user?._id;

    const { data, mutate, isValidating } = useSWR('api/getUser?id=' +id, fetcher);
    const isPublic = (data && data.document) ? data.document.public : false;
    
    const daysAlive = (data && data.document) ? Math.floor((new Date().getTime() - Date.parse(data.document.dateCreated))/(1000 * 3600 * 24)): 0 ;

    function logoutHandler() {
        signOut({ callbackUrl: '/auth' });
    }

    const togglePublic = async (e: any) => {
        console.log('toggled');
        e.preventDefault();
        const id = Session?.user._id;
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
        <p>View all posts (Button not active yet)</p>
        <p>You have been a user for {daysAlive} days!</p>
        <button onClick={logoutHandler} className={styles.button}>Logout</button>
        </div>
    </div>
    )
}