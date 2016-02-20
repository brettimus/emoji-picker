var EMOJIS;

loadJSON("emoji.json", parseEmojiData);

function parseEmojiData(emojis) {
  EMOJIS = emojis;
}

function findEmojisByAlias(query) {
  return EMOJIS.filter(matchesQuery).map(getEmoji);

  function matchesQuery(emoji) {
    return emoji.aliases.some(function(alias) {
      return alias.includes(query);
    });
  }
}

function getEmoji(emoji) {
  return emoji.emoji;
}

function loadJSON(path, success, error, context) {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
      context = context || this;
      if (xhr.readyState === XMLHttpRequest.DONE) {
          if (xhr.status === 200) {
              if (success) {
                  success.call(context, JSON.parse(xhr.responseText));
              }
          } else {
              if (error) {
                  error.call(context, xhr);
              }
          }
      }
  };
  xhr.open("GET", path, true);
  xhr.send();
  return xhr;
}
