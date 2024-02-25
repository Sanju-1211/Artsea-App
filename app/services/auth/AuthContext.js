import { createContext, useEffect, useState } from "react";
import { errorMessages } from "./errorMessages";
// Library Imports
import firebase from "firebase/compat";
import { useNavigation } from "@react-navigation/native";

export const AuthContext = createContext();

export function AuthContextProvider(props) {
  // Set a state to keep track of the current user.
  const currentUser = firebase.auth().currentUser;
  // If a user is already logged in, use the current User object, or `undefined` otherwise.
  // const [user, setUser] = useState(currentUser ? currentUser : null);
  const [user, setUser] = useState(() => {
    // If a user is already logged in, use the current User object, or `undefined` otherwise.
    return currentUser || null;
  });

  const [userDetails, setUserDetails] = useState(null);
  const [userDetailsUnsubscribe, setUserDetailsUnsubscribe] = useState();

  // Set a state to keep track of any authentication errors.
  const [authError, setAuthError] = useState(null);

  // Set a state to keep track of whether or not the authentication
  // is loading.
  const [isLoading, setIsLoading] = useState(false);

  // Firebase Contants:
  const db = firebase.firestore();
  const usersRef = db.collection("users");

  // useEffect(() => {
  //   firebase.auth().onAuthStateChanged(function (usr) {
  //     console.log(`onAuthStateChanged`);

  //     if (usr) {
  //       console.log("Setting user");
  //       // setIsLoading(true);
  //       setUser(usr);
  //     } else {
  //       console.log(`No user detected`);
  //       // We are not loading authentication.
  //       // setUser(null);
  //       // setUserDetails(null);
  //       // setIsLoading(false);
  //     }
  //   });

  // }, []);
  useEffect(() => firebase.auth().onAuthStateChanged(setUser), []);

  useEffect(() => {
    if (user === null) {
      // console.log(`user is null -- clearing userDetails`);
      setUserDetails(null); // <-- clear data when not logged in
      setIsLoading(false);
      return;
    }
    if (!user) {
      // user still loading, do nothing yet
      return;
    }

    // console.log(`setting user data`);
    // return the unsubscribe function from the snapshot -- so that when the
    // component unmounts, it'll unmount the snapshot listener.
    usersRef.doc(firebase.auth().currentUser.uid).onSnapshot((snapshot) => {
      // console.log(`user:uid: ${user.uid}`);
      if (snapshot.exists) {
        // console.log(`AuthContext: Got user snapshot: Updating userDetails.`);
        const userDetailsObj = snapshot.data();
        setUserDetails(userDetailsObj);
        setIsLoading(false);
      } else {
        console.log(`No snapshot exists`);
        setUserDetails(null);
        setIsLoading(false);
      }
    });
  }, [user]);

  // Function to handle sign in
  function onLogIn(email, password) {
    // Validates the user inputs in the Sign In form, and logs them in.

    // Reset authentication error to null.
    setAuthError(null);

    // As soon as we request a login, we will set
    // loading to true.
    setIsLoading(true);

    // Use firebase authentication method to sign in the user
    // with email id and password.
    // Catch any errors in the authentication process, and display it to
    // the user.
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(function (usr) {
        // The signInWithEmailAndPassword function returns a user object.
        setUser(usr);
      })
      .catch(function (authError) {
        let e = authError.code.toString();
        if (e in errorMessages) {
          // Set the AuthError state.
          setAuthError(errorMessages[e]);
        } else {
          setAuthError(authError.message.toString);
        }
        // and we are done loading authentication.
        setIsLoading(false);
      });
  }

  // Function to handle sign up of new users.
  function onSignUp(email, password, fullName, isArtist) {
    // Validates the user inputs in the Sign Up form, creates their account,
    // and logs them in.

    // Reset authentication error to null.
    setAuthError(null);
    // console.log(`Registering user - ${email}`);
    // As soon as we are done filling in the form and click on register
    // we are loading the authentication.
    setIsLoading(true);
    // console.log(`isLoading: ${isLoading}`);

    // Use firebase authentication method to create the user account
    // with email id and password.

    // Catch any errors in the authentication process, and display it to
    // the user.
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(function (usr) {
        // Get the user login object created
        setUser(usr);
        // set isLoading to false as we are done loading
        setIsLoading(false);
        // Create firestore object for this user and setUserDetails.
        const userDetailsObj = {
          bio: "",
          email: email.toLowerCase(),
          full_name: fullName,
          image: `https://robohash.org/${
            email.split("@")[0]
          }?set=set5`,
          uid: usr.user.uid,
          username: email.split("@")[0],
          type: isArtist? "artist" : "customer", 
        };
        setUserDetails(userDetailsObj);
        // await createUserDetails(usr.user.uid, userDetailsObj);
        firebase
          .firestore()
          .collection("users")
          .doc(usr.user.uid)
          .set(userDetailsObj);
      }
        
      )
      .catch(function (authError) {
        // console.log(`OnSignUp: AuthError: ${authError}`);
        // and done with loading authentication.
        setIsLoading(false);
        console.error(authError);
        let e = authError.code.toString();
        if (e in errorMessages) {
          // Set the AuthError state.
          setAuthError(errorMessages[e]);
        } else {
          setAuthError(authError.message);
        }
      });
  }

  // Function to handle user logging out.
  function onLogout() {
    // console.log("Logging out and setting user to null.");
    try {
      firebase
        .auth()
        .signOut()
        .then(() => {
          setUser(null);
          setAuthError(null);
          // console.log("Signed Out");
        });
    } catch (error) {
      console.log("Error signing out:", error);
    }
  }

  // Return a context provider with:
  // - isAuthenticated: true or false - is there are user currently?
  // - user: current user object
  // - name: Full name of user.
  // - isLoading: Is authentication in process?
  // - authError: Did we get an authError while trying to authenticate?
  // - onLogIn: Logs in using email and password - sets the user.
  // - onSignUp: Registers a user using email and password - sets the user.
  // - onLogout: Logs out the user.
  // - onChangePassword: Function that reauthenticates the user and updates
  // their password.
  return (
    <AuthContext.Provider
      value={{
        // If there is no user, return False.
        isAuthenticated: !!user,
        user,
        userDetails,
        isLoading,
        authError,
        onLogIn,
        onSignUp,
        onLogout,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}
