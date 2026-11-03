document.addEventListener("DOMContentLoaded", () => {
  const modelEl = document.getElementById("model");
  const keyEl = document.getElementById("key");
  const useEl = document.getElementById("useOfficial");
  const saveBtn = document.getElementById("save");
  if (!modelEl || !keyEl || !useEl || !saveBtn) return;

  chrome.storage.local.get(["ps_api_key", "ps_model", "ps_use_official"], (data) => {
    if (chrome.runtime.lastError) return;
    if (data.ps_model) modelEl.value = data.ps_model;
    if (data.ps_api_key) keyEl.value = data.ps_api_key;
    useEl.checked = !!data.ps_use_official;
  });

  saveBtn.addEventListener("click", () => {
    const key = (keyEl.value || "").trim();
    chrome.storage.local.set(
      {
        ps_model: modelEl.value,
        ps_api_key: key || null,
        ps_use_official: !!useEl.checked,
      },
      () => {
        if (chrome.runtime.lastError) {
          saveBtn.textContent = "Error";
          setTimeout(() => {
            saveBtn.textContent = "Save";
          }, 1500);
          return;
        }
        saveBtn.textContent = "Saved";
        setTimeout(() => {
          saveBtn.textContent = "Save";
        }, 1200);
      }
    );
  });
});
