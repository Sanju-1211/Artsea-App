import firebase from "firebase/compat";

export async function getUserDetails(userUid) {
  // console.log(`Getting current user details: ${userUid}`);
  // Firestore Database
  const db = firebase.firestore();
  // Users Collection
  const usersRef = db.collection("users");
  // Get the currnt user
  const userDoc = await usersRef.doc(userUid).onSnapshot(function (snapshot) {
    if (snapshot.exists) {
      const data = snapshot.data();
      // setUserDetails(data);
    } else {
      console.log("Uset document does not exist.");
    }
  });

  if (userDoc) {
    // console.log(`got the user details!`);
    const data = userDoc.data();
    // console.log(`data: ${data}`);
    return data;
  } else {
    console.log("userDoc is null.");
    return null
  }
}
