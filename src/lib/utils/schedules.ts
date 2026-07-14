import { schedules, testRuns } from "@/lib/data/mock";
import type { Schedule, ScheduleDayOfWeek } from "@/lib/types";

const dayLabels: Record<ScheduleDayOfWeek, string> = {
  mon: "Monday",
  tue: "Tuesday",
  wed: "Wednesday",
  thu: "Thursday",
  fri: "Friday",
  sat: "Saturday",
  sun: "Sunday",
};

function ordinal(day: number) {
  const mod10 = day % 10;
  const mod100 = day % 100;
  if (mod10 === 1 && mod100 !== 11) return `${day}st`;
  if (mod10 === 2 && mod100 !== 12) return `${day}nd`;
  if (mod10 === 3 && mod100 !== 13) return `${day}rd`;
  return `${day}th`;
}

export function formatScheduleTime(time: string) {
  const [hours, minutes] = time.split(":");
  return `${hours}:${minutes}`;
}

export function formatScheduleDetails(schedule: Schedule) {
  const at = formatScheduleTime(schedule.time);

  if (schedule.frequency === "daily") {
    return `Every day at ${at}`;
  }

  if (schedule.frequency === "weekly" && schedule.dayOfWeek) {
    return `Every ${dayLabels[schedule.dayOfWeek]} at ${at}`;
  }

  if (schedule.frequency === "monthly" && schedule.dayOfMonth) {
    return `On the ${ordinal(schedule.dayOfMonth)} of each month at ${at}`;
  }

  return at;
}

export function getScheduleById(id: string) {
  return schedules.find((schedule) => schedule.id === id);
}

export function getScheduleTestCount(scheduleId: string) {
  return testRuns.filter((test) => test.scheduleId === scheduleId).length;
}

export function getSchedulesWithUsage() {
  return schedules.map((schedule) => {
    const testCount = getScheduleTestCount(schedule.id);
    return {
      schedule,
      testCount,
      isActive: testCount > 0,
    };
  });
}

export function getScheduleLabelForTest(scheduleId: string | undefined) {
  if (!scheduleId) return undefined;
  const schedule = getScheduleById(scheduleId);
  if (!schedule) return undefined;
  return formatScheduleDetails(schedule);
}
