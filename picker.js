var picker = document.querySelector("[data-emoji-picker]");
var searcher = picker.querySelector("input");
var results = getChoicesContainer();
var isDoubleMeta = false;
var isCopySupported = document.queryCommandSupported('copy');

if (!picker) throw new Error("Can't find container ('.emoji-picker')");
if (!isCopySupported) throw new Error("'Copy to clipboard' not supported."); // Chrome 43+ should support

document.body.addEventListener("keyup", keyupHandler);
picker.addEventListener("click", handleEmojiClick);
searcher.addEventListener("input", handleInputChange);

function clearResults() {
  while (results.firstChild)
    results.removeChild(results.firstChild);
}

function renderResults(emojis) {
  emojis.forEach(addEmojiToPicker);
}

function addEmojiToPicker(emoji) {
  results.appendChild(createEmojiElt(emoji));
}

function createEmojiElt(emoji) {
  var span = document.createElement("span");
  span.classList.add("emoji", "emoji-choice");
  span.innerHTML = emoji;
  return span;
}

function handleInputChange(event) {
  var query = cleanQuery(event.target.value);
  clearResults();
  if (query === "") return;
  renderResults(findEmojisByAlias(query));
}

function cleanQuery(query) {
  return query.toLowerCase().trim();
}

function handleEmojiClick(event) {
  if (!event.target.classList.contains("emoji-choice")) return;
  copyToClipboard(event.target.firstChild);
  hidePicker();
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
  selection.removeAllRanges(); // Unsure if should use this or `removeAllRanges`
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

  // BROKEN!
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
  getInput().focus();
}

function hidePicker() {
  picker.style.display = "none";
}

function getInput() {
  return picker.querySelector("input");
}

function getChoicesContainer() {
  var choices = picker.querySelector("[data-emoji-choices]");
  if (!choices) throw new Error("Could not find emoji choices container.");
  return choices;
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
