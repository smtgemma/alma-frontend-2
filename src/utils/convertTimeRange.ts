/* eslint-disable prefer-const */
interface AbbreviatedDaySchedule {
  enabled: boolean;
  startTime: string;
  endTime: string;
}

interface AbbreviatedSchedule {
  [dayAbbr: string]: AbbreviatedDaySchedule;
}

interface TimeSlot {
  startTime: string;
  endTime: string;
}

interface AvailableDay {
  dayOfWeek: string;
  isAvailable: boolean;
  timeSlots: TimeSlot[];
}

interface AvailableSchedule {
  available: AvailableDay[];
}

type ConversionDirection = "toAvailable" | "toAbbreviated";

/**
 * Converts between different schedule formats
 * @param options Configuration options
 * @param options.data Input data to convert
 * @param options.direction 'toAvailable' or 'toAbbreviated'
 * @returns Converted data
 */
export function convertScheduleFormat({
  data,
  direction,
}: {
  data: AbbreviatedSchedule | AvailableSchedule;
  direction: ConversionDirection;
}): AvailableSchedule | AbbreviatedSchedule {
  // Helper functions
  const formatTime = (time24: string, to12Hour = true): string => {
    if (!time24) return time24;

    if (to12Hour) {
      const [hours, minutes] = time24.split(":");
      const hourNum = parseInt(hours, 10);
      const period = hourNum >= 12 ? "PM" : "AM";
      const hour12 = hourNum % 12 || 12;
      return `${hour12}:${minutes} ${period}`;
    } else {
      // Convert 12-hour AM/PM back to 24-hour
      const [time, period] = time24.split(" ");
      let [hours, minutes] = time.split(":");
      let hourNum = parseInt(hours, 10);

      if (period === "PM" && hourNum !== 12) {
        hourNum += 12;
      } else if (period === "AM" && hourNum === 12) {
        hourNum = 0;
      }

      return `${hourNum.toString().padStart(2, "0")}:${minutes}`;
    }
  };

  const dayMap: Record<string, string> = {
    SUN: "Sunday",
    MON: "Monday",
    TUE: "Tuesday",
    WED: "Wednesday",
    THU: "Thursday",
    FRI: "Friday",
    SAT: "Saturday",
  };

  const reverseDayMap: Record<string, string> = Object.fromEntries(
    Object.entries(dayMap).map(([abbr, full]) => [full, abbr])
  );

  // Conversion logic
  if (direction === "toAvailable") {
    const inputData = data as AbbreviatedSchedule;
    const availableDays = Object.entries(inputData)
      .filter(([key]) => key !== "__proto__")
      .map(([dayAbbr, dayData]) => ({
        dayAbbr,
        ...dayData,
      }));

    const result: AvailableSchedule = {
      available: availableDays
        .filter((day) => day.enabled)
        .map((day) => ({
          dayOfWeek: dayMap[day.dayAbbr] || day.dayAbbr,
          isAvailable: day.enabled,
          timeSlots: [
            {
              startTime: formatTime(day.startTime),
              endTime: formatTime(day.endTime),
            },
          ],
        })),
    };
    return result;
  } else if (direction === "toAbbreviated") {
    const inputData = data as AvailableSchedule;
    const abbreviated: AbbreviatedSchedule = {};

    inputData.available.forEach((day) => {
      const dayAbbr =
        reverseDayMap[day.dayOfWeek] || day.dayOfWeek.slice(0, 3).toUpperCase();
      const timeSlot = day.timeSlots[0]; // Taking first time slot

      abbreviated[dayAbbr] = {
        enabled: day.isAvailable,
        startTime: formatTime(timeSlot.startTime, false),
        endTime: formatTime(timeSlot.endTime, false),
      };
    });

    // Ensure all days are present
    Object.keys(dayMap).forEach((abbr) => {
      if (!abbreviated[abbr]) {
        abbreviated[abbr] = {
          enabled: false,
          startTime: "00:00",
          endTime: "00:00",
        };
      }
    });

    return abbreviated;
  }

  throw new Error(
    'Invalid direction specified. Use "toAvailable" or "toAbbreviated"'
  );
}
