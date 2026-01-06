console.log("Spam detector extension loaded");

let lastEmailText = "";

function extractEmailText() {
  // Gmail email body selector
  const emailBody = document.querySelector("div.a3s");
  if (!emailBody) return null;
  return emailBody.innerText.trim();
}

function checkSpam(emailText) {
  fetch("http://127.0.0.1:8000/predict", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: emailText })
  })
    .then(res => res.json())
    .then(data => {
      console.log("Prediction:", data.label, data.confidence);

      showBanner(data.label);
    })
    .catch(err => {
      console.error("Spam API error:", err);
    });
}

function showBanner(label) {
  // Remove old banner if exists
  const oldBanner = document.getElementById("spam-banner");
  if (oldBanner) oldBanner.remove();

  const banner = document.createElement("div");
  banner.id = "spam-banner";

  banner.style.position = "fixed";
  banner.style.top = "0";
  banner.style.left = "0";
  banner.style.width = "100%";
  banner.style.padding = "10px";
  banner.style.zIndex = "9999";
  banner.style.fontSize = "16px";
  banner.style.fontWeight = "bold";
  banner.style.textAlign = "center";
  banner.style.color = "white";

  if (label === "spam") {
    banner.innerText = "🚨 This email looks like SPAM";
    banner.style.backgroundColor = "#d93025"; // red
  }
  else if (label === "promotion") {
    banner.innerText = "📢 This is a PROMOTIONAL email";
    banner.style.backgroundColor = "#fbbc04"; // yellow
    banner.style.color = "black";
  }
  else {
    banner.innerText = "✅ This email looks SAFE";
    banner.style.backgroundColor = "#1e8e3e"; // green
  }

  document.body.appendChild(banner);
}

const observer = new MutationObserver(() => {
  const emailText = extractEmailText();
  if (!emailText || emailText === lastEmailText) return;

  lastEmailText = emailText;
  console.log("Checking email...");
  checkSpam(emailText);
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});
