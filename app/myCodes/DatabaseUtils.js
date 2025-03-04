import { DATABASE } from "../../Firebase";
import { addToDoc, updateArrayDatabaseItem } from "./Database"
import { getFirestore, collection, addDoc, getDocs, query, where } from "firebase/firestore";

export const addEmailToList = (name, email) => {
    //addToDatabase('Admin', 'Emails', 'emails', {email})
    addToDoc('Emails', name, { email: email })
}

export const addUIDToList = (UID) => {
    //addToDatabase('Admin', 'Emails', 'emails', {email})
    updateArrayDatabaseItem('Admin', 'Users', 'allUIDs', UID)
}



export async function addUniqueUsername(userName) {
  const userCollection = collection(DATABASE, "Owners");

  // Check if username already exists
  const userQuery = query(userCollection, where("userName", "==", userName));
  const querySnapshot = await getDocs(userQuery);

  if (!querySnapshot.empty) {
   
    return false;
  }

  // Add the unique username
  
  return true
}