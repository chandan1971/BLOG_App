import { Alert, Button, FileInput, Select, TextInput } from 'flowbite-react'
import React, { useEffect } from 'react'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useState } from 'react';
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage'
import {app} from '../firebase'
import {CircularProgressbar} from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'
import { useNavigate,useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';


function UpdatePost() {
  const {currentUser}=useSelector((state)=>state.user) 
  const [formData,setFormData]=useState({});
  const [file,setFile]=useState(null);
  const [imageUploadProgress,setImageUploadProgress]=useState(null);
  const [imageUploadError,setImageUploadError]=useState(null);
  const [publishError,setPublishError]=useState(null);
  const {postId}=useParams();

  const navigate=useNavigate();

  useEffect(()=>{
    try {
      const fetchPost=async()=>{
        const res=await fetch(`http://localhost:3000/api/post/getposts?postId=${postId}`,{
          method:'GET',
          mode:'cors',
          credentials:'include',
          headers:{
          'Content-Type':'application/json',
          'Access-Control-Allow-Origin':'http://localhost:3000',
          'Access-Control-Allow-Credentials':'false',
          'Accept':'application/json'
          }
        })
        const data=await res.json()
        if(!res.ok){
          console.log(data.message);
          setPublishError(data.message);
          return;
        }
        else{
          setPublishError(null);
          setFormData(data.posts[0])
        }
      }
      fetchPost();
    } catch (error) {
      console.log(error.message);
    }
  },[postId])

  const handleUploadImage=async()=>{
    try {
      if(!file){
        setImageUploadError("Please Select an image");
        return;
      }
      setImageUploadError(null);

      const storage=getStorage(app);
      const fileName=new Date().getTime()+'-'+file.name;
      const storageRef=ref(storage,fileName);
      const uploadTask=uploadBytesResumable(storageRef,file);
      uploadTask
      .on(
        'state_changed',
        (snapshot)=>{
          const progress=(snapshot.bytesTransferred/snapshot.totalBytes)*100;
          setImageUploadProgress(progress.toFixed(0));

        },
        (error)=>{
          setImageUploadError("Image Upload Failed");
          setImageUploadProgress(null);

        },
        ()=>{
          getDownloadURL(uploadTask.snapshot.ref)
          .then((downloadURL)=>{
            setImageUploadProgress(null);
            setImageUploadError(null);
            setFormData({...formData, image:downloadURL});
          })
        }
      );
    } catch (error) {
      setImageUploadError("Image Upload failed");
      setImageUploadProgress(null);
      console.log(error);
    }
  }

  const handleSubmit=async(e)=>{
    e.preventDefault();
    try {
      const res=await fetch(`http://localhost:3000/api/post/updatepost/${formData._id}/${currentUser._id}`,{
        method:'PUT',
        mode:'cors',
        headers:{'Content-Type':'application/json',
        'Access-Control-Allow-Origin':'http://localhost:3000',
        'Access-Control-Allow-Credentials':'false',
        'Accept':'application/json'
      },
      credentials:'include',
        body: JSON.stringify(formData),
      })
      const data=await res.json();
      console.log(data);
      console.log(res.status);
      if(!res.ok){
        setPublishError(data.message);
        return;
      }
      else{
        setPublishError(null);
        navigate(`/post/${data.slug}`)
        return;
      }
      
    } catch (error) {
      setPublishError("Update Request Failed !!");
      return;
    }
  }
  
  return (
    <div className='p-3 max-w-3xl mx-auto min-h-screen'>
      <h1 className='text-center text-3xl my-7 font-semibold'>
        Update your Post</h1>
        <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
          <div className='flex flex-col gap-4 sm:flex-row justify-between'>
            <TextInput type='text' placeholder='Title' required id='title' className='flex-1' onChange={(e)=>{
              setFormData({...formData,title :e.target.value})
            }}
            value={formData.title}></TextInput>
            <Select onChange={(e)=>{
              setFormData({...formData,category:e.target.value})
            }} value={formData.category}>
              <option value="uncategorized"> Select a category</option>
              <option value="javascript"> JavaScript</option>
              <option value="reactjs">React.js</option>
              <option value="c++">C++</option>

            </Select>
          </div>
          <div className='flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3'>
            <FileInput type='file' accept='image/*' onChange={(e)=>{
              setFile(e.target.files[0])
            }}></FileInput>
            <Button type='button' gradientDuoTone='purpleToBlue' size='sm' onClick={handleUploadImage} disabled={imageUploadProgress>0 && imageUploadProgress<100} outline>
              {
                imageUploadProgress ? 
                <div className='w-16 h-16'>
                  <CircularProgressbar value={imageUploadProgress} text={`${imageUploadProgress || 0}%`}></CircularProgressbar>
                </div>:
                "Upload Image"

              }
            </Button>
          </div>
          {
            imageUploadError && (
              <Alert color='failure'>{imageUploadError}</Alert>
            )
          }
          {
            formData.image &&(
              <img src={formData.image}
               alt='upload'
               className='w-full h-72 object-cover'
              ></img>
            )
          }
          <ReactQuill theme='snow' placeholder='Write Something...' className='h-72 mb-12' required onChange={(value)=>{
            setFormData({...formData,content:value})
          }}
          value={formData.content}></ReactQuill>
          <Button type='submit' gradientDuoTone='purpleToPink' >Update</Button>
          {
            publishError && (
              <Alert className='mt-5' color='failure'>
                {publishError}
              </Alert>
            )
          }
        </form>

    </div>
  )
}

export default UpdatePost