const envelope = document.getElementById("envelope");
const site = document.getElementById("site");
const hearts = document.getElementById("hearts");
const countdownEl = document.getElementById("countdown");
const bigDay = document.getElementById("bigDay");

document.body.classList.add("locked");

function cairoWallClock(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Africa/Cairo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(date);

  const get = (type) => parts.find((p) => p.type === type)?.value;
  let hour = Number(get("hour"));
  if (hour === 24) hour = 0;

  return {
    year: Number(get("year")),
    month: Number(get("month")),
    day: Number(get("day")),
    hour,
    minute: Number(get("minute")),
    second: Number(get("second")),
  };
}

function toStamp({ year, month, day, hour = 0, minute = 0, second = 0 }) {
  return Date.UTC(year, month - 1, day, hour, minute, second);
}

function updateCountdown() {
  const now = toStamp(cairoWallClock());
  const target = toStamp({ year: 2026, month: 10, day: 25 });
  let diff = target - now;

  if (diff <= 0) {
    countdownEl.hidden = true;
    bigDay.hidden = false;
    return;
  }

  const days = Math.floor(diff / 86400000);
  diff %= 86400000;
  const hours = Math.floor(diff / 3600000);
  diff %= 3600000;
  const minutes = Math.floor(diff / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);

  document.getElementById("days").textContent = String(days).padStart(2, "0");
  document.getElementById("hours").textContent = String(hours).padStart(2, "0");
  document.getElementById("minutes").textContent = String(minutes).padStart(2, "0");
  document.getElementById("seconds").textContent = String(seconds).padStart(2, "0");
}

updateCountdown();
setInterval(updateCountdown, 1000);

function spawnHearts() {
  const glyphs = ["♡", "♥", "❀"];
  for (let i = 0; i < 14; i += 1) {
    const el = document.createElement("span");
    el.className = "heart";
    el.textContent = glyphs[i % glyphs.length];
    el.style.left = `${Math.random() * 100}%`;
    el.style.fontSize = `${10 + Math.random() * 16}px`;
    el.style.animationDuration = `${10 + Math.random() * 12}s`;
    el.style.animationDelay = `${Math.random() * 8}s`;
    hearts.appendChild(el);
  }
}

spawnHearts();

let opened = false;

function openInvitation() {
  if (opened) return;
  opened = true;

  document.body.classList.add("is-open");
  envelope.setAttribute("aria-expanded", "true");
  document.getElementById("inviteCard").removeAttribute("aria-hidden");

  window.setTimeout(() => {
    const card = document.getElementById("inviteCard");
    const opening = document.getElementById("opening");
    opening.appendChild(card);
    document.body.classList.add("revealed");
    document.body.classList.remove("locked");
    site.hidden = false;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, 1650);
}

envelope.addEventListener("click", openInvitation);
envelope.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    openInvitation();
  }
});
