const flame = document.getElementById("flame");
const cake = document.getElementById("cake");
const music = document.getElementById("music");
const meter = document.getElementById("meter");
const micBtn = document.getElementById("micBtn");
const blowBtn = document.getElementById("blowBtn");

let blown = false;
let stream, ctx, analyser, data, raf;

// Manual blow
cake.onclick = blow;
blowBtn.onclick = blow;

// Mic toggle
micBtn.onclick = toggleMic;

function blow(){
  if(blown) return;
  blown = true;

  flame.classList.add("out");

  // autoplay music AFTER interaction
  setTimeout(() => {
    music.play().catch(()=>{});
  }, 300);

  stopMic();
}

// -------- Mic Logic (simple & reliable) --------
async function toggleMic(){
  if(stream){
    stopMic();
    micBtn.textContent = "Enable Mic";
    return;
  }

  try{
    stream = await navigator.mediaDevices.getUserMedia({ audio:true });
    ctx = new AudioContext();
    analyser = ctx.createAnalyser();
    analyser.fftSize = 512;

    const src = ctx.createMediaStreamSource(stream);
    src.connect(analyser);
    data = new Uint8Array(analyser.fftSize);

    micBtn.textContent = "Stop Mic";
    detect();
  }catch{
    alert("Microphone permission required");
  }
}

function stopMic(){
  cancelAnimationFrame(raf);

  if(stream){
    stream.getTracks().forEach(t => t.stop());
    stream = null;
  }
  if(ctx) ctx.close();

  meter.style.width = "0%";
}

function detect(){
  analyser.getByteTimeDomainData(data);

  let sum = 0;
  for(let i=0;i<data.length;i++){
    const v = (data[i]-128)/128;
    sum += v*v;
  }

  const volume = Math.sqrt(sum/data.length);
  meter.style.width = Math.min(100, volume * 300) + "%";

  if(volume > 0.12 && !blown){
    blow();
    return;
  }

  raf = requestAnimationFrame(detect);
}
function afterMicSuccess() {
  startConfetti(); // your existing confetti

  document.getElementById("afterBlow").classList.remove("hidden");

  setTimeout(() => {
    document.getElementById("littleMsg").classList.add("hidden");
    document.getElementById("envelope").classList.remove("hidden");
  }, 4000);
}

document.getElementById("envelope").addEventListener("click", () => {
  const env = document.getElementById("envelope");
  env.classList.add("open");

  setTimeout(() => {
    env.classList.add("hidden");
    document.getElementById("letterCard").classList.remove("hidden");
  }, 600);
});
