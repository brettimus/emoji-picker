var picker = document.querySelector(".emoji-picker");
var isDoubleMeta = false;
var isCopySupported = document.queryCommandSupported('copy');
var oldSelectionRange;

if (!picker) throw new Error("Can't find container ('.emoji-picker')");
if (!isCopySupported) throw new Error("'Copy to clipboard' not supported."); // Chrome 43+ should support

document.body.addEventListener("keyup", keyupHandler);
picker.addEventListener("click", handleEmojiClick);

function populatePicker(emojis) {
  emojis.forEach(addEmojiToPicker);
}

function addEmojiToPicker(emoji) {
  var choices = picker.querySelector(".emoji-choices");
  if (!choices) throw new Error("Could not find emoji choices container.");
  choices.appendChild(createEmojiElt(emoji));
}

function createEmojiElt(emoji) {
  var span = document.createElement("span");
  span.classList.add("emoji", "emoji-choice");
  span.innerHTML = emoji;
  return span;
}

function handleEmojiClick(event) {
  if (event.target.classList.contains("emoji-choice"))
    copyToClipboard(event.target);
}

function copyToClipboard(emojiElt) {
  var emoji = emojiElt.textContent;
  var range = createEmojiRange(emojiElt);
  var selection = window.getSelection();

  replaceCurrentSelection(selection, range);
  printCopyStatusMessage(document.execCommand("copy"), emoji);
  restorePrevSelection(selection, range);
}

function createEmojiRange(emojiElt) {
  var range = document.createRange();
  range.selectNode(emojiElt);
  return range;
}

function replaceCurrentSelection(selection, range) {
  recordCurrentSelection(selection)
  selection.empty(); // Unsure if should use this or `removeAllRanges`
  selection.addRange(range);
}

function recordCurrentSelection(selection) {
  oldSelectionRange = selection.getRangeAt(0);
}

function printCopyStatusMessage(wasCopySuccessful, emoji) {
  if (wasCopySuccessful)
    console.log("Copied", emoji, "to clipboard!");
  else
    console.log("Did not copy", emoji, "to clipboard!");
}

function restorePrevSelection(selection, range) {
  if ("removeRange" in selection)
    selection.removeRange(range);
  else
    selection.removeAllRanges();

  if (oldSelectionRange)
    selection.addRange(oldSelectionRange);
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
  picker.style.display = "";
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
