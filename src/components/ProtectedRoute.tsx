import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function ProtectedRoute() {

const [loading,setLoading] = useState(true)
const [session,setSession] = useState<any>(null)

useEffect(()=>{

const loadSession = async()=>{

const { data } = await supabase.auth.getSession()

setSession(data.session)

setLoading(false)

}

loadSession()

const { data:listener } = supabase.auth.onAuthStateChange(
(_event,session)=>{
setSession(session)
setLoading(false)
}
)

return ()=>{
listener.subscription.unsubscribe()
}

},[])

if(loading){
return null
}

if(!session){
return <Navigate to="/login" replace/>
}

return <Outlet/>

}