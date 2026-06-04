import { signOut } from "firebase/auth";

import { auth } from "../firebase/firebase";

function Navbar() {

  return (
    <div className="flex justify-between items-center mb-10">

      <h1 className="text-6xl font-bold text-yellow-400">
        My Notes
      </h1>

      <button
        onClick={()=>signOut(auth)}
        className="bg-red-500 px-6 py-3 rounded-xl"
      >
        Logout
      </button>

    </div>
  );
}

export default Navbar;