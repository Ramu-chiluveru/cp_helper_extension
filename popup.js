const prompts = {
  lite: "Give a one-liner summary of this problem:\n{}",
  mid: "Reword this competitive programming problem in a beginner-friendly way:\n{}",
  full: "Explain this competitive programming problem as if to a 10-year-old:\n{}",
  hints: "Give 2-3 subtle hints (not full solution) to solve this problem:\n{}"
};

function sendPrompt(level) {
  const resultEl = document.getElementById("result");
  resultEl.innerText = "Loading...";

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tabId = tabs[0].id;

    chrome.scripting.executeScript(
      {
        target: { tabId },
        func: () => {
          const el = document.getElementById("cp-helper-text");
          return el ? el.innerText : null;
        }
      },
      async (results) => {
        const problem = results[0].result;

        if (!problem) {
          resultEl.innerText = "Problem text not found on page.";
          return;
        }

        const finalPrompt = prompts[level].replace("{}", problem);
        console.log("Using backend:", BACKEND_URL);
        try {
          const response = await fetch(`${BACKEND_URL}/explain`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt: finalPrompt })
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          console.log("Response from backend:", data);

          resultEl.innerText = data.response || "No explanation received.";
        }
      catch (err) {
          console.error("API call failed:", err);
          resultEl.innerText = "Error contacting backend. Make sure server is running.";
      }}
    );
  });
}


document.getElementById("result").innerText = "Waiting for your input...";

//buttons to send the prompt
document.getElementById("btn-lite").onclick = () => sendPrompt("lite");
document.getElementById("btn-mid").onclick = () => sendPrompt("mid");
document.getElementById("btn-full").onclick = () => sendPrompt("full");
document.getElementById("btn-hints").onclick = () => sendPrompt("hints");
