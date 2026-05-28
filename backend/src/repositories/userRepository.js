import { auth, db } from "../config/firebaseConfig.js";

const usersCollection = db.collection("users");

export const userRepository = {
  createAuthUser(payload) {
    return auth.createUser(payload);
  },

  createProfile(uid, profile) {
    return usersCollection.doc(uid).set(profile);
  },

  async getById(uid) {
    const doc = await usersCollection.doc(uid).get();
    return doc.exists ? { id: doc.id, ...doc.data() } : null;
  },

  async getAll() {
    const snapshot = await usersCollection.get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  },
};
