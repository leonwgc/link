const checkFilterRegex = /\{\{[^\}\|]+\|[^\}\|]+\}\}/;

export function hasFilter(text, fromTextNode) {
  if (!fromTextNode) {
    return checkFilter(text);
  } else {
    return checkFilterRegex.test(text);
  }
}

function checkFilter(text) {
  if (text.indexOf('|') === -1) return false;
  var len = text.length, i = 0, ch, next;
  while (i < len) {
    ch = text[i];
    if (ch === '"' || ch === "'") {
      next = i + 1;
      while (next < len && text[next] !== ch) {
        ++i;
      }
      if (i < len) {
        i += 2;
      } else {
        throw new Error('bad text');
      }
    } else if (ch === '|') {
      next = i + 1;
      if (next < len && text[next] !== ch) {
        return true;
      } else {
        i += 2;
      }
    } else {
      ++i;
    }
  }
  return false;
}