import firebase from "firebase/compat";

export async function getUserDetails(userUid) {
  // Firestore Database
  const db = firebase.firestore();
  // Users Collection
  const usersRef = db.collection("users");
  // Get the current user
  const userDoc = await usersRef.doc(userUid).onSnapshot(function (snapshot) {
    if (snapshot.exists) {
      const data = snapshot.data();
    } else {
      console.log("Uset document does not exist.");
    }
  });

  if (userDoc) {
    const data = userDoc.data();
    return data;
  } else {
    console.log("userDoc is null.");
    return null
  }
}
