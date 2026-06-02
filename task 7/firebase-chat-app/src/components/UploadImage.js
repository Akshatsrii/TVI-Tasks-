import {
  ref,
  uploadBytes,
  getDownloadURL
} from "firebase/storage";

import {
  addDoc,
  collection,
  serverTimestamp
} from "firebase/firestore";

import {
  storage,
  db,
  auth
} from "../firebase";

function UploadImage() {

  const upload = async (e) => {

    const file = e.target.files[0];

    if (!file) return;

    const imageRef = ref(
      storage,
      `chat-images/${Date.now()}-${file.name}`
    );

    await uploadBytes(
      imageRef,
      file
    );

    const url =
      await getDownloadURL(imageRef);

    await addDoc(
      collection(db, "messages"),
      {
        imageUrl: url,
        uid: auth.currentUser.uid,
        name: auth.currentUser.displayName,
        photoURL:
          auth.currentUser.photoURL,
        timestamp: serverTimestamp()
      }
    );
  };

  return (
    <input
      type="file"
      accept="image/*"
      onChange={upload}
    />
  );
}

export default UploadImage;