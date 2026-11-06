import { useState, useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";
import { auth, db } from "./firebase";
import AuthPage from "./AuthPage";

export default function App() {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  const [name, setName] = useState("");
  const [savedName, setSavedName] = useState("");
  const [photoURL, setPhotoURL] = useState("");

  useEffect(() => {
    return onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setReady(true);
    });
  }, []);

  useEffect(() => {
    if (!user) return;
    async function loadData() {
      const snap = await getDoc(doc(db, "students", user.uid));
      if (snap.exists()) {
        setSavedName(snap.data().name || "");
        setName(snap.data().name || "");
        setPhotoURL(snap.data().photoURL || "");
      }
    }
    loadData();
  }, [user]);

  async function handleSave(e) {
    e.preventDefault();
    await setDoc(doc(db, "students", user.uid), { name }, { merge: true });
    setSavedName(name);
  }

  async function handleDelete() {
    await deleteDoc(doc(db, "students", user.uid));
    setSavedName("");
    setName("");
    setPhotoURL("");
  }

  // converts to Base64 text and saves directly to Firestore since storage is not free
  function handlePhotoUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Image = reader.result;
      await setDoc(doc(db, "students", user.uid), { photoURL: base64Image }, { merge: true });
      setPhotoURL(base64Image);
    };
    reader.readAsDataURL(file);
  }

  if (!ready) return <p>Loading...</p>;
  if (!user) return <AuthPage />;

  return (
    <main style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Student Dashboard</h1>
      <p><strong>Signed in UID:</strong> {user.uid}</p>
      <button onClick={() => signOut(auth)}>Sign Out</button>

      <hr />

      {savedName ? <h2>Hello, {savedName}!</h2> : <p>No profile saved yet.</p>}

      {photoURL && (
        <div style={{ margin: "1rem 0" }}>
          <img src={photoURL} alt="Profile Avatar" style={{ width: "120px", height: "120px", borderRadius: "50%", objectFit: "cover" }} />
        </div>
      )}

      <form onSubmit={handleSave} style={{ marginTop: "1rem" }}>
        <input 
          type="text" 
          placeholder="Enter your name" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          required 
        />
        <button type="submit">Save Name</button>
      </form>

      {savedName && (
        <button onClick={handleDelete} style={{ color: "red", marginTop: "1rem" }}>
          Delete Saved Profile
        </button>
      )}

      <div style={{ marginTop: "1rem" }}>
        <label>Upload Photo: </label>
        <input type="file" accept="image/*" onChange={handlePhotoUpload} />
      </div>
    </main>
  );
}