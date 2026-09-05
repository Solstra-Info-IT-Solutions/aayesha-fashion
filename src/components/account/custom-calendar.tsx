"use client";

import {
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import {
  useMemo,
  useState,
} from "react";

type CustomCalendarProps = {
  value: string;
  onChange: (value: string) => void;
  onClose?: () => void;
  minDate?: string;
  maxDate?: string;
};

type CalendarDay = {
  date: Date;
  currentMonth: boolean;
};

function parseDateValue(
  value: string,
): Date | null {
  if (!value) {
    return null;
  }

  const date = new Date(
    `${value}T00:00:00`,
  );

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
}

function formatDateValue(
  date: Date,
): string {
  return `${date.getFullYear()}-${String(
    date.getMonth() + 1,
  ).padStart(2, "0")}-${String(
    date.getDate(),
  ).padStart(2, "0")}`;
}

function formatDisplayDate(
  value: string,
): string {
  const date = parseDateValue(value);

  if (!date) {
    return "";
  }

  return new Intl.DateTimeFormat(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    },
  ).format(date);
}

function isSameDay(
  first: Date | null,
  second: Date,
) {
  if (!first) {
    return false;
  }

  return (
    first.getFullYear() ===
      second.getFullYear() &&
    first.getMonth() ===
      second.getMonth() &&
    first.getDate() ===
      second.getDate()
  );
}

function isDateBefore(
  date: Date,
  boundary: Date | null,
) {
  if (!boundary) {
    return false;
  }

  const normalizedDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  );

  const normalizedBoundary =
    new Date(
      boundary.getFullYear(),
      boundary.getMonth(),
      boundary.getDate(),
    );

  return normalizedDate < normalizedBoundary;
}

function isDateAfter(
  date: Date,
  boundary: Date | null,
) {
  if (!boundary) {
    return false;
  }

  const normalizedDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  );

  const normalizedBoundary =
    new Date(
      boundary.getFullYear(),
      boundary.getMonth(),
      boundary.getDate(),
    );

  return normalizedDate > normalizedBoundary;
}

export function CustomCalendar({
  value,
  onChange,
  onClose,
  minDate,
  maxDate,
}: CustomCalendarProps) {
  const selectedDate =
    parseDateValue(value);

  const minDateObject =
    parseDateValue(
      minDate ?? "",
    );

  const maxDateObject =
    parseDateValue(
      maxDate ?? "",
    );

  const [visibleMonth, setVisibleMonth] =
    useState<Date>(() => {
      return (
        selectedDate ??
        maxDateObject ??
        new Date()
      );
    });

  const calendarDays = useMemo<
    CalendarDay[]
  >(() => {
    const year =
      visibleMonth.getFullYear();

    const month =
      visibleMonth.getMonth();

    const firstDayOfMonth =
      new Date(
        year,
        month,
        1,
      ).getDay();

    const daysInMonth =
      new Date(
        year,
        month + 1,
        0,
      ).getDate();

    const daysInPreviousMonth =
      new Date(
        year,
        month,
        0,
      ).getDate();

    const days: CalendarDay[] = [];

    for (
      let index =
        firstDayOfMonth - 1;
      index >= 0;
      index--
    ) {
      days.push({
        date: new Date(
          year,
          month - 1,
          daysInPreviousMonth -
            index,
        ),
        currentMonth: false,
      });
    }

    for (
      let day = 1;
      day <= daysInMonth;
      day++
    ) {
      days.push({
        date: new Date(
          year,
          month,
          day,
        ),
        currentMonth: true,
      });
    }

    let nextMonthDay = 1;

    while (days.length < 42) {
      days.push({
        date: new Date(
          year,
          month + 1,
          nextMonthDay++,
        ),
        currentMonth: false,
      });
    }

    return days;
  }, [visibleMonth]);

  const monthLabel =
    new Intl.DateTimeFormat(
      "en-IN",
      {
        month: "long",
        year: "numeric",
      },
    ).format(visibleMonth);

  const today = new Date();

  const todayValue =
    formatDateValue(today);

  const canGoPrevious =
    minDateObject
      ? new Date(
          visibleMonth.getFullYear(),
          visibleMonth.getMonth(),
          1,
        ) >
        new Date(
          minDateObject.getFullYear(),
          minDateObject.getMonth(),
          1,
        )
      : true;

  const canGoNext =
    maxDateObject
      ? new Date(
          visibleMonth.getFullYear(),
          visibleMonth.getMonth(),
          1,
        ) <
        new Date(
          maxDateObject.getFullYear(),
          maxDateObject.getMonth(),
          1,
        )
      : true;

  const goPreviousMonth = () => {
    if (!canGoPrevious) {
      return;
    }

    setVisibleMonth(
      (current) =>
        new Date(
          current.getFullYear(),
          current.getMonth() - 1,
          1,
        ),
    );
  };

  const goNextMonth = () => {
    if (!canGoNext) {
      return;
    }

    setVisibleMonth(
      (current) =>
        new Date(
          current.getFullYear(),
          current.getMonth() + 1,
          1,
        ),
    );
  };

  const selectDate = (
    date: Date,
  ) => {
    if (
      isDateBefore(
        date,
        minDateObject,
      ) ||
      isDateAfter(
        date,
        maxDateObject,
      )
    ) {
      return;
    }

    onChange(
      formatDateValue(date),
    );

    onClose?.();
  };

  const goToToday = () => {
    if (
      isDateBefore(
        today,
        minDateObject,
      ) ||
      isDateAfter(
        today,
        maxDateObject,
      )
    ) {
      return;
    }

    onChange(todayValue);

    setVisibleMonth(
      new Date(
        today.getFullYear(),
        today.getMonth(),
        1,
      ),
    );

    onClose?.();
  };

  const clearDate = () => {
    onChange("");
  };

  return (
    <div className="w-full overflow-hidden border border-[var(--color-border)] bg-white shadow-[0_20px_55px_rgba(23,23,23,0.12)] sm:w-[348px]">
      {/* =====================================================
          CALENDAR HEADER
      ====================================================== */}

      <div className="border-b border-[var(--color-border)] bg-[var(--color-ivory)] px-4 py-4">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={goPreviousMonth}
            disabled={!canGoPrevious}
            aria-label="Previous month"
            className="grid h-9 w-9 place-items-center border border-transparent text-[var(--color-secondary)] transition hover:border-[var(--color-border)] hover:bg-white hover:text-[var(--color-ink)] disabled:cursor-not-allowed disabled:opacity-25"
          >
            <ChevronLeft
              size={16}
              strokeWidth={1.8}
            />
          </button>

          <div className="text-center">
            <p className="font-display text-[23px] leading-tight text-[var(--color-ink)]">
              {monthLabel}
            </p>

            <p className="mt-1 text-[9px] font-medium uppercase tracking-[0.16em] text-[var(--color-muted)]">
              Select date
            </p>
          </div>

          <button
            type="button"
            onClick={goNextMonth}
            disabled={!canGoNext}
            aria-label="Next month"
            className="grid h-9 w-9 place-items-center border border-transparent text-[var(--color-secondary)] transition hover:border-[var(--color-border)] hover:bg-white hover:text-[var(--color-ink)] disabled:cursor-not-allowed disabled:opacity-25"
          >
            <ChevronRight
              size={16}
              strokeWidth={1.8}
            />
          </button>
        </div>

        {/* Selected date */}

        <div className="mt-4 flex items-center justify-between border-t border-[var(--color-border)] pt-3">
          <div className="flex items-center gap-2">
            <CalendarDays
              size={14}
              strokeWidth={1.7}
              className="text-[var(--color-rose-dark)]"
            />

            <span className="text-xs text-[var(--color-secondary)]">
              {value
                ? formatDisplayDate(
                    value,
                  )
                : "No date selected"}
            </span>
          </div>

          {value && (
            <button
              type="button"
              onClick={clearDate}
              className="grid h-7 w-7 place-items-center text-[var(--color-muted)] transition hover:bg-white hover:text-[var(--color-ink)]"
              aria-label="Clear date"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* =====================================================
          WEEK DAYS
      ====================================================== */}

      <div className="px-4 pt-4">
        <div className="grid grid-cols-7">
          {[
            "S",
            "M",
            "T",
            "W",
            "T",
            "F",
            "S",
          ].map(
            (
              day,
              index,
            ) => (
              <div
                key={`${day}-${index}`}
                className="py-2 text-center text-[9px] font-semibold uppercase tracking-[0.08em] text-[var(--color-muted)]"
              >
                {day}
              </div>
            ),
          )}
        </div>
      </div>

      {/* =====================================================
          DAYS
      ====================================================== */}

      <div className="px-4 pb-3">
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map(
            ({
              date,
              currentMonth,
            }) => {
              const dateValue =
                formatDateValue(date);

              const selected =
                isSameDay(
                  selectedDate,
                  date,
                );

              const outsideRange =
                isDateBefore(
                  date,
                  minDateObject,
                ) ||
                isDateAfter(
                  date,
                  maxDateObject,
                );

              const todayDate =
                dateValue ===
                todayValue;

              return (
                <button
                  key={dateValue}
                  type="button"
                  disabled={outsideRange}
                  onClick={() => {
                    selectDate(date);
                  }}
                  className={`relative grid h-10 place-items-center text-xs transition ${
                    selected
                      ? "bg-[var(--color-ink)] font-semibold text-white"
                      : outsideRange
                        ? "cursor-not-allowed text-[var(--color-muted)]/25"
                        : currentMonth
                          ? "text-[var(--color-ink)] hover:bg-[var(--color-rose-light)]"
                          : "text-[var(--color-muted)]/40 hover:bg-[var(--color-ivory)]"
                  }`}
                >
                  {date.getDate()}

                  {selected && (
                    <Check
                      size={9}
                      strokeWidth={2.3}
                      className="absolute bottom-1"
                    />
                  )}

                  {todayDate &&
                    !selected &&
                    !outsideRange && (
                      <span className="absolute bottom-1 h-1 w-1 rounded-full bg-[var(--color-rose-dark)]" />
                    )}
                </button>
              );
            },
          )}
        </div>
      </div>

      {/* =====================================================
          FOOTER
      ====================================================== */}

      <div className="flex items-center justify-between border-t border-[var(--color-border)] bg-[var(--color-ivory)] px-4 py-3">
        <button
          type="button"
          onClick={clearDate}
          className="text-[10px] font-medium uppercase tracking-[0.12em] text-[var(--color-secondary)] transition hover:text-[var(--color-ink)]"
        >
          Clear
        </button>

        <button
          type="button"
          onClick={goToToday}
          disabled={
            isDateBefore(
              today,
              minDateObject,
            ) ||
            isDateAfter(
              today,
              maxDateObject,
            )
          }
          className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--color-rose-dark)] transition hover:text-[var(--color-ink)] disabled:cursor-not-allowed disabled:opacity-30"
        >
          Today
        </button>
      </div>
    </div>
  );
}