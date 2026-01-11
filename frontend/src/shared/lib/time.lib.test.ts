import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { formatRelativeTime, formatDate } from "./time.lib";

describe("formatRelativeTime", () => {
  const FIXED_NOW = new Date("2026-01-11T12:00:00.000Z");

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(FIXED_NOW);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("minutes range (0-59 minutes)", () => {
    it("returns 'just now' for less than 1 minute", () => {
      const date = new Date("2026-01-11T11:59:30.000Z");
      expect(formatRelativeTime(date)).toBe("just now");
    });

    it("returns '1 minute ago' for exactly 1 minute", () => {
      const date = new Date("2026-01-11T11:59:00.000Z");
      expect(formatRelativeTime(date)).toBe("1 minute ago");
    });

    it("returns 'X minutes ago' for multiple minutes", () => {
      const date = new Date("2026-01-11T11:15:00.000Z");
      expect(formatRelativeTime(date)).toBe("45 minutes ago");
    });

    it("returns '59 minutes ago' at the edge of hours", () => {
      const date = new Date("2026-01-11T11:01:00.000Z");
      expect(formatRelativeTime(date)).toBe("59 minutes ago");
    });
  });

  describe("hours range (1-23 hours)", () => {
    it("returns '1 hour ago' for exactly 1 hour", () => {
      const date = new Date("2026-01-11T11:00:00.000Z");
      expect(formatRelativeTime(date)).toBe("1 hour ago");
    });

    it("returns 'X hours ago' for multiple hours", () => {
      const date = new Date("2026-01-11T02:00:00.000Z");
      expect(formatRelativeTime(date)).toBe("10 hours ago");
    });

    it("returns '23 hours ago' at the edge of days", () => {
      const date = new Date("2026-01-10T13:00:00.000Z");
      expect(formatRelativeTime(date)).toBe("23 hours ago");
    });
  });

  describe("days range (1-29 days)", () => {
    it("returns '1 day ago' for exactly 1 day", () => {
      const date = new Date("2026-01-10T12:00:00.000Z");
      expect(formatRelativeTime(date)).toBe("1 day ago");
    });

    it("returns 'X days ago' for multiple days", () => {
      const date = new Date("2026-01-01T12:00:00.000Z");
      expect(formatRelativeTime(date)).toBe("10 days ago");
    });

    it("returns '29 days ago' at the edge of months", () => {
      const date = new Date("2025-12-13T12:00:00.000Z");
      expect(formatRelativeTime(date)).toBe("29 days ago");
    });
  });

  describe("months range (1-11 months)", () => {
    it("returns '1 month ago' for approximately 1 month", () => {
      const date = new Date("2025-12-11T12:00:00.000Z");
      expect(formatRelativeTime(date)).toBe("1 month ago");
    });

    it("returns 'X months ago' for multiple months", () => {
      const date = new Date("2025-06-11T12:00:00.000Z");
      expect(formatRelativeTime(date)).toBe("7 months ago");
    });
  });

  describe("years range (1+ years)", () => {
    it("returns '1 year ago' for approximately 1 year", () => {
      const date = new Date("2025-01-11T12:00:00.000Z");
      expect(formatRelativeTime(date)).toBe("1 year ago");
    });

    it("returns 'X years ago' for multiple years", () => {
      const date = new Date("2016-01-11T12:00:00.000Z");
      expect(formatRelativeTime(date)).toBe("10 years ago");
    });
  });

  describe("with string date input", () => {
    it("parses ISO string correctly", () => {
      const dateString = "2026-01-11T11:15:00.000Z";
      expect(formatRelativeTime(dateString)).toBe("45 minutes ago");
    });
  });

  describe("with 'until' option", () => {
    it("calculates difference between two dates", () => {
      const from = new Date("2026-01-01T12:00:00.000Z");
      const until = new Date("2026-01-11T12:00:00.000Z");
      expect(formatRelativeTime(from, { until })).toBe("10 days ago");
    });

    it("accepts string for 'until' option", () => {
      const from = "2026-01-01T12:00:00.000Z";
      const until = "2026-01-11T12:00:00.000Z";
      expect(formatRelativeTime(from, { until })).toBe("10 days ago");
    });
  });

  describe("edge cases", () => {
    it("returns 'in the future' for future dates", () => {
      const futureDate = new Date("2026-01-12T12:00:00.000Z");
      expect(formatRelativeTime(futureDate)).toBe("in the future");
    });

    it("handles exact same time", () => {
      expect(formatRelativeTime(FIXED_NOW)).toBe("just now");
    });
  });
});

describe("formatDate", () => {
  const testDate = new Date("2026-01-04T02:54:05.929Z");

  it("formats as DD/MM/YYYY by default", () => {
    expect(formatDate(testDate)).toBe("04/01/2026");
  });

  it("formats as DD/MM/YYYY explicitly", () => {
    expect(formatDate(testDate, "DD/MM/YYYY")).toBe("04/01/2026");
  });

  it("formats as MM/DD/YYYY", () => {
    expect(formatDate(testDate, "MM/DD/YYYY")).toBe("01/04/2026");
  });

  it("formats as YYYY/MM/DD", () => {
    expect(formatDate(testDate, "YYYY/MM/DD")).toBe("2026/01/04");
  });

  it("accepts string date input", () => {
    const dateString = "2026-01-04T02:54:05.929Z";
    expect(formatDate(dateString, "DD/MM/YYYY")).toBe("04/01/2026");
  });

  it("pads single digit days and months", () => {
    const date = new Date("2026-01-04T12:00:00.000Z");
    expect(formatDate(date, "DD/MM/YYYY")).toBe("04/01/2026");
  });
});
