import { addDoc, collection, doc, getDocs, setDoc } from "firebase/firestore";
import { appConfig } from "../config/app.config.js";
import {
  getDownloadURL,
  ref as storageRef,
  uploadBytes,
} from "firebase/storage";
import { db, storage } from "../config/firebase.js"

export const upload = async (data, place) => {
  console.log(data);
  const docRef = await addDoc(collection(db, place), data);
  console.log(docRef.id);
  return docRef.id
};

export const uploadImage = async (file, uuid) => {
  const sRef = storageRef(storage, `images/${uuid}/${file.name}`);
  await uploadBytes(sRef, file);
  const imgURL = await getDownloadURL(sRef);
  return imgURL
}

export const dataLoad = async (place) => {
  const result = [];
  const docRefs = await getDocs(collection(db, place));
  
  docRefs.forEach((d) => {
    const data = d.data();
    // console.log(data);
    result.push(data);
  });
  return result
}
