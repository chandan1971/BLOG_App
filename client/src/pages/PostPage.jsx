import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

function PostPage() {
    const {postSlug}=useParams()
    const [loading,setLoading]=useState(true);
    const [error,setError]=useState(null);
    const [posts,setPosts]=useState(null);

    useEffect(()=>{
        console.log(postSlug);
        const fetchPost=async()=>{
            try {
                setLoading(false);
                const res=await fetch(`http://localhost:3000/getposts?slug=${postSlug}`);
                const data=await res.json();
                if(!res.ok){
                    setError(data.message);
                    setLoading(false);
                }
                else{
                    setPosts(data.post[0])
                    setLoading(false);
                    setError(null);
                }
            } catch (error) {
                setError(error);
                setLoading(error);

            }
        };
        fetchPost();
    },[postSlug])
  return (
    <div>PostPage</div>
  )
}

export default PostPage