var model = {
  name: 'LeonWang',
  money: '1234567.89',
  phone: '15901634301'
};

var timerId = 'demo';
console.time(timerId);

function isString(str) {
  return typeof str === 'string';
}

function moneyFilter(str) {
  if (!Number(str)) return str;
  str = str + '';
  var digit = [],
    decimals = '',
    pointIndex = -1,
    groups = [],
    sep = ',';
  if ((pointIndex = str.indexOf('.')) > -1) {
    digit = str.slice(0, pointIndex).split('');
    decimals = str.slice(pointIndex);
  }
  else {
    digit = str.split('');
  }
  do {
    groups.unshift(digit.splice(-3).join(''));
  } while (digit.length > 0);

  return groups.join(sep) + decimals;
}

function uppercase(str) {
  if (isString(str)) {
    return str.toUpperCase();
  }
  return str;
}
function lowercase(str) {
  if (isString(str)) {
    return str.toLowerCase();
  }
  return str;
}

function phoneFilter(str) {
  if (isString(str) && str.length === 11) {
    return str.slice(0, 3) + '****' + str.slice(-4);
  }

  return str;
}

link.filter('money', moneyFilter);
link.filter('uppercase', uppercase);
link.filter('lowercase', lowercase);
link.filter('phone', phoneFilter);
link.filter('firstLetterLowerCase', function (str) {
  return str[0].toLowerCase() + str.slice(1);
});
var linker = link({ model: model });



console.timeEnd(timerId)