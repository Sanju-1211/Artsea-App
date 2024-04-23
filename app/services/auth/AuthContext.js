/**
 * Name: AuthContext.js
 * Description: Manages auth state globally. Provides implementation for
 * authenticating users.
 * TODO: Notify user if internet connectivity is low.
 */

// React and ReactNative Imports
import React, { useState, createContext } from "react";
import { Alert } from "react-native";
import firebase from "firebase/compat";

const errorMessages = {
  // Email
  "auth/invalid-email": "The provided value for the email is invalid.",
  "auth/invalid-credential": "The password you entered is incorrect.",
  // Sign In Errors
  "auth/user-not-found":
    "There is no existing UTools user corresponding to the email provided. Use your Udacity account email to Sign Up to UTools instead?",
  // Sign Up Errors
  "auth/email-already-in-use":
    "The provided email is already in use by an existing user. Sign In instead?",
  "auth/email-already-exists":
    "The provided email is already in use by an existing user. Sign In instead?",
  // Password
  // Sign In Errors
  "auth/wrong-password": "Incorrect password. Did you forget your password? ",
  //
  "auth/weak-password":
    "The provided password is invalid. It must be at least six characters.",
  "auth/invalid-password":
    "The provided password is invalid. It must be at least six characters.",
  // Others
  "auth/user-disabled": "Your user account is disabled.",
  "auth/requires-recent-login":
    "Please reauthenticate to complete this action.",
};

export const AuthContext = createContext();

export function AuthContextProvider(props) {
  // Set a state to keep track of whether or not the authentication is loading.
  const [isLoading, setIsLoading] = useState(false);

  // Set a state to keep track of the current user.
  const [user, setUser] = useState(null);
  const [userDetails, setUserDetails] = useState(null);

  // Set a state to keep track of any authentication errors.
  const [authError, setAuthError] = useState(null);

  // Subscribe to the users current authentication state, and receive an
  // event whenever that state changes
  firebase.auth().onAuthStateChanged(async function (usr) {
    // If a user is detected, set the user.
    if (usr) {
      setUser(usr);
    }
  });

  // Function to handle sign in
  function onLogIn(email, password) {
    // Reset authentication error to null.
    setAuthError(null);

    setIsLoading(true);

    // Check if the email is empty.
    if (email == "") {
      setAuthError("Please add your email address.");
      setIsLoading(false);
      return;
    }

    // Check if the password is empty.
    if (password == "") {
      setAuthError("Please provide a password.");
      setIsLoading(false);
      return;
    }

    // Use firebase authentication method to sign in the user
    // with email id and password.
    // Catch any errors in the authentication process, and display it to
    // the user.
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(async function (usr) {
        setUser(usr);
        setIsLoading(false);
      })
      .catch(function (authError) {
        let e = authError.code.toString();
        if (e in errorMessages) {
          setAuthError(errorMessages[e]);
        } else {
          setAuthError(authError.message.toString());
        }
        setIsLoading(false);
      });
  }

  function onSignUp(email, password, fullName, isArtist) {
    // Validates the user inputs in the Sign Up form, creates their account,
    // and logs them in.

    setAuthError(null);

    setIsLoading(true);

    // Use firebase authentication method to create the user account
    // with email id and password.
    // Catch any errors in the authentication process, and display it to
    // the user.
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(function (usr) {
        setUser(usr);
        setIsLoading(false);
        // Create firestore object for this user and setUserDetails.
        const userDetailsObj = {
          bio: "",
          email: email.toLowerCase(),
          full_name: fullName,
          image: `https://media.istockphoto.com/id/1130884625/vector/user-member-vector-icon-for-ui-user-interface-or-profile-face-avatar-app-in-circle-design.jpg?s=612x612&w=0&k=20&c=1ky-gNHiS2iyLsUPQkxAtPBWH1BZt0PKBB1WBtxQJRE=`,
          uid: usr.user.uid,
          username: email.split("@")[0],
          type: "customer",
        };
        setUserDetails(userDetailsObj);
        firebase
          .firestore()
          .collection("users")
          .doc(usr.user.uid)
          .set(userDetailsObj);
      })
      .catch(function (authError) {
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
    firebase
      .auth()
      .signOut()
      .then(() => {
        setUser(null);
        setAuthError(null);
      })
      .catch((e) => {
        // console.log("Sign Out Error: ", e);
      });
  }

  // Function to handle password change.
  function onChangePassword(currentPassword, newPassword) {

    setIsLoading(true);

    // Function to reauthenticate user with current password.
    const reauthenticate = (currentPassword) => {
      let user = firebase.auth().currentUser;
      let cred = firebase.auth.EmailAuthProvider.credential(
        user.email,
        currentPassword
      );
      return user.reauthenticateWithCredential(cred);
    };

    // Reauthenticate the user and update the password.
    reauthenticate(currentPassword)
      .then(() => {
        let user = firebase.auth().currentUser;
        user
          .updatePassword(newPassword)
          .then(() => {
            setIsLoading(false);
            setAuthError(null);
            Alert.alert("Password successfully changed.");
          })
          .catch((authError) => {
            let e = authError.message.toString();
            e = e.split("Firebase: ").pop();
            e = e.split("(auth")[0];
            setAuthError(e);
          });
      })
      .catch((authError) => {
        let e = authError.code.toString();
        if (e in errorMessages) {
          setAuthError(errorMessages[e]);
        } else {
          setAuthError(authError.message.toString);
        }
        setIsLoading(false);
      });
  }

  async function onPasswordResetRequest(email, navigation) {
    console.log("Sending Password Reset Email");
    setIsLoading(true);
    setAuthError(null);
    if (email == "") {
      setAuthError("Please add your email address.");
      setIsLoading(false);
      return;
    }
    await firebase
      .auth()
      .sendPasswordResetEmail(email)
      .then(() => {
        Alert.alert("Password reset email sent!");
        setEmail(""); 
        setIsLoading(false);
        setAuthError(null);
        navigation.navigate("Sign In");
      })
      .catch((authError) => {
        let e = authError.code.toString();
        if (e in errorMessages) {
          setAuthError(errorMessages[e]);
        } else {
          setAuthError(authError.message.toString);
        }
        setIsLoading(false);
      });
  }

  // Return a context provider with:
  // - isAuthenticated: true or false - is there are user currently?
  // - user: current user object
  // - userDetails: user details.
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
        isAuthenticated: !!user,
        user,
        userDetails,
        isLoading,
        authError,
        onLogIn,
        onSignUp,
        onLogout,
        onChangePassword,
        onPasswordResetRequest,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}
