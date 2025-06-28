console.log("CP Helper content.js loaded");

function extractProblemText() {
  let text = "";

  try {
    const hostname = location.hostname;

    if (hostname.includes("leetcode.com")) 
    {
      const el = document.querySelector('[data-track-load="description_content"]');
      text = el?.innerText || "";
    } 
    else if (hostname.includes("codeforces.com")) {
      const el = document.querySelector(".problem-statement");
      text = el?.innerText || "";
    } 
    else if (hostname.includes("cses.fi")) {
      const el = document.querySelector(".md");
      text = el?.innerText || "";
    }

    console.log("Extracted Text:", text);

    
    if (!document.getElementById("cp-helper-text")) {
      const hiddenDiv = document.createElement("div");
      hiddenDiv.id = "cp-helper-text";
      hiddenDiv.style.display = "none";
      hiddenDiv.innerText = text;
      document.body.appendChild(hiddenDiv);
    } else {
      document.getElementById("cp-helper-text").innerText = text;
    }

  } catch (err) {
    console.error("Error extracting problem text:", err);
  }
}

window.addEventListener("load", () => {
  setTimeout(extractProblemText, 1000);
});
