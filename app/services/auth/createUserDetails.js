export async function createUserDetails(userUid, userDetails) {
  console.log(`Create user details: ${userUid}`);
  // Firestore Database
  const db = firebase.firestore();
  // Users Collection
  const usersRef = db.collection("users");

  // Set the current user
  const userDeetailsPromise = await usersRef.doc(userUid).set(userDetails);
  if (userDeetailsPromise) {
    console.log("User details created");
  }
}
