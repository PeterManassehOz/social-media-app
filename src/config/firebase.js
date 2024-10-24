// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import { toast } from "react-toastify";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyATPNIwJyZZAhaUTeWIanKxqpVaI3xaXuc",
  authDomain: "empire-d804c.firebaseapp.com",
  projectId: "empire-d804c",
  storageBucket: "empire-d804c.appspot.com",
  messagingSenderId: "382674474985",
  appId: "1:382674474985:web:1e9732fbc26b973bb9dd78"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const signup = async (username, email, password) => {
    try {
        const res = await createUserWithEmailAndPassword(auth, email, password);
        const user = res.user;
        await setDoc(doc(db, "users", user.uid), {
            id: user.uid,
            username: username.toLowerCase(),
            email,
            name: '',
            avatar: '',
            bio: 'Hey, I am using Empire.',
            lastSeen: Date.now()
        })
      await setDoc(doc(db, 'chats', user.uid), {
          chatsData: []
      })
    } catch (error) {
        console.error(error)
        toast.error(error.code.split('/')[1].split('-').join(' '));
    }
 
};

const login = async (email, password) => {
    try {
        await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
        console.error(error)
        toast.error(error.code.split('/')[1].split('-').join(' '));
    }
};

const logout = async () => {
   try {
      await signOut(auth);
   } catch (error) {
      console.error(error)
      toast.error(error.code.split('/')[1].split('-').join(' '));
   }
   
};

export { auth, db, signup, login, logout };