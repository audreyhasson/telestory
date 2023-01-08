import styles from '../styles/read.module.css';
import { useSession } from 'next-auth/react';
import useSWR from 'swr';
import {useState, useRef, useEffect} from 'react';
import PostContainer from '../components/postContainer';

const fetcher = (url) => fetch(url).then((res) => res.json())


export default function WorldPosts() {
    const { data, mutate, isValidating } = useSWR('/api/getWorldsPosts', fetcher);
    const postArray = (data && data.documents) ? data.documents : null;
    console.log(postArray);
    if (isValidating) {
        return (
            <p>Loading...</p>
        )
    }

    return (
        <PostContainer postArray={postArray} />
    )
}