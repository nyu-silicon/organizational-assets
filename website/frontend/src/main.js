import "./style.css";

document.getElementById("year").textContent = new Date().getFullYear();

const status = document.getElementById("api-status");
fetch("/api/health")
  .then((res) => (res.ok ? res.json() : Promise.reject()))
  .then((data) => {
    status.textContent = `api: ${data.status}`;
    status.classList.add("ok");
  })
  .catch(() => {
    status.textContent = "api: offline";
  });
