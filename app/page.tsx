import Link from "next/link";
import { Anton, Archivo, Caveat, Playfair_Display } from "next/font/google";
import { TICKETS, CURRENCY } from "@/lib/config";

/* ---------- fonts (loaded right here, no layout/tailwind changes needed) ---------- */
const display = Anton({ weight: "400", subsets: ["latin"], variable: "--font-display" });
const body = Archivo({ subsets: ["latin"], variable: "--font-body" });
const hand = Caveat({ subsets: ["latin"], variable: "--font-hand" });
const serif = Playfair_Display({ weight: ["900"], subsets: ["latin"], variable: "--font-serif" });
const D = "font-[family-name:var(--font-display)]";
const H = "font-[family-name:var(--font-hand)]";
const S = "font-[family-name:var(--font-serif)]";

/* ---------- EDIT YOUR CONTENT HERE ---------- */
const EVENT = {
  titleLines: ["SAMPLE", "EVENT", "2026"],
  heroImage: "", // e.g. "/hero.png" (file inside /public). Leave "" for none.
  date: "December 12, 2026",
  time: "9:00 AM – 5:00 PM",
  venue: "Singapore Expo, Hall 6",
  hosts: "Your Host Team",
  seats: 180,
  email: "hello@example.com",
  instagram: "https://instagram.com/",
  quote: "Come for the talks. Stay for the people.",
  quoteSource: "The Daily Planet",
  quoteNote: "Verified: very biased attendee",
  highlightsTitle: "How your day’s gonna look like",
  highlights: [
    { title: "Meet the crowd", text: "Hundreds of people, one room. Say hi, swap stories and find your people.", image: "" },
    { title: "Talks that hit", text: "Short, honest sessions from speakers who have actually done the thing.", image: "" },
    { title: "Hands-on workshops", text: "Roll up your sleeves, build something and take it home.", image: "" },
    { title: "Chill & recharge", text: "Good food, good music, zero pressure. Take a breather between sessions.", image: "" },
  ],
  schedule: [
    { time: "9:00 AM", title: "Registration & welcome" },
    { time: "10:00 AM", title: "Opening session" },
    { time: "1:00 PM", title: "Lunch & networking" },
    { time: "2:00 PM", title: "Workshops" },
    { time: "4:30 PM", title: "Closing" },
  ],
};

/* ---------- small helpers (all inside this one file) ---------- */
const NOISE = `url("data:image/svg+xml;utf8,${encodeURIComponent(
  "<svg xmlns='http://www.w3.org/2000/svg' width='500' height='500'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.012 0.022' numOctaves='4' seed='7'/><feColorMatrix type='matrix' values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 1.8 -0.6'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>"
)}")`;

function Crumple() {
  return <div aria-hidden className="pointer-events-none absolute inset-0 opacity-90 mix-blend-soft-light" style={{ backgroundImage: NOISE, backgroundSize: "500px 500px" }} />;
}

function rnd(n: number, seed: number) {
  const x = Math.sin(n * 127.1 + seed * 311.7) * 43758.5453;
  return x - Math.floor(x);
}
// Ripped-paper edge: first child of a `relative` section, coloured with a text-* class.
function Torn({ className, seed = 1 }: { className: string; seed?: number }) {
  const W = 1200, Hh = 40;
  let d = `M0 ${Hh} L0 ${10 + rnd(0, seed) * 16}`;
  for (let x = 10, i = 1; x <= W; x += 10, i++) d += ` L${x} ${6 + rnd(i, seed) * 22}`;
  d += ` L${W} ${Hh} Z`;
  return (
    <svg viewBox={`0 0 ${W} ${Hh}`} preserveAspectRatio="none" aria-hidden fill="currentColor"
         className={`pointer-events-none absolute inset-x-0 bottom-full z-10 block h-5 w-full md:h-9 ${className}`}>
      <path d={d} />
    </svg>
  );
}

const ArrowDR = ({ className }: { className: string }) => (
  <svg viewBox="0 0 48 48" className={className} fill="currentColor" aria-hidden><path d="M6 12 12 6l20 20V14h10v28H14V32h12z" /></svg>
);
const IconInstagram = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
    <rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
  </svg>
);
const IconMail = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
    <rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" />
  </svg>
);
const IconHeart = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
    <path d="M12 21s-7-4.5-9.5-9C1 8.5 3 5 6.5 5c2 0 3.5 1 5.5 3 2-2 3.5-3 5.5-3C21 5 23 8.5 21.5 12 19 16.5 12 21 12 21z" />
  </svg>
);
const Seat = () => (
  <svg viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor" aria-hidden>
    <rect x="6" y="3" width="12" height="11" rx="2" /><rect x="3" y="11" width="18" height="7" rx="2" /><rect x="7" y="18" width="2" height="3" /><rect x="15" y="18" width="2" height="3" />
  </svg>
);

const SECTION_BG = [
  { bg: "bg-[#e0141c]", torn: "text-[#e0141c]", crumple: true },
  { bg: "bg-gradient-to-b from-[#8a8780] to-[#2a2927]", torn: "text-[#8a8780]", crumple: false },
  { bg: "bg-[#0b0b0b]", torn: "text-[#0b0b0b]", crumple: false },
  { bg: "bg-[#7a0509]", torn: "text-[#7a0509]", crumple: true },
];

/* ---------- PAGE ---------- */
export default function Home() {
  const marquee = [`Venue: ${EVENT.venue}`, EVENT.date, `Hosted by ${EVENT.hosts}`, `${EVENT.seats} seats only`];
  const row = (
    <div className="flex shrink-0 items-center gap-8 pr-8">
      {marquee.map((t, i) => (
        <span key={i} className="flex items-center gap-8 whitespace-nowrap">
          <span className={`${D} text-xl uppercase tracking-wide md:text-2xl`}>{t}</span>
          <span className="text-2xl text-[#e0141c]">✱</span>
        </span>
      ))}
    </div>
  );

  return (
    <main className={`${display.variable} ${body.variable} ${hand.variable} ${serif.variable} overflow-x-clip bg-[#0b0b0b] font-[family-name:var(--font-body)] text-white`}>
      <style>{`@keyframes zine-marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}.zine-marquee{animation:zine-marquee 28s linear infinite}`}</style>

      {/* Social rail */}
      <nav className="fixed right-3 top-4 z-50 flex flex-col gap-3">
        {[
          { href: EVENT.instagram, label: "Instagram", icon: <IconInstagram /> },
          { href: `mailto:${EVENT.email}`, label: "Email", icon: <IconMail /> },
          { href: "/register", label: "Register", icon: <IconHeart /> },
        ].map((b) => (
          <a key={b.label} href={b.href} aria-label={b.label}
             className="grid h-9 w-9 place-items-center rounded-full bg-[#e0141c] text-white shadow-lg transition hover:scale-110">
            {b.icon}
          </a>
        ))}
      </nav>

      {/* HERO */}
      <section className="relative flex min-h-screen flex-col justify-end overflow-hidden bg-gradient-to-b from-[#e3151c] via-[#b30f14] to-[#3d0205] px-6 pb-16 pt-24">
        <Crumple />
        {EVENT.heroImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={EVENT.heroImage} alt="" className="pointer-events-none absolute inset-x-0 top-1/4 mx-auto w-3/4 max-w-xl object-contain" />
        )}
        <h1 className="relative">
          {EVENT.titleLines.map((l) => (
            <span key={l} className={`${D} block text-[27vw] uppercase leading-[0.82] tracking-tight text-white/25 sm:text-[19vw] lg:text-[14rem]`}>{l}</span>
          ))}
        </h1>
        <Link href="/register"
          className={`${D} absolute right-6 top-28 grid h-28 w-28 -rotate-[8deg] place-items-center rounded-full bg-white text-center text-xl uppercase leading-tight text-[#e0141c] shadow-xl transition hover:rotate-0 md:h-36 md:w-36 md:text-2xl`}>
          Get your<br />ticket
        </Link>
      </section>

      {/* TICKER */}
      <div className="relative">
        <Torn className="text-[#ecebe8]" seed={2} />
        <div className="overflow-hidden bg-[#ecebe8] py-4 text-[#0b0b0b]">
          <div className="zine-marquee flex w-max">{row}{row}</div>
        </div>
      </div>

      {/* QUOTE */}
      <section className="relative bg-[#ecebe8] px-6 pb-20 pt-16 text-[#0b0b0b]">
        <div className="mx-auto max-w-3xl">
          <blockquote className={`${S} text-5xl leading-[1.05] md:text-7xl`}>“{EVENT.quote}”</blockquote>
          <div className="mt-8 h-[3px] w-full bg-[#e0141c]" />
          <p className={`${D} mt-6 text-2xl uppercase line-through decoration-[#e0141c] decoration-4`}>{EVENT.quoteSource}</p>
          <p className={`${H} mt-1 -rotate-2 text-4xl text-[#e0141c]`}>{EVENT.quoteNote}</p>
        </div>
      </section>

      {/* HIGHLIGHTS INTRO */}
      <section className="relative bg-[#e0141c] px-6 pb-12 pt-20">
        <Torn className="text-[#e0141c]" seed={3} />
        <Crumple />
        <h2 className={`${D} relative mx-auto max-w-3xl text-5xl uppercase leading-[0.95] text-white/90 md:text-7xl`}>{EVENT.highlightsTitle}</h2>
      </section>

      {EVENT.highlights.map((h, i) => {
        const s = SECTION_BG[i % SECTION_BG.length];
        return (
          <section key={h.title} className={`relative min-h-[70vh] px-6 py-20 ${s.bg}`}>
            <Torn className={s.torn} seed={10 + i} />
            {s.crumple && <Crumple />}
            <div className="relative mx-auto max-w-3xl">
              <ArrowDR className={`h-12 w-12 ${i % 2 ? "text-[#e0141c]" : "text-white"}`} />
              <h3 className={`${D} mt-3 text-4xl uppercase md:text-6xl`}>{h.title}</h3>
              <p className="mt-3 max-w-md text-lg font-semibold leading-snug md:text-xl">{h.text}</p>
              {h.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={h.image} alt="" className="mt-10 w-full max-w-xl object-contain" />
              ) : (
                <p className={`${D} mt-8 select-none text-[10rem] leading-none md:text-[14rem]`}
                   style={{ WebkitTextStroke: "2px rgba(255,255,255,0.35)", color: "transparent" }}>0{i + 1}</p>
              )}
            </div>
          </section>
        );
      })}

      {/* THE BORING DETAILS */}
      <section id="details" className="relative bg-gradient-to-b from-[#26231f] to-black px-6 pb-24 pt-24">
        <Torn className="text-[#26231f]" seed={30} />
        <Crumple />
        <div className="relative mx-auto max-w-3xl">
          <h2 className={`${D} text-5xl uppercase leading-[0.95] text-white/80 md:text-7xl`}>The Boring<br />Details</h2>

          <div className="mt-16 space-y-8">
            <div>
              <p className={`${D} text-2xl uppercase text-[#e0141c]`}>{EVENT.date} · {EVENT.time}</p>
              <p className="mt-1 text-lg font-semibold">{EVENT.venue}</p>
            </div>
            <div>
              <p className="font-semibold">Hosted by</p>
              <p className={`${D} text-xl uppercase text-[#e0141c]`}>{EVENT.hosts}</p>
              <p className="mt-3 flex items-center gap-1 text-[#e0141c]">
                <Seat /><Seat /><Seat />
                <span className={`${D} ml-2 text-xl uppercase text-white`}>{EVENT.seats} Seats</span>
              </p>
            </div>

            <ul className="max-w-md divide-y divide-white/15 border-y border-dashed border-white/30">
              {EVENT.schedule.map((s) => (
                <li key={s.time} className="flex gap-6 py-3">
                  <span className={`${D} w-24 shrink-0 uppercase text-[#e0141c]`}>{s.time}</span>
                  <span>{s.title}</span>
                </li>
              ))}
            </ul>

            <div>
              <p className={`${D} text-xl uppercase text-[#e0141c]`}>Contact us</p>
              <a href={`mailto:${EVENT.email}`} className="font-semibold text-[#19c6e6] underline-offset-4 hover:underline">{EVENT.email}</a>
            </div>
          </div>

          <h3 className={`${D} mt-20 text-4xl uppercase text-white/80`}>Tickets</h3>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {Object.values(TICKETS).map((t) => (
              <Link key={t.label} href="/register"
                className="group -rotate-1 border-2 border-dashed border-white/40 bg-white/5 p-6 transition hover:rotate-0 hover:border-[#e0141c] hover:bg-[#e0141c]/20">
                <p className={`${D} text-xl uppercase text-[#e0141c]`}>{t.label}</p>
                <p className={`${D} mt-1 text-5xl`}>{CURRENCY.toUpperCase()} {(t.amount / 100).toFixed(2)}</p>
                <p className="mt-3 text-sm font-semibold uppercase tracking-wider text-white/70 group-hover:text-white">Register →</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
