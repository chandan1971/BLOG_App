import { Alert, Button, TextInput } from 'flowbite-react'
import React, { useEffect, useRef, useState } from 'react'
import{ useDispatch, useSelector} from 'react-redux'
import {getStorage }from "firebase/storage"
import { getDownloadURL, uploadBytesResumable,ref } from "firebase/storage"
import {app} from "../firebase"
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { updateStart,updateSuccess,updateFailure } from '../redux/user/userSlice';

function DashProfile() {
    const {currentUser}=useSelector(state=>state.user)
    const [imageFile, setImageFile]=useState(null);
    const [imageUrl,setImageUrl]=useState(null);
    const [imageFileUploadProgress,setImageFIleUploadProgress]=useState(0);
    const[imageFileUploadError,setImageFileUploadError]=useState(null);
    const filePickerRef=useRef();
    const [formData,setFormData]=useState({});
    const dispatch=useDispatch();
    const handleImageChange=(e)=>{
        const file=e.target.files[0];
        if(file){
          setImageFile(file);
          setImageUrl(URL.createObjectURL(file));
        }
    };
    useEffect(()=>{
      if(imageUrl){
        uploadImage();
      }
    },[imageFile]);

    const uploadImage=async()=>{
      const storage=getStorage(app);
      const fileName=new Date().getTime() +imageFile.name;
      const storageRef=ref(storage,fileName);
      const uploadTask=uploadBytesResumable(storageRef,imageFile);
      uploadTask.on(
        'state_changed',
        (snapshot)=>{
          const progress=(snapshot.bytesTransferred/snapshot.totalBytes)*100;
          setImageFIleUploadProgress(progress.toFixed(0))
        },
        (error)=>{
          setImageFileUploadError("Could not upload file (File size must be less than 2 MB and of .png or .jpeg format)");
          setImageFIleUploadProgress(0);
          setImageUrl(null);
          setImageFile(null);
        },
        ()=>{
          getDownloadURL(uploadTask.snapshot.ref)
          .then((downloadURL)=>{
            setImageUrl(downloadURL);
            setFormData({...formData,profilePicture:downloadURL});
          })
        }
      )

    }

    const handleChange=(e)=>{
      setFormData({...formData,[e.target.id]:e.target.value})
    }
    const handleSubmit=async (e)=>{
      e.preventDefault();
      if(Object.keys(formData).length===0){
        return;
      }
      try {
        dispatch(updateStart());
        //console.log(formData);
        
        const res=await fetch(`http://localhost:3000/api/user/update/${currentUser._id}`,{
        method:'PUT',
        mode:'cors',
        credentials: 'include',
        headers:{'Content-Type':'application/json',
        'Access-Control-Allow-Origin':'http://localhost:3000',
        'Access-Control-Allow-Credentials':'false',
        'Accept':'application/json'
      },
        body:JSON.stringify(formData),
      })
        const data=await res.json();
        if(res.status===200){
          dispatch(updateSuccess(data));
        }
        else{
          console.log(data);
          dispatch(updateFailure(data));
        }
      } catch (error) {
        console.log(error);
        dispatch(updateFailure(error.message))

      }
    }
  return (
    <div className='max-w-lg mx-auto p-3 w-full ' >
        <h1 className='my-7 text-center font-semibold text-3xl' >Profile</h1>
        <form className='flex flex-col gap-4 align-items:center' onSubmit={handleSubmit}>
            <input type='file' accept='image/*' onChange={handleImageChange} ref={filePickerRef} hidden></input>
            <div className='relative w-32 h-32 self-center  cursor-pointer shadow-md overflow-hidden rounded-full' onClick={()=>{
              filePickerRef.current.click()
            }}>
              <img src= {imageUrl || currentUser.profilePicture} alt="user" className={`rounded-full w-full h-full object-cover border-8  border-[lightgray] ${
              imageFileUploadProgress>0 && imageFileUploadProgress<100 && `opacity-60`}`}/>
              {imageFileUploadProgress && imageFileUploadProgress<100 && 
                <CircularProgressbar
                value={imageFileUploadProgress || 0}
                text={`${imageFileUploadProgress}%`}
                strokeWidth={5}
                styles={{
                  root: {
                    width: '100%',
                    height: '100%',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                  },
                  path: {
                    stroke: `rgba(62, 152, 199, ${
                      imageFileUploadProgress / 100
                    })`,
                  },
                }}
            />
              }
            
            </div>
            {imageFileUploadError && <Alert color='failure'>
              {imageFileUploadError}
            </Alert>}
            <TextInput type='text' id='username' placeholder='username' defaultValue={currentUser.username} onChange={handleChange}></TextInput>
            <TextInput type='email' id='email' placeholder='email' defaultValue={currentUser.email} onChange={handleChange}></TextInput>
            <TextInput type='password' id='password' placeholder='password' onChange={handleChange}></TextInput>
            <Button type='submit' gradientDuoTone="purpleToBlue" outline>
              Update
            </Button>
        </form>
        <div className='text-red-500 flex justify-between mt-5'>
          <span className='cursor-pointer '>Delete Account</span>
          <span className='cursor-pointer '>Sign Out</span>

        </div>
    </div>
  )
}

export default DashProfile