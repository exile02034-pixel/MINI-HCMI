import { db } from "../config/firebaseConfig.js";

const attendanceCollection = db.collection("attendance");

export const attendanceRepository = {
  async findByUserAndDate(userId, date) {
    const snapshot = await attendanceCollection
      .where("userId", "==", userId)
      .where("date", "==", date)
      .limit(1)
      .get();

    if (snapshot.empty) return null;

    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() };
  },

  async getById(attendanceId) {
    const doc = await attendanceCollection.doc(attendanceId).get();
    return doc.exists ? { id: doc.id, ...doc.data() } : null;
  },

  create(attendanceId, payload) {
    return attendanceCollection.doc(attendanceId).set(payload);
  },

  update(attendanceId, payload) {
    return attendanceCollection.doc(attendanceId).update(payload);
  },

  async listByUser(userId, limit = 10) {
    const snapshot = await attendanceCollection
      .where("userId", "==", userId)
      .orderBy("createdAt", "desc")
      .limit(limit)
      .get();

    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  },

  async listAll(limit = 50) {
    const snapshot = await attendanceCollection
      .orderBy("createdAt", "desc")
      .limit(limit)
      .get();

    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  },
};
