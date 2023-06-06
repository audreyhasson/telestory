import Head from 'next/head';
import Image from 'next/image';
import { Inter } from '@next/font/google';
import styles from '../styles/connect.module.css';
import Template from '../components/template';
import {useSession} from 'next-auth/react';
import Link from 'next/link';
import useSWR from 'swr';
import {useState, useRef, useEffect} from 'react';


const inter = Inter({ subsets: ['latin'] })

const fetcher = (url) => fetch(url).then((res) => res.json())

async function getFamilyAccounts(familyIds) {
    const response = await fetch('/api/getFamilyAccounts', {
      method: 'POST',
      body: JSON.stringify({ familyIds }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  
    return await response.json();
  }

async function getSearchResults(query: string) {
  const response = await fetch('/api/getSearchResults?query=' + query, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return await response.json(); 
}

async function invite(inviterId, inviterUsn, inviteeId, inviteeUsn) {
  const response = await fetch('/api/invite?inviterId=' + inviterId + '&inviterUsn=' + inviterUsn + '&inviteeId=' + inviteeId + '&inviteeUsn=' + inviteeUsn, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return await response.json(); 
}

async function addToFamily(user, userToAdd) {
  const response = await fetch('/api/addToFamily?userId=' + user + '&userToAddId=' + userToAdd, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return await response.json(); 
}

async function removeFromFamily(user, userToRemove) {
  const response = await fetch('/api/removeFromFamily?userId=' + user + '&userToRemoveId=' + userToRemove, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return await response.json(); 
}

async function resolveInvitation(inviterId, inviteeId) {
  const response = await fetch('/api/resolveInvitation?inviterId=' + inviterId + '&inviteeId=' + inviteeId, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return await response.json(); 
}

export default function Home() {
  const { data: session, status} = useSession();
  const id = (session && session.user) ? session?.user._id: null;
  const [familyMems, setFamily] = useState([]);
  const [isLoadingFam, setLoadingFam] = useState(true)
  const [user, setUser] = useState(null)
  const [results, setResults] = useState([]);
  const [isFirstSearch, setFirstSearch] = useState(true);
  const [showingModal, setShowingModal] = useState(false);
  const queryRef = useRef();
  const { data: userData, mutate: mutateUser, isValidating } = useSWR('api/getUser?id=' +id, fetcher);
  const {data: outgoingInvites, mutate: refreshOutInvites, isValidating: isValidatingOutInvites} = useSWR('api/getOutgoingInvites?id=' +id, fetcher);
  const {data: incomingInvites, mutate: refreshIncInvites, isValidating: isValidatingIncInvites} = useSWR('api/getIncomingInvites?id=' +id, fetcher);
  const familyIds = (userData && userData.document) ? userData.document.family: [];
  // Get their family members
  useEffect( () => {
      async function fetchAccounts() {
          const res = await getFamilyAccounts(familyIds);  
          setFamily(res);
          setLoadingFam(false);
      }
      fetchAccounts();
  }, [])

  function handleUserClick(e) {
    e.preventDefault();
    const userId =  e.target.id;
    const thisUser = familyMems.find(obj => obj._id === userId)
    if (thisUser) {
      setUser(thisUser);
    }
  }
  
  function handleStrangerClick(e) {
    e.preventDefault();
    const userId =  e.target.id;
    const thisUser = results.find(obj => obj._id === userId)
    if (thisUser) {
      setUser(thisUser);
    }
  }

  function getResults(results) {
    const res = [];
    if (results.length===0 && !isFirstSearch) {
      return (<p>No results!</p>)
    }
    for (let i=0;i<results.length;i++) {
      res.push( 
        <button onClick={handleStrangerClick} id={results[i]._id}>{results[i].username}</button>
      )
    }
    return res
  }

  async function inviteAndRefresh(e) {
    e.preventDefault()
    const otherId = user._id;
    const otherUsername = user.username
    await invite(id, userData.document.username, otherId, otherUsername);
    refreshOutInvites();
  }

  async function acceptAndRefresh(e) {
    e.preventDefault();
    const otherId = user._id;
    await addToFamily(id, otherId);
    await addToFamily(otherId, id);
    await resolveInvitation(otherId, id);
    mutateUser() //Refreshes user
    let famIds = (userData && userData.document) ? userData.document.family: [];
    const res = await getFamilyAccounts(famIds);  
    setFamily(res);
    refreshIncInvites();
  }

  async function acceptRandomAndRefresh(e, otherId) {
    e.preventDefault();
    await addToFamily(id, otherId);
    await addToFamily(otherId, id);
    await resolveInvitation(otherId, id);
    mutateUser() //Refreshes user
    let famIds = (userData && userData.document) ? userData.document.family: [];
    const res = await getFamilyAccounts(famIds);  
    setFamily(res);
    refreshIncInvites();
  }

  async function deleteRandomAndRefresh(e, otherId) {
    e.preventDefault();
    await resolveInvitation(otherId, id);
    refreshIncInvites();
  }

  async function removeAndRefresh(e) {
    e.preventDefault();
    const otherId = user._id;
    const res = await removeFromFamily(id, otherId);
    console.log(res);
    await removeFromFamily(otherId, id);
    const newUser = mutateUser() //Refreshes user
    console.log(newUser)
    let famIds = (newUser && newUser.document) ? newUser.document.family: [];
    const res2 = await getFamilyAccounts(famIds);  
    console.log("new fam is", res2)
    setFamily(res2);
  }

  function getButton(user, other) {
    // In family
    if (user.family.includes(other._id)) {
      return (
        <button onClick={removeAndRefresh} className={styles.removeButton}>REMOVE FROM FAMILY</button>
      )
    }
    // You invited them 
    if (outgoingInvites.documents.find(obj => obj.to === other._id)) { 
      return (
        <p>Invitation pending...</p>
      )
    }
    // They invited you (Accept their invite)
    if (incomingInvites.documents.find(obj => obj.to === user._id)) { 
      return (
        <button onClick={acceptAndRefresh}>JOIN FAMILY</button>
      )
    }
    // Its u
    if (user._id === other._id) {
      return (
        <p>This is you!</p>
      )
    }
    // Not in family (invite!)
    else {
      return (
        <button onClick={inviteAndRefresh}>INVITE TO FAMILY</button>
      )
    }
  }

  function getInviteDisplay(inviteData) {
    let invites = [];
    for (let i=0; i<inviteData.length; i++) {
      invites.push(
        <div id={inviteData[i].from} className={styles.invitation}>
          <div className="flex">
          <Image 
              className=""
              src="/images/user.svg"
              height={30}
              width={30}
              alt="User"
              />
          <p>{inviteData[i].fromUser}</p>
          </div>
          
          <div className={styles.invitationButtons}>
            <button onClick={e => {acceptRandomAndRefresh(e, inviteData[i].from)}}>ACCEPT</button>
            <button className="text-red" onClick={e => {deleteRandomAndRefresh(e, inviteData[i].from)}}>DECLINE</button>
          </div>
        </div>
      )
    }
    return invites
  }

  function handleKeys(e) {
    if (e.code==="Enter") {
      search();
    }
  }

  async function search() {
    setFirstSearch(false);
    const res = await getSearchResults(queryRef.current.value);
    setResults(res);
  }

  let users = []

  for (let i=0; i<familyMems.length; i++) {
      users.push(
          <button onClick={handleUserClick} className={styles.userButton} id={familyMems[i]._id}> 
          <Image 
              className=""
              src="/images/user.svg"
              height={40}
              width={40}
              alt="User"
              />
          {familyMems[i].username}</button>
      )
  }

  console.log("family mems:", familyMems)

  if (status=='unauthenticated') {
    return (
      <Template pageColor="mid-gray">
        <div className="redirect">
            <p>You must <Link href="/auth">sign in</Link> to view this page.</p>
          </div>
      </Template>
    )
  }

  if (isValidating) {
    return (
      <Template pageColor="main-gray">
      <Head>
        <title>Home Page</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/images/favicon.png" />
      </Head>
      <table className={styles.table}>
        <tbody>
          <tr>
            <td className={styles.sidebar}>
            <div>
              <p>Your Family</p>
            </div>
           
            </td>
            <td>
            <p>Loading...</p>
            
            </td>
          </tr>
        </tbody>
      </table>
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
      {showingModal && <div className={styles.modal}>
        <div className={styles.mTitle + " flex"}>
          <p>Invitations</p>
          <button onClick={() =>{setShowingModal(false)}}>x</button>
        </div>
        <div>
          {getInviteDisplay(incomingInvites.documents)}
        </div>
      </div>}
      <table className={styles.table}>
        <tbody>
          <tr>
            <td className={styles.sidebar}>
            <div>
              <p>Your Family</p>
            </div>
            {!isLoadingFam && <div>
              <div className="block">
                  {users}
              </div>
            </div>}
            </td>
            <td>
            {!user && <div>
            <div className={styles.rightContainer + " flex justify-around"}>
              <div className={styles.searchContainer}><Image 
              src="/images/searchIcon.svg"
              height={35}
              width={35}
              alt="Search"
              /><input type="text" onKeyUp={handleKeys} placeholder="Search all users" ref={queryRef}></input><button onClick={search}>go</button></div>
            <button onClick={()=>{setShowingModal(true)}}>Invites</button>
          </div>
            <div className={styles.searchResults}>
              {getResults(results)}
            </div>
          </div>}
            {user!==null && <div className={styles.userContainer}>
              <div className="flex">
                <Image 
                className="bg-mid-gray"
                src="/images/user.svg"
                height={200}
                width={200}
                alt="User"
                />
                <div className={styles.userContent + " mt-2"}>
                  <p className="text-4xl">{user.username}</p>
                  <>{getButton(session?.user, user)}</>
                </div>
              </div>
              <button className={styles.backButton} onClick={() => (setUser(null))}> {String.fromCharCode(8592)} Back</button>
            </div>}
            </td>
          </tr>
        </tbody>
      </table>
    </Template>
  )
}
