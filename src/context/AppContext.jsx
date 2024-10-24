import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { createContext, useEffect, useState } from "react";
import { auth, db } from "../config/firebase";
import { useNavigate } from "react-router-dom";

export const AppContext = createContext();  

const AppContextProvider = ( props ) => {
    
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [chatData, setChatData] = useState(null);
    const [messagesId, setMessagesId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [chatUser, setChatUser] = useState(null);
    //const [removeChat, setRemoveChat] = useState(null);

    const loadUserData = async (uid) => {
        try {
            const userRef = doc(db, "users", uid);
            const userSnap = await getDoc(userRef);
            const userData = userSnap.data();
            setUserData(userData);
            if (userData.avatar && userData.name) {
                navigate("/chat");
            } else {
                navigate("/profile");
            }
            await updateDoc(userRef, {
                lastSeen: Date.now()
            })
            setInterval( async() => {
               if (auth.chatUser) {
                   await updateDoc(userRef, {
                       lastSeen: Date.now()
                   })
               }
            }, 60000)
        } catch (error) {
            
        }
    }

useEffect(() => {
          if (userData) {
    const chatRef = doc(db, "chats", userData.id);
      const unSub = onSnapshot(chatRef, async (res) => {
                const chatItems = res.data().chatsData;
                  const tempData = [];
              for (const item of chatItems) {
                      const userRef = doc(db, "users", item.rid);
              const userSnap = await getDoc(userRef);
                       const userData = userSnap.data();
              tempData.push({...item, userData});
                   }
                setChatData(tempData.sort((a, b) => b.updatedAt - a.updatedAt));
          })
         return () => {
             unSub();
              }
           }
    }, [userData])


    const value = { 
        userData,
        setUserData,
        chatData,
        setChatData,
        loadUserData,
        messages,
        setMessages,
        messagesId,
        setMessagesId,
        chatUser,
        setChatUser,
        //removeChat,
        //setRemoveChat
      }
  
      return (
          <AppContext.Provider value={value}>
             {props.children}
          </AppContext.Provider>
      )
  };
  
  export default AppContextProvider;


/*

Code from GPT to prevent error message in console on log out

import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { createContext, useEffect, useState } from "react";
import { auth, db } from "../config/firebase";
import { useNavigate } from "react-router-dom";

export const AppContext = createContext();  

const AppContextProvider = (props) => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [chatData, setChatData] = useState(null);

    const loadUserData = async (uid) => {
        try {
            const userRef = doc(db, "users", uid);
            const userSnap = await getDoc(userRef);
            const userData = userSnap.data();
            setUserData(userData);
            if (userData.avatar && userData.name) {
                navigate("/chat");
            } else {
                navigate("/profile");
            }
            await updateDoc(userRef, {
                lastSeen: Date.now(),
            });
            setInterval(async () => {
                if (auth.currentUser) {  // Check if user is logged in
                    await updateDoc(userRef, {
                        lastSeen: Date.now(),
                    });
                }
            }, 60000);
        } catch (error) {
            console.error("Error loading user data:", error);
        }
    };

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                loadUserData(user.uid);
            } else {
                setUserData(null); // Reset user data on logout
                setChatData(null); // Reset chat data on logout
            }
        });

        return () => unsubscribe(); // Cleanup on unmount
    }, []);

    useEffect(() => {
        if (userData) {
            const chatRef = doc(db, "chats", userData.id);
            const unSub = onSnapshot(chatRef, async (res) => {
                const chatItems = res.data()?.chatsData || [];
                const tempData = [];
                
                if (Array.isArray(chatItems)) {
                    for (const item of chatItems) {
                        const userRef = doc(db, "users", item.rid);
                        const userSnap = await getDoc(userRef);
                        const userData = userSnap.data();
                        tempData.push({ ...item, userData });
                    }
                    setChatData(tempData.sort((a, b) => b.updatedAt - a.updatedAt));
                } else {
                    console.error("chatItems is not an array:", chatItems);
                }
            });

            return () => {
                unSub();
            };
        } else {
            setChatData(null); // Reset chat data if userData is null
        }
    }, [userData]);

    const value = { 
        userData,
        setUserData,
        chatData,
        setChatData,
        loadUserData
    };

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};

export default AppContextProvider;
*/