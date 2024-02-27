/**
 * Name: AuthContext.js
 * Description: Manages auth state globally. Provides implementation for
 * authenticating users.
 * TODO: Notify user if internet connectivity is low.
 */

// React and ReactNative Imports
import React, { useState, createContext } from "react";
import { Alert } from "react-native";

// Library Imports
import firebase from "firebase/compat";
// import { functions as firebaseFunctions } from "firebase/compat/functions";
import { getFunctions, httpsCallable } from "firebase/functions";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Data
// Students who can register to the app.

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

// The following line creates a context object.
// When React renders a component tha subscribes to this Context object,
// it will read the current context value from the closest matching
// Context Provider above it in the tree.
export const AuthContext = createContext();

export function AuthContextProvider(props) {
  // Set a state to keep track of whether or not the authentication
  // is loading.
  const [isLoading, setIsLoading] = useState(false);

  // Set a state to keep track of the current user.
  const [user, setUser] = useState(null);

  // Set a state to keep track of any authentication errors.
  const [authError, setAuthError] = useState(null);

  // Set a state to keep track of name of the user.
  const [name, setName] = useState(null);

  // Subscribe to the users current authentication state, and receive an
  // event whenever that state changes
  firebase.auth().onAuthStateChanged(async function (usr) {
    // If a user is detected, set the user to that user and their name.

    if (usr) {
      setUser(usr);
      // console.log(`usr email: ${usr.email}`);
      // console.log(`onAuth: usr: ${JSON.stringify(usr)}`);
      // Move Name to Firestore and setName
      // console.log(usr);
      // firebase
      //   .firestore()
      //   .collection("users")
      //   .doc(usr.uid) // Set default values
      //   .get()
      //   .then((doc) => {
      //     if (doc.exists) {
      //       const fullName = doc.data().fullName;
      //       // console.log(doc.data());
      //       setName(fullName);
      //     }
      //   })
      //   .catch((error) => {
      //     // console.log(`error getting user's name: ${error}`);
      //   });
      try {
        await AsyncStorage.getItem(
          `${firebase.auth().currentUser.uid}-fullName`
        ).then((fullName) => {
          // console.log(`authstatechange: fullName: ${fullName}`);
          if (fullName !== null) {
            setName(fullName);
            // console.log(`authstatechange: name: ${fullName}`);
          }
        });
      } catch (error) {
        // console.log(`error getting user's name: ${error}`);
      }

      // Set the user's name.
      // let email = usr["email"];
      // let studentUser = students[email];
      // if (studentUser !== undefined) {
      //   let firstName = studentUser["firstName"];
      //   let lastName = studentUser["lastName"];
      //   setName(`${firstName} ${lastName}`);
      //   // console.log(`onAuth: name: ${firstName} ${lastName}`);
      // }
      // We are not loading authentication.
    } else {
      // We are not loading authentication.
    }
  });

  // Function to handle sign in
  function onLogIn(email, password) {
    // Validates the user inputs in the Sign In form, and logs them in.

    // Reset authentication error to null.
    setAuthError(null);
    // console.log(`Logging in user - ${email}`);
    // As soon as we request a login, we will set
    // loading to true.
    setIsLoading(true);

    // Check if the email is empty.
    if (email == "") {
      setAuthError("Please add your email address.");
      setIsLoading(false);
      return;
    }

    // Check if the password is empty.
    if (password == "") {
      // console.log("Please provide a password.");
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
        // The signInWithEmailAndPassword function returns a user object.
        // console.log(`usr credential: ${usr}`);
        // console.log(`user: ${usr.user}`);
        setUser(usr);

        try {
          const uid = firebase.auth().currentUser.uid;
          const fullName = await AsyncStorage.getItem(`${uid}-fullName`);
          if (fullName !== null) {
            setName(fullName);
            // console.log(`authstatechange: name: ${fullName}`);
          } else {
            // console.log(
            //   "fullName is null: Calling Firebase Function to Get Name"
            // );
            const functions = getFunctions();
            const validUser = httpsCallable(functions, "validUser");

            validUser({ email: email }).then(async (result) => {
              const firstName = result.data.firstName;
              const lastName = result.data.lastName;
              setName(`${firstName} ${lastName}`);
              // console.log(
              //   `onLogIn: validUser: fullName: ${firstName} ${lastName}`
              // );
              await AsyncStorage.setItem(
                `${uid}-fullName`,
                `${firstName} ${lastName}`
              );
            });
          }
        } catch (error) {
          // console.log(`error getting user's name: ${error}`);
        }

        // Move Name to Firestore and setName
        // firebase
        //   .firestore()
        //   .collection("users")
        //   .doc(usr.uid) // Set default values
        //   .get()
        //   .then((doc) => {
        //     if (doc.exists) {
        //       const fullName = doc.data().fullName;
        //       // console.log(doc.data());
        //       setName(fullName);
        //     }
        //   })
        //   .catch((error) => {
        //     console.log("Error getting user's document", error);
        //   });
        // Set user name
        // let firstName = students[email]["firstName"];
        // let lastName = students[email]["lastName"];
        // setName(`${firstName} ${lastName}`);
        // console.log(`onLogIn: name: ${firstName} ${lastName}`);

        // set isLoading to false as we are done loading authentication
        setIsLoading(false);
        // console.log(`User logged in: ${usr}`);
      })
      .catch(function (authError) {
        let e = authError.code.toString();
        if (e in errorMessages) {
          // Set the AuthError state.
          setAuthError(errorMessages[e]);
        } else {
          setAuthError(authError.message.toString());
        }

        // and we are done loading authentication.
        setIsLoading(false);
      });
  }

  // Function to handle sign up of new users.
  async function onSignUp(email, password, confirmPassword) {
    // Validates the user inputs in the Sign Up form, creates their account,
    // and logs them in.
    // const response = await validUser({ email });
    // Reset authentication error to null.
    setAuthError(null);
    // As soon as we are done filling in the form and click on register
    // we are loading the authentication.
    setIsLoading(true);

    (result) => {
        // console.log(`Ran function: Result: ${JSON.stringify(result.data)}`);
          // console.log("User is allowed in the pilot.");
          // console.log(`Registering user - ${email}`);

          // Get the first name and last name from onCall method
          // and store it here.
          const firstName = result.data.firstName;
          const lastName = result.data.lastName;
          setName(`${firstName} ${lastName}`);
          // console.log(`Name of User: ${firstName} ${lastName}.`);

          // Check if the email is empty.
          if (email == "") {
            // console.log("Please add your email address.");
            setIsLoading(false);
            setAuthError("Please add your email address.");
            return;
          }

          // Check if the password is empty.
          if (password == "") {
            // console.log("Please provide a password.");
            setIsLoading(false);
            setAuthError("Please provide a password.");
            return;
          }

          // Check if confirmPassword field is empty.
          if (confirmPassword == "") {
            // console.log("Please confirm your password.");
            setIsLoading(false);
            setAuthError("Please confirm your password.");
            return;
          }

          // Let's make sure that the password and confirm password
          // are the same.
          if (password !== confirmPassword) {
            // console.log("Passwords do not match.");
            setIsLoading(false);
            setAuthError("Please ensure that the passwords match.");
            return;
          }

          if (password === confirmPassword) {
            // Use firebase authentication method to create the user account
            // with email id and password.

            // Catch any errors in the authentication process, and display it to
            // the user.
            firebase
              .auth()
              .createUserWithEmailAndPassword(email, password)
              .then(async function (usr) {
                // The createUserWithEmailAndPassword function returns a user object.
                // console.log(`Setting user to: ${JSON.stringify(usr)}`);
                setUser(usr);

                try {
                  const currentUserUid = firebase.auth().currentUser.uid;
                  await AsyncStorage.setItem(
                    `${currentUserUid}-fullName`,
                    `${firstName} ${lastName}`
                  );
                } catch (error) {
                  // console.log("Error saving name to AsyncStorage", error);
                }

                // Upload user data to firestore.
                firebase
                  .firestore()
                  .collection("users")
                  .doc(firebase.auth().currentUser.uid) // Set default values
                  .set({
                    // Not setting fullName and email here
                    uid: firebase.auth().currentUser.uid,
                    expoPushToken: null,
                  })
                  .catch((error) => {
                    // console.log("Error setting user's document", error);
                  });

                // console.log(`Registering: name: ${firstName} ${lastName}`);

                // set isLoading to false as we are done loading
                setIsLoading(false);
                // console.log(
                //   `User: ${JSON.stringify(usr.user.email)}: is registered.`
                // );
              })
              .catch(function (authError) {
                // console.log(`OnSignUp: AuthError: ${authError}`);
                // and done with loading authentication.
                setIsLoading(false);
                let e = authError.code.toString();
                if (e in errorMessages) {
                  // Set the AuthError state.
                  setAuthError(errorMessages[e]);
                  return;
                } else {
                  setAuthError(authError.message.toString);
                  return;
                }
              });
          }
        }
      }

        // Function to handle user logging out.
  function onLogout() {
    // console.log("Logging out and setting user to null.");
    firebase
      .auth()
      .signOut()
      .then(() => {
        setUser(null);
        setAuthError(null);
        // console.log("Signed Out");
      })
      .catch((e) => {
        // console.log("Sign Out Error: ", e);
      });
  }

  // Function to handle password change.
  function onChangePassword(currentPassword, newPassword) {
    // As soon as we click the change password button, we set loading to true.
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
            // console.log("Password updated!");
            Alert.alert("Password successfully changed.");
          })
          .catch((authError) => {
            // If there is an error:
            // - Remove "Firebase" from the start of the message.
            // - Remove "(auth/)" from the end of the message.
            let e = authError.message.toString();
            e = e.split("Firebase: ").pop();
            e = e.split("(auth")[0];

            // Set the AuthError state.
            setAuthError(e);
          });
      })
      .catch((authError) => {
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

  async function onPasswordResetRequest(email, setEmail, forgotPasswordProps) {
    // console.log("Sending Password Reset Email");
    setIsLoading(true);
    setAuthError(null);
    await firebase
      .auth()
      .sendPasswordResetEmail(email)
      .then(() => {
        Alert.alert("Password reset email sent!");
        setEmail(""); // Clear email field
        setIsLoading(false);
        setAuthError(null);
        forgotPasswordProps.navigation.navigate("Sign In");
      })
      .catch((authError) => {
        let e = authError.code.toString();
        if (e in errorMessages) {
          // Set the AuthError state.
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
        name,
        isLoading,
        authError,
        setAuthError,
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



