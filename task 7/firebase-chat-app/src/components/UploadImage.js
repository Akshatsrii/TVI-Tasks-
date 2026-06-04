import { useState } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { storage, db, auth } from "../firebase";

const MAX_MB = 5;

function UploadImage() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress]   = useState(0);
  const [error, setError]         = useState(null);

  const upload = async (e) => {
    const file = e.target.files[0];
    e.target.value = "";

    if (!file) return;

    const user = auth.currentUser;
    if (!user) return;

    if (!file.type.startsWith("image/")) {
      setError("Only image files are allowed.");
      return;
    }
    if (file.size > MAX_MB * 1024 * 1024) {
      setError(`Image must be under ${MAX_MB}MB.`);
      return;
    }

    setError(null);
    setUploading(true);
    setProgress(0);

    try {
      const imageRef = ref(storage, `chat-images/${user.uid}/${uuidv4()}`);
      const task = uploadBytesResumable(imageRef, file);

      task.on("state_changed", (snap) => {
        setProgress(Math.round((snap.bytesTransferred / snap.totalBytes) * 100));
      });

      await task;
      const url = await getDownloadURL(imageRef);

      await addDoc(collection(db, "messages"), {
        imageUrl:  url,
        uid:       user.uid,
        name:      user.displayName,
        photoURL:  user.photoURL,
        timestamp: serverTimestamp(),
      });
    } catch (err) {
      console.error("Upload failed:", err);
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <div className="upload-wrapper">
      <label
        aria-label="Upload image"
        className={`upload-btn ${uploading ? "disabled" : ""}`}
      >
        {uploading ? `Uploading ${progress}%` : "📷 Upload"}
        <input
          type="file"
          accept="image/*"
          onChange={upload}
          disabled={uploading}
          hidden
        />
      </label>
      {error && <p role="alert" className="upload-error">{error}</p>}
    </div>
  );
}

export default UploadImage;