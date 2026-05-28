import { db } from "../config/firebaseConfig.js";

const dailySummaryCollection = db.collection("dailySummary");

export const dailySummaryRepository = {
  save(summaryId, payload) {
    return dailySummaryCollection.doc(summaryId).set(payload, { merge: true });
  },

  remove(summaryId) {
    return dailySummaryCollection.doc(summaryId).delete();
  },

  async listByDate(date) {
    const snapshot = await dailySummaryCollection.where("date", "==", date).get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  },

  async listByDateRange(startDate, endDate) {
    const snapshot = await dailySummaryCollection
      .where("date", ">=", startDate)
      .where("date", "<=", endDate)
      .get();

    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  },
};
