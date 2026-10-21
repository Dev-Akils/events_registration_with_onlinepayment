// Edit event details and ticket prices here (amounts are in the smallest currency unit: cents).
export const EVENT = {
  name: "Sample Event 2026",
  date: "Saturday, 12 December 2026",
  time: "9:00 AM – 5:00 PM",
  venue: "Singapore Expo, Hall 6",
  description: "A full-day event with talks, workshops and networking. Replace this text with the client's content.",
  schedule: [
    { time: "9:00 AM", title: "Registration & welcome" },
    { time: "10:00 AM", title: "Opening session" },
    { time: "1:00 PM", title: "Lunch & networking" },
    { time: "2:00 PM", title: "Workshops" },
    { time: "4:30 PM", title: "Closing" },
  ],
};
export const CURRENCY = "sgd";
export const TICKETS = {
  general: { label: "General", amount: 5000 },
  student: { label: "Student", amount: 2500 },
} as const;
export type TicketKey = keyof typeof TICKETS;
