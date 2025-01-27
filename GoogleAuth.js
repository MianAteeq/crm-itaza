/* eslint-disable prettier/prettier */
import { loadAuth2 ,gapi } from "gapi-script";

export const CLIENT_ID = "1089287211005-ff5qc8h5q4df555chhoqgkpmlo5kou45.apps.googleusercontent.com";
const API_KEY = "AIzaSyDctj1uGgjIt4b8NrEiacONBX3mPqOnt60";
const SCOPES = "https://www.googleapis.com/auth/contacts";

export const initGoogleAPI = () => {
  return new Promise((resolve, reject) => {
    gapi.load("client:auth2", async () => {
      try {
        await gapi.client.init({
          apiKey: API_KEY,
          clientId: CLIENT_ID,
          scope: SCOPES,
          discoveryDocs: [
            "https://people.googleapis.com/$discovery/rest?version=v1",
          ],
        });
        resolve(gapi.auth2.getAuthInstance());
      } catch (error) {
        reject(error);
      }
    });
  });
};

export const signInGoogle = async () => {
  const authInstance = gapi.auth2.getAuthInstance();
  return authInstance.signIn();

};

export const checkUserLogin = async () => {
  const authInstance = gapi.auth2.getAuthInstance().isSignedIn.get();
  return authInstance;
};
export const getCurrentUser = async () => {
  const authInstance = gapi.auth2.getAuthInstance().currentUser.get();
  return authInstance;
};

export const signOut = async () => {
  const authInstance = gapi.auth2.getAuthInstance();
  return authInstance.signOut();
};

export const addContact = async (contact) => {
  try {
    const response = await gapi.client.people.people.createContact({
      resource: contact,
    });
    return response.result;
  } catch (error) {
    console.error("Error creating contact:", error);
    throw error;
  }
};
