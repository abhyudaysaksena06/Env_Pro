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

/* PRELOADER */
window.addEventListener("load", () => {
  const preloader = document.getElementById("preloader");
  if (preloader) {
    preloader.style.opacity = "0";
    setTimeout(() => {
      preloader.style.display = "none";
    }, 500); // Wait for transition
  }
});

/* SCROLL ANIMATION */
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  { threshold: 0.1 }
);

document.querySelectorAll(".fade-in").forEach((el) => {
  observer.observe(el);
});

/* IMPACT CALCULATOR */
function calculateImpact() {
  const acHours = document.getElementById("acHours").value || 0;
  const distKm = document.getElementById("distKm").value || 0;
  const vehicleType = document.getElementById("vehicleType").value;

  // Constants (approximate kg CO2)
  const acCo2PerHour = 0.45;
  let transportCo2PerKm = 0;

  switch (vehicleType) {
    case "car": transportCo2PerKm = 0.15; break; // 150g/km
    case "bike": transportCo2PerKm = 0.05; break; // 50g/km
    case "auto": transportCo2PerKm = 0.10; break; // 100g/km
    case "ev": transportCo2PerKm = 0.02; break; // 20g/km (grid emissions)
  }

  const acImpact = (acHours * acCo2PerHour).toFixed(2);
  const transportImpact = (distKm * transportCo2PerKm).toFixed(2);
  const totalImpact = (parseFloat(acImpact) + parseFloat(transportImpact)).toFixed(2);

  let analogy = "";
  if (totalImpact > 0) {
    const mobileCharges = Math.round(totalImpact * 122); // 1kg CO2 = ~122 smartphone charges
    const treeAbsorption = (totalImpact / 21).toFixed(1); // 1 tree absorbs ~21kg CO2 per year

    analogy = `
      <p>Your footprint for these activities is <strong>${totalImpact} kg of CO2</strong>.</p>
      <br>
      <p>🌎 <strong>What does this mean?</strong></p>
      <p>This equals the emissions from charging a smartphone <strong>${mobileCharges} times</strong>.</p>
      <p>It would take a mature tree <strong>${treeAbsorption} years</strong> to absorb this much CO2.</p>
    `;
  } else {
    analogy = "<p>Please enter valid usage data to see your impact.</p>";
  }

  const resultBox = document.getElementById("impactResult");
  resultBox.innerHTML = analogy;
  resultBox.style.display = "block";
}
