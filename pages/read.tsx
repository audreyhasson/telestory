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
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] })
const fetcher = (url) => fetch(url).then((res) => res.json())

export default function Read() {
  const { data: session, status } = useSession();
  const [viewingWorld, setViewingWorld] = useState(false);

  const id = session?.user._id;

  const { data: userData, mutate: mutateUser, isValidating: isValUser } = useSWR((status=='unauthenticated') ? 'api/getUser?id=' +id : null, fetcher);

  const postId = (userData && userData.document) ? userData.document.currPost : null;

  const { data: postData, mutate: mutatePost, isValidating: isValPost } = useSWR((status=='unauthenticated') ? 'api/getPost?id=' +postId : null, fetcher);

  function viewFamily() {
    setViewingWorld(false);
  }

  function viewWorld() {
    setViewingWorld(true);
  }

  function testEvent(e) {
    console.log(e.target.parentNode.id);
  }  


  if (status=='unauthenticated') {
    return (
      <Template pageColor="mid-gray">
        <div className="redirect">
            <p>You must <Link href="/auth">sign in</Link> to view this page.</p>
          </div>
      </Template>
    )
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
