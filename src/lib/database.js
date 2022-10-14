import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import { db } from "../config/firebase.js"

export const upload = async (data, place) => {
  console.log(data);
  console.log(data.category);
  console.log(data.tags);
  // firestoreのコレクションを確認
  // なければ新規追加 { name, created_at }
  const docRef = await addDoc(collection(db, place), data);
  console.log(docRef.id);
  return docRef.id
};


// blog
// category
// "test"
// content
// "# testです"
// created_at
// 2022年10月15日 5:29:53 UTC+9
// published
// true
// tag
// 0
// "hoge"
// 1
// "foo"
// （文字列）
// 2
// "bar"
// thumnail_url
// "hogehoge"
// title
// "test"
// updated_at
// 2022年10月15日 5:30:25 UTC+9