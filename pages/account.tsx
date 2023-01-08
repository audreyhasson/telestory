import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from '../styles/account.module.css'
import Template from '../components/template'
import { useSession, getSession, signOut } from 'next-auth/react';
import AccountInfo from '../components/accountInfo';
import Link from 'next/link';


const inter = Inter({ subsets: ['latin'] })

export default function Home() {
    const { data: session, status } = useSession();

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
    <Template pageColor="mid-gray">
      <Head>
        <title>Home Page</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/images/favicon.png" />
      </Head>
      <div className="main-container flex">
        <div className={styles.sideContainer + " w-1/3 flex-col justify-center"}>
            <Image 
                className="m-auto bg-mid-gray"
                src="/images/user.svg"
                height={200}
                width={200}
                alt="User"
                />
            <p className="text-center">{session?.user.username}</p>
        </div>
        <div className={styles.userInfo}>
            <AccountInfo />
        </div>
      </div>
      
    </Template>
  )
}
