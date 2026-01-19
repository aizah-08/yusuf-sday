const flame = document.getElementById("flame");
const cake = document.getElementById("cake");
const blowBtn = document.getElementById("blowBtn");

let blown = false;

cake.onclick = blow;
blowBtn.onclick = blow;

function blow() {
  if (blown) return;
  blown = true;

  flame.classList.add("out");
  confettiBurst();

  setTimeout(() => {
    window.location.href = "surprise.html";
  }, 2500);
}

function confettiBurst() {
  for (let i = 0; i < 40; i++) {
    const c = document.createElement("div");
    c.className = "confetti";
    c.style.left = Math.random() * 100 + "vw";
    c.style.backgroundColor = `hsl(${Math.random() * 360},100%,70%)`;
    c.style.animationDuration = 2 + Math.random() + "s";
    document.body.appendChild(c);

    setTimeout(() => c.remove(), 3000);
  }
}
