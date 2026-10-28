import "./style.css";
import "./scramble.js";

const res = await fetch("/api/dashboard");
if (!res.ok) {
  location.replace("/login/");
} else {
  const { member, announcements } = await res.json();
  document.getElementById("name").textContent = member.name;
  document.getElementById("email").textContent = member.email;
  document.getElementById("joined").textContent = member.joined;

  const list = document.getElementById("announcements");
  for (const { date, text } of announcements) {
    const li = document.createElement("li");
    li.textContent = `${date}: ${text}`;
    list.append(li);
  }
  if (!announcements.length) list.textContent = "nothing yet.";

  document.querySelector("main").hidden = false;
}

document.getElementById("logout").addEventListener("click", async (e) => {
  e.preventDefault();
  await fetch("/api/logout", { method: "POST" });
  location.assign("/");
});
