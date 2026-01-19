const flame = document.getElementById("flame");
const cake = document.getElementById("cake");
const blowBtn = document.getElementById("blowBtn");
const micBtn = document.getElementById("micBtn");

let blown = false;
let stream, audioCtx, analyser, dataArray, raf;

cake.onclick = blow;
blowBtn.onclick = blow;
micBtn.onclick = toggleMic;

function blow() {
  if (blown) return;
  blown = true;

  flame.classList.add("out");
  stopMic();
  confettiBurst();

  setTimeout(() => {
    window.location.href = "surprise.html";
  }, 2500);
}

async function toggleMic() {
  if (stream) {
    stopMic();
    micBtn.textContent = "Enable Mic";
    return;
  }

  try {
    stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 512;

    const source = audioCtx.createMediaStreamSource(stream);
    source.connect(analyser);
    dataArray = new Uint8Array(analyser.fftSize);

    micBtn.textContent = "Blow Into Mic";
    detectBlow();
  } catch {
    alert("Microphone permission denied");
  }
}

function detectBlow() {
  analyser.getByteTimeDomainData(dataArray);

  let sum = 0;
  for (let i = 0; i < dataArray.length; i++) {
    const v = (dataArray[i] - 128) / 128;
    sum += v * v;
  }

  const volume = Math.sqrt(sum / dataArray.length);

  if (volume > 0.12 && !blown) {
    blow();
    return;
  }

  raf = requestAnimationFrame(detectBlow);
}

function stopMic() {
  if (raf) cancelAnimationFrame(raf);
  if (stream) {
    stream.getTracks().forEach(t => t.stop());
    stream = null;
  }
  if (audioCtx) audioCtx.close();
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
