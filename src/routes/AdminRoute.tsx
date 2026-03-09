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

const { data:sessionData } = await supabase.auth.getSession()

const user = sessionData.session?.user

if(!user){
setLoading(false)
return
}

const { data } = await supabase
.from("profiles")
.select("role")
.eq("id", user.id)
.maybeSingle()

console.log("PROFILE:", data)

if(data?.role === "admin"){
setIsAdmin(true)
}

setLoading(false)

}

if(loading) return null

if(!isAdmin) return <Navigate to="/" replace/>

return <Outlet/>

}