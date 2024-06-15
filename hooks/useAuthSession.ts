import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUser, clearAuth } from "@/redux/auth/auth.slice";
import { RootState } from "@/redux/store";
import axios from "axios";

const useAuthSession = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const token = useSelector((state: RootState)=> state.auth.token);

  useEffect(()=>{
    const checkSession = async()=>{
      if(token){
        try {
          const response = await axios.get('/api/user',{
            headers:{
              Authorization: `Bearer ${token}`,
            },
          });
          dispatch(setUser(response.data.user))
        } catch (error) {
          console.error("Failed to fetch user data:", error);
          dispatch(clearAuth());
        }
      }
    }
  })
  //  implement the logic here to check user session
  return user;
};

export default useAuthSession;
