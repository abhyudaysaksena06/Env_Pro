const hostels = [
  { name: "HOSTEL H", score: 82 },
  { name: "HOSTEL M", score: 75 },
  { name: "HOSTEL E", score: 68 },
];

const individuals = [
  { name: "REDDIT USER", score: 85 },
  { name: "SAAAAAAANVI", score: 78 },
  { name: "INSTA USER", score: 74 },
];

function render(data, id) {
  const container = document.getElementById(id);

  data.sort((a, b) => b.score - a.score);

  data.forEach((item, i) => {
    const div = document.createElement("div");
    div.className = "card";
    if (i === 0) div.classList.add("top");

    div.innerHTML = `
    <div>#${i + 1}</div>
    <h3>${item.name}</h3>
    <p>${item.score}</p>
  `;

    container.appendChild(div);
  });
}

render(hostels, "hostelCards");
render(individuals, "individualCards");

/* COUNTERS */
document.querySelectorAll(".counter").forEach((counter) => {
  let update = () => {
    let target = +counter.dataset.target;
    let count = +counter.innerText;
    let inc = target / 50;

    if (count < target) {
      counter.innerText = Math.ceil(count + inc);
      setTimeout(update, 20);
    } else counter.innerText = target;
  };
  update();
});

/* CURSOR GLOW */
const glow = document.querySelector(".cursor-glow");
document.addEventListener("mousemove", (e) => {
  glow.style.left = e.clientX + "px";
  glow.style.top = e.clientY + "px";
});
