import styles from '../styles/read.module.css';
import { useSession } from 'next-auth/react';
import useSWR from 'swr';
import {useState, useRef, useEffect} from 'react';
import PostContainer from '../components/postContainer';

const fetcher = (url) => fetch(url).then((res) => res.json())

async function getFamilyPosts(familyIds) {
    const response = await fetch('/api/getFamilyPosts', {
      method: 'POST',
      body: JSON.stringify({ familyIds }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    // fetch('/api/getFamilyPosts', {
    //     method: 'POST',
    //     body: JSON.stringify({ familyIds }),
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //   }).then((response) => response.json()).then((actualData) => console.log(actualData));
  
    return await response.json();
  
    // if (!response.ok) {
    //   console.log(response.status);
    // }
  
    // return data;
  }

export default function FamilyPosts() {

    const { data: session, status } = useSession();
    const [posts, setPosts] = useState([]);
    const id = session?.user._id;
    const { data: userData, mutate, isValidating } = useSWR('api/getUser?id=' +id, fetcher);
    console.log(userData)
    const familyIds = userData.document.family;

    useEffect( () => {
        async function fetchPosts() {
            const res = await getFamilyPosts(familyIds);  
            setPosts(res)  
        }
        fetchPosts();
    }, [])

    console.log(posts);


    if (isValidating) {
        return (
            <p>Loading...</p>
        )
    }
    
    return (
        <PostContainer postArray={posts} />
    )
}