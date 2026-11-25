
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  RefreshCw,
  Clock,
  AlertCircle,
} from 'lucide-react';
import api from '@/services/api';

interface CalendarEvent {
  id: number | string;
  title?: string;
  name?: string;
  description?: string;
  start?: string;
  startDate?: string;
  dueDate?: string;
  date?: string;
  eventDate?: string;
  type?: string;
  status?: string;
}

const pad = (value: number) => String(value).padStart(2, '0');

const dateKey = (date: Date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

const getEventDate = (event: CalendarEvent) =>
  event.startDate ?? event.start ?? event.eventDate ?? event.dueDate ?? event.date ?? '';

export const CalendarPage: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDate, setSelectedDate] = useState(dateKey(new Date()));
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [eventDate, setEventDate] = useState(dateKey(new Date()));
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const response = await api.get('/calendar');
      const data = response.data;
      const items = Array.isArray(data)
        ? data
        : Array.isArray(data?.content)
          ? data.content
          : Array.isArray(data?.events)
            ? data.events
            : null;

      if (!items) {
        setEvents([]);
        setError(
          'The calendar API response is not a list of events. Check your CalendarController response format.'
        );
        return;
      }

      setEvents(items);
    } catch (err: any) {
      setError(
        err?.response?.status === 403
          ? 'You do not have permission to view calendar events.'
          : err?.response?.status === 401
            ? 'Your session has expired. Please log in again.'
            : 'Could not load calendar events. Check the backend and /api/calendar endpoint.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchEvents();
  }, [fetchEvents]);

  const monthLabel = currentMonth.toLocaleDateString(undefined, {
    month: 'long',
    year: 'numeric',
  });

  const days = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstWeekday = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    return [
      ...Array.from({ length: firstWeekday }, () => null as number | null),
      ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
    ];
  }, [currentMonth]);

  const eventsForDate = (key: string) =>
    events.filter((event) => getEventDate(event).slice(0, 10) === key);

  const selectedEvents = eventsForDate(selectedDate);

  const upcomingEvents = useMemo(() => {
    const today = dateKey(new Date());
    return events
      .filter((event) => {
        const date = getEventDate(event).slice(0, 10);
        return date && date >= today;
      })
      .sort((a, b) => getEventDate(a).localeCompare(getEventDate(b)))
      .slice(0, 5);
  }, [events]);

  const changeMonth = (offset: number) => {
    setCurrentMonth((previous) =>
      new Date(previous.getFullYear(), previous.getMonth() + offset, 1)
    );
  };

  const createEvent = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormError('');

    if (!title.trim() || !eventDate) {
      setFormError('Enter an event title and date.');
      return;
    }

    setSaving(true);

    try {
      await api.post('/calendar', {
        title: title.trim(),
        description: description.trim(),
        startTime: `${eventDate}T09:00:00`,
        endTime: `${eventDate}T10:00:00`,
        type: 'MEETING',
        status: 'SCHEDULED',
      });       


      setTitle('');
      setDescription('');
      setShowForm(false);
      setSelectedDate(eventDate);
      setCurrentMonth(new Date(`${eventDate}T12:00:00`));
      await fetchEvents();
    } catch (err: any) {
      setFormError(
        err?.response?.status === 404 || err?.response?.status === 405
          ? 'Your backend does not currently support creating calendar events at POST /api/calendar.'
          : err?.response?.data?.message ||
            'Could not create the event. Check the calendar API request format.'
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 text-slate-100">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white">Calendar</h2>
          <p className="mt-1 text-sm text-slate-400">
            Schedule task deadlines, team sprints, and company milestones.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => void fetchEvents()}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-200 hover:bg-slate-800 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={() => {
              setFormError('');
              setShowForm((value) => !value);
            }}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
          >
            <Plus className="h-4 w-4" />
            Add Event
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-2 rounded-lg border border-amber-800 bg-amber-950/40 p-3 text-sm text-amber-200">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {showForm && (
        <form
          onSubmit={createEvent}
          className="space-y-4 rounded-xl border border-slate-800 bg-slate-900 p-5"
        >
          <h3 className="font-semibold text-white">Create Calendar Event</h3>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-1 text-sm text-slate-300">
              Event title
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                required
                maxLength={150}
                placeholder="e.g. Sprint planning"
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white placeholder:text-slate-500 outline-none focus:border-indigo-500"
              />
            </label>

            <label className="space-y-1 text-sm text-slate-300">
              Date
              <input
                type="date"
                value={eventDate}
                onChange={(event) => setEventDate(event.target.value)}
                required
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-indigo-500"
              />
            </label>
          </div>

          <label className="block space-y-1 text-sm text-slate-300">
            Description
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              maxLength={1000}
              rows={3}
              placeholder="Optional event details"
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white placeholder:text-slate-500 outline-none focus:border-indigo-500"
            />
          </label>

          {formError && (
            <p className="text-sm text-red-400">{formError}</p>
          )}

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Event'}
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.7fr)_minmax(280px,1fr)]">
        <section className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
          <div className="flex items-center justify-between border-b border-slate-800 p-5">
            <div className="flex items-center gap-3">
              <CalendarIcon className="h-5 w-5 text-indigo-400" />
              <h3 className="text-lg font-semibold text-white">{monthLabel}</h3>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => changeMonth(-1)}
                aria-label="Previous month"
                className="rounded-lg border border-slate-700 p-2 hover:bg-slate-800"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => {
                  const today = new Date();
                  setCurrentMonth(new Date(today.getFullYear(), today.getMonth(), 1));
                  setSelectedDate(dateKey(today));
                }}
                className="rounded-lg border border-slate-700 px-3 text-sm hover:bg-slate-800"
              >
                Today
              </button>
              <button
                onClick={() => changeMonth(1)}
                aria-label="Next month"
                className="rounded-lg border border-slate-700 p-2 hover:bg-slate-800"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 border-b border-slate-800 bg-slate-950/40">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div
                key={day}
                className="py-3 text-center text-xs font-semibold uppercase text-slate-500"
              >
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7">
            {days.map((day, index) => {
              if (day === null) {
                return (
                  <div
                    key={`blank-${index}`}
                    className="min-h-20 border-b border-r border-slate-800/70 sm:min-h-24"
                  />
                );
              }

              const key = dateKey(
                new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
              );
              const dayEvents = eventsForDate(key);
              const isSelected = selectedDate === key;
              const isToday = dateKey(new Date()) === key;

              return (
                <button
                  key={key}
                  onClick={() => setSelectedDate(key)}
                  className={`min-h-20 border-b border-r border-slate-800/70 p-2 text-left transition-colors sm:min-h-24 ${
                    isSelected
                      ? 'bg-indigo-500/15 ring-1 ring-inset ring-indigo-500'
                      : 'hover:bg-slate-800/60'
                  }`}
                >
                  <span
                    className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-sm ${
                      isToday
                        ? 'bg-indigo-600 font-semibold text-white'
                        : isSelected
                          ? 'font-semibold text-indigo-300'
                          : 'text-slate-300'
                    }`}
                  >
                    {day}
                  </span>
                  <div className="mt-1 space-y-1">
                    {dayEvents.slice(0, 2).map((item) => (
                      <div
                        key={item.id}
                        className="truncate rounded bg-indigo-500/20 px-1 py-0.5 text-[10px] text-indigo-200"
                        title={item.title ?? item.name ?? 'Event'}
                      >
                        {item.title ?? item.name ?? 'Event'}
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <p className="text-[10px] text-slate-400">
                        +{dayEvents.length - 2} more
                      </p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {loading && (
            <p className="p-4 text-center text-sm text-slate-400">
              Loading events...
            </p>
          )}
        </section>

        <aside className="space-y-6">
          <section className="rounded-xl border border-slate-800 bg-slate-900 p-5">
            <h3 className="font-semibold text-white">
              {new Date(`${selectedDate}T12:00:00`).toLocaleDateString(undefined, {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </h3>

            {selectedEvents.length === 0 ? (
              <div className="py-8 text-center">
                <CalendarIcon className="mx-auto h-8 w-8 text-slate-600" />
                <p className="mt-3 text-sm text-slate-400">
                  No events scheduled for this date.
                </p>
                <button
                  onClick={() => {
                    setEventDate(selectedDate);
                    setShowForm(true);
                  }}
                  className="mt-3 text-sm font-medium text-indigo-400 hover:text-indigo-300"
                >
                  + Add an event
                </button>
              </div>
            ) : (
              <div className="mt-4 space-y-3">
                {selectedEvents.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-lg border border-slate-800 bg-slate-950/50 p-3"
                  >
                    <p className="font-medium text-white">
                      {item.title ?? item.name ?? 'Untitled event'}
                    </p>
                    {item.description && (
                      <p className="mt-1 text-sm text-slate-400">
                        {item.description}
                      </p>
                    )}
                    <p className="mt-2 flex items-center gap-1 text-xs text-slate-500">
                      <Clock className="h-3 w-3" />
                      {getEventDate(item).slice(0, 10)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="rounded-xl border border-slate-800 bg-slate-900 p-5">
            <h3 className="font-semibold text-white">Upcoming Events</h3>
            {upcomingEvents.length === 0 ? (
              <p className="py-5 text-sm text-slate-400">
                No upcoming events found.
              </p>
            ) : (
              <div className="mt-4 space-y-3">
                {upcomingEvents.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      const date = getEventDate(item).slice(0, 10);
                      if (date) {
                        setSelectedDate(date);
                        setCurrentMonth(new Date(`${date}T12:00:00`));
                      }
                    }}
                    className="w-full rounded-lg border border-slate-800 p-3 text-left hover:bg-slate-800/60"
                  >
                    <p className="font-medium text-slate-200">
                      {item.title ?? item.name ?? 'Untitled event'}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      {getEventDate(item).slice(0, 10)}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </section>
        </aside>
      </div>
    </div>
  );
};

export default CalendarPage;
