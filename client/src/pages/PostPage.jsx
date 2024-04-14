import { Button, Spinner } from 'flowbite-react';
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import CallToAction from '../Components/CallToAction';
import CommentSection from '../Components/CommentSection';
import PostCard from '../Components/PostCard';

function PostPage() {
    const {postsSlug}=useParams()
    const [loading,setLoading]=useState(true);
    const [error,setError]=useState(null);
    const [post,setPost]=useState(null);
    const [recentPosts,setRecentPosts]=useState(null);

    useEffect(()=>{
        // console.log(postsSlug);
        const fetchPost=async()=>{
            try {
                setLoading(false);
                const res=await fetch(`/api/post/getposts?slug=${postsSlug}`);
                const data=await res.json();
                if(!res.ok){
                    setError(data.message);
                    setLoading(false);
                }
                else{
                    setPost(data.posts[0])
                    // console.log(post);
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

    useEffect(()=>{
            const fetchRecentPosts=async()=>{
                try {
                    const res=await fetch(`/api/post/getposts?limit=3`,{
                        method:'GET',
                        mode:'cors',
                    })
                    const data=await res.json();
                    if(res.ok){
                        setRecentPosts(data.posts);
                    }
                    
                } catch (error) {
                    console.log(error.message);
                }
            }
            fetchRecentPosts()
    })

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
        <img src={post && post.image} alt={post && post._id} className='mt-10 p-3 max-h-{600px} w-full object-cover'></img>
        <div className='flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-xs '>
            <span>{post && new Date(post.createdAt).toLocaleDateString()}</span>
            <span className='italic'>{post && (post.content.length/1000).toFixed(0)} mins read</span>
        </div>
        <div className='p-3 max-w-2xl mx-auto w-full post-content' dangerouslySetInnerHTML={{__html: post && post.content}}></div>
        <div className='max-w-4xl mx-auto w-full'><CallToAction></CallToAction></div>
        <CommentSection postId={post &&  post._id}></CommentSection>
        <div className='flex flex-col justify-center items-center mb-5'>
            <h1 className='text-xl mt-5'>Recent Articles</h1>
            <div className='flex  gap-5 mt-5 justify-center'>
                {
                    recentPosts && (
                        recentPosts.map((post)=>(
                            <PostCard key={post._id} post={post}></PostCard>
                        ))
                    )
                }
            </div>
        </div>
    </main>
  )
}

export default PostPage