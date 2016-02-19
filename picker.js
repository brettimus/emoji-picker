var picker = document.querySelector(".emoji-picker");
if (!picker) throw new Error("Can't find picker");

var isDoubleMeta = false;

document.body.addEventListener("keyup", keyupHandler);
picker.addEventListener("click", handleEmojiClick);

function handleEmojiClick(event) {
  if (event.target.classList.contains("emoji-choice")) {
    console.log("Copied to clipboard! (Except not)");
  }
}

function populatePicker(emojis) {
  emojis.forEach(function(emoji) {
    picker.appendChild(createEmojiElt(emoji));
  });
}

function createEmojiElt(emoji) {
  var span = document.createElement("span");
  span.classList.add("emoji", "emoji-choice");
  span.innerHTML = emoji;
  return span;
}

function keyupHandler(event) {
  if (!isCommandKey(event.keyCode)) return;
  isDoubleMeta ? togglePicker() : recordMeta();
  setTimeout(resetMetaRecord, 300);
}

function togglePicker() {
  isHidden() ? showPicker() : hidePicker();
}

function isHidden() {
  return picker.style.display === "none";
}

function showPicker() {
  picker.style.display = "flex";
}

function hidePicker() {
  picker.style.display = "none";
}

function recordMeta() {
  isDoubleMeta = true;
}

function resetMetaRecord() {
  isDoubleMeta = false;
}

function isCommandKey(n) {
  return n === 91 || n === 93;
}
