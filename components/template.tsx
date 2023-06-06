import Head from 'next/head';
import Image from 'next/image';
import styles from './templates.module.css';
//import utilStyles from '../styles/utils.module.css';
import Link from 'next/link';
import {useSession} from 'next-auth/react';
import {useState} from 'react';

export default function Template( {pageColor, children}) {
    const { data: session, status } = useSession();
    
  return (
    <>
        <div className="flex flex-col min-h-screen">
        <Head>
            <link rel="icon" href="/images/favicon" />
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
            <link href="https://fonts.googleapis.com/css2?family=Rubik:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet" />
            <link href="https://fonts.googleapis.com/css2?family=Rubik+Mono+One&display=swap" rel="stylesheet"></link>
        </Head>
        {/* Mobile version below */}
        <div className="md:hidden w-full">
            {/* <Image 
                className="m-auto bg-mid-gray w-full top-0 absolute"
                src="/images/mobileheader.svg"
                fill={true}
                alt="header"
                /> */}
            <img src="/images/mobileheader.svg" className="fixed object-cover top-0 w-full h-16"/>
            <div className={styles.mobileHeader}>
                <Link href="/" className={styles.logoFont}>TELESTORY</Link>
                <Link href="/account"><Image 
                    src="/images/user.svg"
                    height={50}
                    width={50}
                    alt="Telestory"
                /></Link>
            </div>
        </div>
        {/* Wrapping in display none to have diff mobile (desktop below)*/}
        <header className="hidden md:block">
            
            <nav>
                <div className={"bg-"+ pageColor +" h-14" + " w-full"}>
                    {/* This is the code for the container that goes halfway*/}
                </div>
                <div className="flex content-center mt-[-30px]">
                    <div className="w-2/3">
                        <div className={styles.logo + " ml-8"}>
                            <Link href="/">
                            <Image 
                                src="/images/logo.svg"
                                height={60}
                                width={305}
                                alt="Telestory"
                            />
                            </Link>
                        </div>
                    </div>
                    <div className="w-1/3 m-auto">
                        <ul className="flex justify-around mx-10">
                            <Link className={styles.navButton + " bg-dusk-blue"} href="/"><li>write</li></Link>
                            <Link className={styles.navButton + " bg-dusk-purp"} href="/read"><li>read</li></Link>
                            <Link className={styles.navButton + " bg-main-gray"} href="/connect"><li>connect</li></Link>
                            <li className={styles.userIcon + " bg-mid-gray"}><Link href="/account"><Image 
                            src="/images/user.svg"
                            height={55}
                            width={55}
                            alt="User"
                            /></Link></li>
                        </ul>
                    </div>
                </div>
            </nav>
        </header>
        <main className="mt-16 mb-8 md:my-0">{children}</main>
        <div className={"bg-"+ pageColor +" md:hidden fixed bottom-0 w-full h-10"}>
            <ul className="flex justify-around mx-10 mt-[-15px]">
                <Link className={styles.navButton + " bg-dusk-blue"} href="/"><li>write</li></Link>
                <Link className={styles.navButton + " bg-dusk-purp"} href="/read"><li>read</li></Link>
                <Link className={styles.navButton + " bg-main-gray"} href="/connect"><li>connect</li></Link>
            </ul>
        </div>
        <footer className="mt-auto hidden md:block">
            <div className="bg-main-gray h-24 p-5 text-whitish">
                <div className="w-1/2">
                    <p>&quot;If you want to be a writer, you must do two things above all 
                    others: read a lot and write a lot. There&apos;s no way around 
                    these two things that I&apos;m aware of, no shortcut. &quot; <em> -Stephen King</em></p>
                </div>
            </div>
        </footer>
        </div>
    </>
  );
}