type DateInput = Date | string;

type DateFormat = "DD/MM/YYYY" | "MM/DD/YYYY" | "YYYY/MM/DD";

interface FormatRelativeTimeOptions {
  /**
   * End date to calculate the difference. Defaults to current date/time.
   */
  until?: DateInput;
  /**
   * Format for absolute date display.
   * @default "DD/MM/YYYY"
   */
  format?: DateFormat;
}

interface TimeThreshold {
  maxMinutes: number;
  divisor: number;
  unit: string;
  pluralUnit: string;
}

const MINUTES_PER_HOUR = 60;
const MINUTES_PER_DAY = 60 * 24;
const MINUTES_PER_MONTH = 60 * 24 * 30;
const MINUTES_PER_YEAR = 60 * 24 * 365;

const TIME_THRESHOLDS: TimeThreshold[] = [
  {
    maxMinutes: MINUTES_PER_HOUR,
    divisor: 1,
    unit: "minute",
    pluralUnit: "minutes",
  },
  {
    maxMinutes: MINUTES_PER_DAY,
    divisor: MINUTES_PER_HOUR,
    unit: "hour",
    pluralUnit: "hours",
  },
  {
    maxMinutes: MINUTES_PER_MONTH,
    divisor: MINUTES_PER_DAY,
    unit: "day",
    pluralUnit: "days",
  },
  {
    maxMinutes: MINUTES_PER_YEAR,
    divisor: MINUTES_PER_MONTH,
    unit: "month",
    pluralUnit: "months",
  },
  {
    maxMinutes: Infinity,
    divisor: MINUTES_PER_YEAR,
    unit: "year",
    pluralUnit: "years",
  },
];

function parseDate(date: DateInput): Date {
  if (date instanceof Date) {
    return date;
  }
  return new Date(date);
}

function getMinutesDifference(from: Date, until: Date): number {
  const diffMs = until.getTime() - from.getTime();
  return Math.floor(diffMs / (1000 * 60));
}

function formatUnit(value: number, unit: string, pluralUnit: string): string {
  const unitLabel = value === 1 ? unit : pluralUnit;
  return `${value} ${unitLabel} ago`;
}

function calculateRelativeTime(totalMinutes: number): string {
  if (totalMinutes < 1) {
    return "just now";
  }

  for (const threshold of TIME_THRESHOLDS) {
    if (totalMinutes < threshold.maxMinutes) {
      const value = Math.floor(totalMinutes / threshold.divisor);
      return formatUnit(value, threshold.unit, threshold.pluralUnit);
    }
  }

  const years = Math.floor(totalMinutes / MINUTES_PER_YEAR);
  return formatUnit(years, "year", "years");
}

/**
 * Formats a date as relative time (e.g., "45 minutes ago", "2 hours ago").
 *
 * Time ranges:
 * - 0-59 minutes: displays in minutes
 * - 1-23 hours: displays in hours
 * - 1-29 days: displays in days
 * - 1-11 months: displays in months
 * - 1+ years: displays in years
 *
 * @param from - The starting date (e.g., video publication date)
 * @param options - Optional configuration
 * @returns Formatted relative time string
 */
export function formatRelativeTime(
  from: DateInput,
  options: FormatRelativeTimeOptions = {}
): string {
  const { until = new Date() } = options;

  const fromDate = parseDate(from);
  const untilDate = parseDate(until);

  const totalMinutes = getMinutesDifference(fromDate, untilDate);

  if (totalMinutes < 0) {
    return "in the future";
  }

  return calculateRelativeTime(totalMinutes);
}

/**
 * Formats a date according to the specified format.
 *
 * @param date - The date to format
 * @param format - The desired format (DD/MM/YYYY, MM/DD/YYYY, or YYYY/MM/DD)
 * @returns Formatted date string
 */
export function formatDate(
  date: DateInput,
  format: DateFormat = "DD/MM/YYYY"
): string {
  const parsedDate = parseDate(date);

  const day = String(parsedDate.getDate()).padStart(2, "0");
  const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
  const year = String(parsedDate.getFullYear());

  const formatters: Record<DateFormat, string> = {
    "DD/MM/YYYY": `${day}/${month}/${year}`,
    "MM/DD/YYYY": `${month}/${day}/${year}`,
    "YYYY/MM/DD": `${year}/${month}/${day}`,
  };

  return formatters[format];
}
