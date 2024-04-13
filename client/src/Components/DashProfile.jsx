import { Alert, Button, Modal, TextInput } from 'flowbite-react'
import React, { useEffect, useRef, useState } from 'react'
import{ useDispatch, useSelector} from 'react-redux'
import {getStorage }from "firebase/storage"
import { getDownloadURL, uploadBytesResumable,ref } from "firebase/storage"
import {app} from "../firebase"
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { updateStart,updateSuccess,updateFailure,deleteUserStart,deleteUserSuccess,deleteUserFailure ,signoutUser} from '../redux/user/userSlice';
import {HiOutlineExclamationCircle} from 'react-icons/hi'
import { Link } from 'react-router-dom'


function DashProfile() {
    const {currentUser,loading}=useSelector(state=>state.user)
    const [imageFile, setImageFile]=useState(null);
    const [imageUrl,setImageUrl]=useState(null);
    const [imageFileUploadProgress,setImageFIleUploadProgress]=useState(0);
    const[imageFileUploadError,setImageFileUploadError]=useState(null);
    const filePickerRef=useRef();
    const [formData,setFormData]=useState({});
    const[showModel,setShowModel]=useState(false);
    const[showModel2,setShowModel2]=useState(false);
    const [updateUserSuccess,setUpdateUserSuccess]=useState(null);
    const[updateUserError,setUpdateUserError]=useState(null);
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
    const handleDelete=(e)=>{
      setShowModel(true);
    }
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

    const handleSignOutUser=async ()=>{
      setShowModel2(false);
      try {
        const res=await fetch(`/api/user/signout`,{
          method:'POST',
          mode:'cors',
          credentials: 'include',
          headers:{'Content-Type':'application/json',
          'Access-Control-Allow-Origin':'*',
          'Access-Control-Allow-Credentials':'false',
          'Accept':'application/json'
        }
        })
        if(res.status==200){
          dispatch(signoutUser())
        }
      } catch (error) {
        console.log(error);
      }
      
    }


    const handleDeleteUser=async ()=>{
      setShowModel(false);
      try {
        dispatch(deleteUserStart());
          const res=await fetch(`/api/user/delete/${currentUser._id}`,{
          method:'DELETE',
          mode:'cors',
          credentials: 'include',
          headers:{'Content-Type':'application/json',
          'Access-Control-Allow-Origin':'*',
          'Access-Control-Allow-Credentials':'false',
          'Accept':'application/json'
        }
        })
        const data=await res.json();
        if(res.status===200){
          dispatch(deleteUserSuccess(data));
        }
        else{
          dispatch(deleteUserFailure(data.message));
        }
      } catch (err) {
        dispatch(deleteUserFailure(err.message));
        
      }
    }
    const handleSubmit=async (e)=>{
      e.preventDefault();
      if(Object.keys(formData).length===0){
        return;
      }
      try {
        dispatch(updateStart());
        console.log(formData);
        
        const res=await fetch(`/api/user/update/${currentUser._id}`,{
        method:'PUT',
        mode:'cors',
        credentials: 'include',
        headers:{'Content-Type':'application/json',
        'Access-Control-Allow-Origin':'*',
        'Access-Control-Allow-Credentials':'false',
        'Accept':'application/json'
      },
        body:JSON.stringify(formData),
      })
        const data=await res.json();
        console.log(data);
        if(res.status===200){
          setUpdateUserSuccess('User Updated Successfully !!')
          dispatch(updateSuccess(data));
        }
        else{
          setUpdateUserError('User Update Failed !!')
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
            <Button type='submit' gradientDuoTone="purpleToBlue" outline disabled={loading || (imageFileUploadProgress>0 && imageFileUploadProgress<100) }>
              {
                loading ? 'Loading...' :'Update'
              }
            </Button>
            {
              currentUser.isAdmin && (
                <Link to={'/create-post'}>
                  <Button type='button' gradientDuoTone='purpleToPink' className='w-full'>Create Post</Button>
                </Link>
              )
            }
        </form>
        <div className='text-red-500 flex justify-between mt-5'>
          <span className='cursor-pointer ' onClick={handleDelete}>Delete Account</span>
          <span className='cursor-pointer ' onClick={()=>setShowModel2(true)} >Sign Out</span>

        </div>
        {
            updateUserSuccess && (
            <Alert color='success' className='mt-5'>
              {updateUserSuccess}
              
            </Alert>
          )
        }
        {
          updateUserError && (
            <Alert color='failure' className='mt-5'>
              {updateUserError}
            </Alert>
          )
        }
        {
          <Modal show={showModel} onClose={()=> setShowModel(false)} popup size='md'>
            <Modal.Header>
            </Modal.Header>
            <Modal.Body>
              <div className='text-center'>
                <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto'></HiOutlineExclamationCircle>
                <h3 className='mb-5 text-lg text-gray-500'>Are you sure you want to delete your account ?</h3>
                <div className='flex gap-32'>
                  <Button color='failure' onClick={handleDeleteUser}>Yes, I am Sure</Button>
                  <Button color='gray' onClick={()=>setShowModel(false)}>No, Cancel</Button>
                </div>
              </div>
            </Modal.Body>
          </Modal>
        }
        {
          <Modal show={showModel2} onClose={()=> setShowModel2(false)} popup size='md'>
            <Modal.Header>
            </Modal.Header>
            <Modal.Body>
              <div className='text-center'>
                <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto'></HiOutlineExclamationCircle>
                <h3 className='mb-5 text-lg text-gray-500'>Are you sure you want to SignOut from your account ?</h3>
                <div className='flex gap-32'>
                  <Button color='failure' onClick={handleSignOutUser}>Yes, I am Sure</Button>
                  <Button color='gray' onClick={()=>setShowModel2(false)}>No, Cancel</Button>
                </div>
              </div>
            </Modal.Body>
          </Modal>
        }
    </div>
  )
}

export default DashProfile