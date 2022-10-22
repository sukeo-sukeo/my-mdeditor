import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import { appConfig } from "../config/app.config.js";
import {
  deleteObject,
  getDownloadURL,
  ref as storageRef,
  uploadBytes,
} from "firebase/storage";
import { db, storage } from "../config/firebase.js"

export const upload = async (data, place, id = "") => {
  const docRef = id && place === "blog" ?
    await setDoc(doc(db, place, id), data) :
    await addDoc(collection(db, place), data);
  // return docRef.id
};

export const uploadImage = async (file, uuid) => {
  const sRef = storageRef(storage, `images/${uuid}/${file.name}`);
  await uploadBytes(sRef, file);
  const imgURL = await getDownloadURL(sRef);
  return imgURL
}

export const dataLoad = async (place, id="") => {
  let result = [];

  if (id) {
    const docRef = doc(db, place, id);
    const docSnap = await getDoc(docRef);
    result = docSnap.data();
  } else {
    const docRefs = await getDocs(collection(db, place));
    
    docRefs.forEach((d) => {
      const data = d.data();
      data.id = d.id
      result.push(data);
    });

    result = result.sort((a, b) => a.created_at > b.created_at ? -1 : 1);
  }
  return result
}

export const deleteStorage = async (id, name) => {
  const docRef = doc(db, "image", id);
  const snapShot = await getDoc(docRef);
  const storageId = snapShot.data().storageId;
  const deleteRef = storageRef(storage, `images/${storageId}/${name}`);
  await deleteObject(deleteRef)
} 

export const deleteData = async (place, id) => {
  await deleteDoc(doc(db, place, id));
}

export const existInBlog = async (pageKey, word) => {
  const blogList = await dataLoad("blog");
  const existed = blogList.filter(d => {
    if (typeof d[pageKey] === "string") {
      return d[pageKey] === word
    }
    if (typeof d[pageKey] === "array") {
      return d[pageKey].includes(word)
    }

  })
  return existed.length
}

export const updateData = async (place, updated, targetId) => {
  // categoryのアップデート
  console.log(place, updated, targetId);
  // blogのアップデート
}