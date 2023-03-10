import Head from 'next/head';
import Image from 'next/image';
import { Inter } from '@next/font/google';
import styles from '../styles/Home.module.css';
import Template from '../components/template';
import {useSession} from 'next-auth/react';
import Link from 'next/link';



const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const { data: session, status} = useSession();

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
    <Template pageColor="main-gray">
      <Head>
        <title>Home Page</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/images/favicon.png" />
      </Head>
      <div className="main-container">
        <p className="text-center">Find your writer family. Coming soon!</p>
      </div>
    </Template>
  )
}
