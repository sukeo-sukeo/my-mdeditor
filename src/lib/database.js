import { addDoc, collection, doc, getDocs, setDoc } from "firebase/firestore";
import { appConfig } from "../config/app.config.js";
import {
  getDownloadURL,
  ref as storageRef,
  uploadBytes,
} from "firebase/storage";
import { db, storage } from "../config/firebase.js"

export const upload = async (data, place, id = "") => {
  console.log(id);
  const docRef = id && place === "blog" ?
    await setDoc(doc(db, place, id), data) :
    await addDoc(collection(db, place), data);
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
    data.id = d.id
    // console.log(data);
    result.push(data);
  });
  return result
}
