import Head from 'next/head';
import Image from 'next/image';
import { Inter } from '@next/font/google';
import styles from '../styles/Home.module.css';
import Template from '../components/template';
import { useSession } from 'next-auth/react';
import useSWR from 'swr';
import {useState, useRef, useEffect} from 'react';
import PostInfo from '../components/postInfo';
import Link from 'next/link';



const inter = Inter({ subsets: ['latin'] })
const fetcher = (url) => fetch(url).then((res) => res.json())

async function submitPost(authorId, username, content, success, publicity) {
  const response = await fetch('/api/post', {
    method: 'POST',
    body: JSON.stringify({ authorId, username, content, success, publicity }),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();

  if (!response.ok) {
    console.log(response.status);
  }

  return data;
}

const timeCounter = (time) => {
  return time.toString().padStart(2, "0");
};

export default function Home() {
  const { data: session, status } = useSession();

  const [challengeStarted, setChallenge] = useState(false);
  const [gotWord1, setGotWord1] = useState(false);
  const [gotWord2, setGotWord2] = useState(false);

  const [timeLeft, setTimeLeft] = useState(10);
  const [isCounting, setIsCounting] = useState(false);
  const intervalRef = useRef(null);

  function startTimer() {
    if (intervalRef.current !== null) return;
    setIsCounting(true);
    intervalRef.current = setInterval(() => {
      setTimeLeft((timeLeft) => {
        if (timeLeft >= 1) return timeLeft - 1;
        if (timeLeft===0) {
          // reset the timer
          console.log('calling submit from the timer');
          submitHandler(null);
          return 0;
        }
        
      });
    }, 1000);
  }

  const minutes = timeCounter(Math.floor(timeLeft / 60));
  const seconds = timeCounter(timeLeft - minutes * 60);

  const id = session?.user._id;
  const postContentRef = useRef();

  const { data: userData, mutate, isValidating } = useSWR((status=='authenticated') ? 'api/getUser?id=' +id : null, fetcher);
  const hasPosted = (userData && userData.document) ? userData.document.currPost!==null : false;
  
  const { data: wordData, isValidating: wordsAreLoading} = useSWR('api/getWords', fetcher);
  const word1 = (wordData && wordData.document) ? wordData.document.word1: "NONE";
  const word2 = (wordData && wordData.document) ? wordData.document.word2: "NONE";

  function handleKeyDown() {
    const wordsSoFar = postContentRef.current.value;
    const wordsToCompare = wordsSoFar.toLowerCase();
    setGotWord1(wordsToCompare.includes(word1));
    setGotWord2(wordsToCompare.includes(word2));
  }


  function startChall() {
    setChallenge(!challengeStarted);
    startTimer();
  }


  async function submitHandler(e) {
    console.log('i was called');
    clearInterval(intervalRef.current);
    setIsCounting(false);
    intervalRef.current = null;
    if (e!==null) {
      e.preventDefault();
    }
    // Create a new post with content and success var set to (got1 and got2) 
    const publicity = userData.document.public;
    const postContent = postContentRef.current.value;
    const res = submitPost(session?.user._id, session?.user.username, postContent, gotWord1&&gotWord2, publicity)
    

    // Set user curr post to the post id
    let postId =  await Promise.resolve(res).then(function(value) { return value.insertedId});

    let newState = await fetch("/api/updateUser?id=" + id + "&postId=" + postId, {
        method: "POST",
    })
    newState = await newState.json();
    mutate();
  }

  function selfSubmit(e) {
    e.preventDefault();
    console.log('calling submit from button...')
    submitHandler(null);
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

  if (isValidating || status==='loading') {
    return (
      <Template pageColor="dusk-blue">
        <Head>
        <title>Write</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/images/favicon.png" />
      </Head>
      <div className="main-container">
        <p>Loading...</p>
      </div>
      </Template>
      
    )
  }
  return (
    <Template pageColor="dusk-blue">
      <Head>
        <title>Write</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/images/favicon.png" />
      </Head>
      <div className="main-container">
        {!hasPosted && !challengeStarted && <div><div className="bg-baby-blue border-8 border-dusk-blue flex rounded-2xl">
            <div className="w-1/3 my-auto mx-10 font-bold text-dusk-blue text-5xl">
              <h1 className="mb-4">3 words.</h1>
              <h1>3 minutes.</h1>
            </div>
            <div className={styles.vertLine}></div>
            <div className="m-8">
              <h2 className="font-bold">Instructions:</h2>
              <p>You have 3 minutes to write a VERY short story, based on 3 words. 
                The first word will be a style or genre, such as “Romance” or “Second Person.” 
                 Your story must fit that style or genre.<br></br>The second and third words
                 are random English language words. These two words MUST be included within 
                 the text of your story, or else you won&apos;t be able to post it.</p>
            </div>
          </div>
          <button onClick={startChall} className="bg-dusk-blue text-2xl px-5 py-3 rounded-3xl text-whitish border-dusk-blue border-4
                        hover:italic float-right mx-10 -mt-8">
            START TODAY&apos;S CHALLENGE</button>
          </div>
          }
        {wordsAreLoading && <div>
          <p>Loading...</p>
          </div>
        }
        {!hasPosted && challengeStarted && <div>
            <form>
              <div className="flex h-[65vh]">
              <textarea onKeyUp={handleKeyDown} type='text' id='post' required ref={postContentRef} className="w-2/3 border-text-black bg-whitish rounded-xl px-4 py-2 border-4 h-full resize-none" ></textarea>
              <div className="mx-8 flex-col content-around h-full">
                <div>
                  <h2 className="font-bold text-dusk-blue">STYLE/GENRE:</h2>
                  <p className=" py-2 capitalize text-4xl text-dusk-blue ml-2 font-bold">{wordData.document.genre}</p>
                  <h2 className="font-bold text-dusk-blue">MUST INCLUDE:</h2>
                  <p className={gotWord1 ? "line-through py-2 capitalize text-4xl text-dusk-blue ml-2 font-bold " : "py-2 capitalize text-4xl text-dusk-blue ml-2 font-bold "}>{word1}</p>
                  <p className={gotWord2 ? "line-through py-2 capitalize text-4xl text-dusk-blue ml-2 font-bold " : "py-2 capitalize text-4xl text-dusk-blue ml-2 font-bold "}>{word2}</p>
                </div>
                <p className={seconds<31&&minutes<1 ? "text-red text-6xl font-bold my-6" : "text-dusk-blue text-6xl my-6 font-bold"}>{minutes}:{seconds}</p>
                {gotWord1 && gotWord2 &&
                <button onClick={selfSubmit} className={"bottom-0 my-3 p-4 rounded-xl text-whitish text-xl bg-dusk-blue"}>POST NOW</button>
                }
                </div>
              </div>
            </form>
          </div>}
        {hasPosted && <div>
          <PostInfo />
          </div>}
      </div>
    </Template>
  )
}
