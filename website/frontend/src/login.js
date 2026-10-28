import "./style.css";
import "./scramble.js";

// Skip the form if already signed in.
fetch("/api/dashboard").then((res) => {
  if (res.ok) location.replace("/dashboard/");
});

const form = document.getElementById("login");
const error = document.getElementById("error");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  error.textContent = "";
  const res = await fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(Object.fromEntries(new FormData(form))),
  }).catch(() => null);

  if (res?.ok) return location.assign("/dashboard/");
  const data = await res?.json().catch(() => null);
  error.textContent = data?.error ?? "could not reach the server";
});
