import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from '../styles/read.module.css'
import {useSession} from 'next-auth/react';
import Template from '../components/template';
import FamilyPosts from '../components/familyposts';
import WorldPosts from '../components/worldposts';
import {useState} from 'react';
import useSWR from 'swr';

const inter = Inter({ subsets: ['latin'] })
const fetcher = (url) => fetch(url).then((res) => res.json())

export default function Read() {
  const { data: session, status } = useSession();
  const [viewingWorld, setViewingWorld] = useState(false);

  if (status=='unauthenticated') {
    return (
      <Template pageColor="mid-gray">
        <div className="redirect">
            <p>You must <a href="/auth">sign in</a> to view this page.</p>
          </div>
      </Template>
    )
  }

  const id = session?.user._id;

  const { data: userData, mutate: mutateUser, isValidating: isValUser } = useSWR('api/getUser?id=' +id, fetcher);

  const postId = (userData && userData.document) ? userData.document.currPost : null;

  const { data: postData, mutate: mutatePost, isValidating: isValPost } = useSWR('api/getPost?id=' +postId, fetcher);

  function viewFamily() {
    setViewingWorld(false);
  }

  function viewWorld() {
    setViewingWorld(true);
  }

  function testEvent(e) {
    console.log(e.target.parentNode.id);
  }  



  return (
    <Template pageColor="dusk-purp">
      <Head>
        <title>Home Page</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/images/favicon.png" />
      </Head>
      <div className="main-container" id="momma-id">
        <div className={"bg-main-gray rounded-full " + styles.viewButton}>
          <button onClick={viewFamily} className={viewingWorld ? "" : styles.active}>Your Family</button>
          <button onClick={viewWorld} className={viewingWorld ? styles.active : ""}>The World</button>
        </div>
        <div>
          {!viewingWorld ? <FamilyPosts /> : <WorldPosts />}
        </div>
      </div>
    </Template>
  )
}
