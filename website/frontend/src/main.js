import "./style.css";
import "./scramble.js";

document.getElementById("year").textContent = new Date().getFullYear();

const status = document.getElementById("api-status");
fetch("/api/health")
  .then((res) => (res.ok ? res.json() : Promise.reject()))
  .then((data) => {
    status.textContent = `api: ${data.status}`;
  })
  .catch(() => {
    status.textContent = "api: offline";
  });
