import { useEffect, useState } from "react";

import {
  onAuthStateChanged
} from "firebase/auth";

import { auth } from "./firebase/firebase";

import Home from "./pages/Home";

import Auth from "./pages/Auth";

function App() {

  const [user,setUser] = useState(null);

  useEffect(()=>{

    const unsubscribe = onAuthStateChanged(
      auth,
      (currentUser)=>{
        setUser(currentUser);
      }
    );

    return ()=>unsubscribe();

  },[]);

  return (
    <>
      {
        user
        ?
        <Home user={user} />
        :
        <Auth />
      }
    </>
  );
}

export default App;