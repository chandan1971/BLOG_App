import { Button, Spinner } from 'flowbite-react';
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import CallToAction from '../Components/CallToAction';

function PostPage() {
    const {postsSlug}=useParams()
    const [loading,setLoading]=useState(true);
    const [error,setError]=useState(null);
    const [post,setPost]=useState(null);

    useEffect(()=>{
        console.log(postsSlug);
        const fetchPost=async()=>{
            try {
                setLoading(false);
                const res=await fetch(`http://localhost:3000/api/post/getposts?slug=${postsSlug}`);
                const data=await res.json();
                if(!res.ok){
                    setError(data.message);
                    setLoading(false);
                }
                else{
                    setPost(data.posts[0])
                    setLoading(false);
                    setError(null);
                }
            } catch (error) {
                setError(error);
                setLoading(error);

            }
        };
        fetchPost();
    },[postsSlug])

if(loading) return (
    <div className='flex justify-center items-center min-h-screen'>
        <Spinner size='xl'></Spinner>
    </div>
)
  return (
    <main className='p-3 flex flex-col max-w-6xl mx-auto min-h-screen'>
        <h1 className='text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl'>{post && post.title}</h1>
        <Link to={`/search/category=${post && post.category}`} className='self-center mt-5'>
            <Button color='gray' pill size='xs'>{post && (post.category)}</Button>
        </Link>
        <img src={post && post.image} alt={post && post.title} className='mt-10 p-3 max-h-{600px} w-full object-cover'></img>
        <div className='flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-xs '>
            <span>{post && new Date(post.createdAt).toLocaleDateString()}</span>
            <span className='italic'>{post && (post.content.length/1000).toFixed(0)} mins read</span>
        </div>
        <div className='p-3 max-w-2xl mx-auto w-full post-content' dangerouslySetInnerHTML={{__html: post && post.content}}></div>
        <div className='max-w-4xl mx-auto w-full'><CallToAction></CallToAction></div>
    </main>
  )
}

export default PostPage