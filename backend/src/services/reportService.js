import { dailySummaryRepository } from "../repositories/dailySummaryRepository.js";
import { userRepository } from "../repositories/userRepository.js";
import { serializeTimestamp } from "../utils/serialization.js";

const serializeUser = (user) => ({
  uid: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  timezone: user.timezone,
  schedule: user.schedule,
  createdAt: serializeTimestamp(user.createdAt),
});

const getWeekStart = (input) => {
  if (input) return input;

  const current = new Date();
  const day = current.getUTCDay();
  const diff = day === 0 ? -6 : 1 - day;
  current.setUTCDate(current.getUTCDate() + diff);

  return current.toISOString().split("T")[0];
};

const sumSummaryMetrics = (items) =>
  items.reduce(
    (acc, item) => {
      acc.totalHours += item.totalHours || 0;
      acc.regularHours += item.regularHours || 0;
      acc.overtimeHours += item.overtimeHours || 0;
      acc.nightDiffHours += item.nightDiffHours || 0;
      acc.lateMinutes += item.lateMinutes || 0;
      acc.undertimeMinutes += item.undertimeMinutes || 0;
      return acc;
    },
    {
      totalHours: 0,
      regularHours: 0,
      overtimeHours: 0,
      nightDiffHours: 0,
      lateMinutes: 0,
      undertimeMinutes: 0,
    }
  );

const loadUserMap = async () => {
  const users = await userRepository.getAll();
  return new Map(users.map((user) => [user.id, serializeUser(user)]));
};

export const reportService = {
  async getDailyReports(date = new Date().toISOString().split("T")[0]) {
    const [summaries, userMap] = await Promise.all([
      dailySummaryRepository.listByDate(date),
      loadUserMap(),
    ]);

    return summaries.map((summary) => ({
      id: summary.id,
      userId: summary.userId,
      date: summary.date,
      attendanceId: summary.attendanceId,
      status: summary.status,
      totalHours: summary.totalHours || 0,
      regularHours: summary.regularHours || 0,
      overtimeHours: summary.overtimeHours || 0,
      nightDiffHours: summary.nightDiffHours || 0,
      lateMinutes: summary.lateMinutes || 0,
      undertimeMinutes: summary.undertimeMinutes || 0,
      updatedAt: serializeTimestamp(summary.updatedAt),
      employee: userMap.get(summary.userId) || null,
    }));
  },

  async getWeeklyReports(inputWeekStart) {
    const weekStart = getWeekStart(inputWeekStart);
    const weekEndDate = new Date(`${weekStart}T00:00:00.000Z`);
    weekEndDate.setUTCDate(weekEndDate.getUTCDate() + 6);
    const weekEnd = weekEndDate.toISOString().split("T")[0];

    const [summaries, userMap] = await Promise.all([
      dailySummaryRepository.listByDateRange(weekStart, weekEnd),
      loadUserMap(),
    ]);

    const grouped = new Map();

    for (const summary of summaries) {
      const userSummaries = grouped.get(summary.userId) || [];
      userSummaries.push(summary);
      grouped.set(summary.userId, userSummaries);
    }

    return Array.from(grouped.entries()).map(([userId, items]) => ({
      userId,
      weekStart,
      weekEnd,
      employee: userMap.get(userId) || null,
      totals: sumSummaryMetrics(items),
      dailyBreakdown: items
        .sort((a, b) => a.date.localeCompare(b.date))
        .map((item) => ({
          date: item.date,
          attendanceId: item.attendanceId,
          status: item.status,
          totalHours: item.totalHours || 0,
          regularHours: item.regularHours || 0,
          overtimeHours: item.overtimeHours || 0,
          nightDiffHours: item.nightDiffHours || 0,
          lateMinutes: item.lateMinutes || 0,
          undertimeMinutes: item.undertimeMinutes || 0,
          updatedAt: serializeTimestamp(item.updatedAt),
        })),
    }));
  },
};
