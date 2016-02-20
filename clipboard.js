var oldSelectionRange;

function copyToClipboard(emoji) {
  var range = createRange(emoji);
  var selection = window.getSelection();

  replaceCurrentSelection(selection, range);
  printCopyStatusMessage(document.execCommand("copy"), emoji.textContent);
  restorePrevSelection(selection, range);
}

function createRange(emoji) { // emoji should be a node
  var range = document.createRange();
  range.selectNode(emoji);
  return range;
}

function replaceCurrentSelection(selection, range) {
  recordCurrentSelection(selection)
  selection.removeAllRanges();
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

  // FIXME Doesn't actually restore anything
  if (oldSelectionRange)
    selection.addRange(oldSelectionRange);
}
