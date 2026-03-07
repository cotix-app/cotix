import { Navigate, Outlet } from "react-router-dom"
import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"

export default function AdminRoute(){

  const [loading,setLoading] = useState(true)
  const [isAdmin,setIsAdmin] = useState(false)

  useEffect(()=>{
    checkAdmin()
  },[])

  const checkAdmin = async()=>{

    const { data:userData } = await supabase.auth.getUser()

    if(!userData.user){
      setLoading(false)
      return
    }

    const { data } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userData.user.id)
      .single()
      console.log("PROFILE:", data)

    if(data?.role === "admin"){
      setIsAdmin(true)
    }

    setLoading(false)

  }

  if(loading) return null

  if(!isAdmin) return <Navigate to="/"/>

  return <Outlet/>

}