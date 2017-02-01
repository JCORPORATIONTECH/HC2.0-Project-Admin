var hbs = require('hbs');
var currencyFormatter = require('currency-formatter');
var dateFormat = require('dateformat');

hbs.registerHelper('isEquals', function (a, b) {
  return (a === b);
});

hbs.registerHelper('isEmpty', function (a) {
  return (a === '' || a === null);
});

hbs.registerHelper('totalCredit', function (credit, debit) {
  return parseInt(credit) - parseInt(debit);
});

hbs.registerHelper('comma-number', function (num) {
  if (num === null || isNaN(num)) {
    return 0;
  }

  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
});

hbs.registerHelper('currency', function (num) {
  return currencyFormatter.format(num, {code: 'USD'});
});

hbs.registerHelper('checkMinus', function (num) {
  if (isNaN(num))
    num = parseInt(num);

  if (num.toString().indexOf('-') != -1)
    return true;

  return false;
});

hbs.registerHelper('time', function (date) {
  if (date !== null && date !== undefined && date !== '') {
    return dateFormat(date, "yyyy-mm-dd");
  }
  return '-';
});

hbs.registerHelper('stime', function (date) {
  return dateFormat(date, "yyyy-mm-dd HH:MM:ss");
});

hbs.registerHelper('comparison', function (value, max) {
  return (value < max) ? true : false;
});

/**
 * 숫자를 받아서 받은 숫자만큼 앞에 특정 문자를 써서 들여쓰기를 해준다.
 */
hbs.registerHelper('IndentWithLetter', function (number, letter) {
  var str = "";
  var number = parseInt(number);
  if (number === 0) {
    return "-";
  }
  str = letter.toString();
  for (var i = 1; i < number; i++) {
    str += str;
  }
  return str;
});


/*
 * http://bdadam.com/blog/comparison-helper-for-handlebars.html
 * 사용법 참고*/
hbs.registerHelper('ifCond', function (v1, operator, v2, options) {
  switch (operator) {
    case '==':
      return (v1 == v2) ? options.fn(this) : options.inverse(this);
    case '===':
      return (v1 === v2) ? options.fn(this) : options.inverse(this);
    case '!==':
      return (v1 !== v2) ? options.fn(this) : options.inverse(this);
    case '<':
      return (v1 < v2) ? options.fn(this) : options.inverse(this);
    case '<=':
      return (v1 <= v2) ? options.fn(this) : options.inverse(this);
    case '>':
      return (v1 > v2) ? options.fn(this) : options.inverse(this);
    case '>=':
      return (v1 >= v2) ? options.fn(this) : options.inverse(this);
    case '&&':
      return (v1 && v2) ? options.fn(this) : options.inverse(this);
    case '||':
      return (v1 || v2) ? options.fn(this) : options.inverse(this);
    default:
      return options.inverse(this);
  }
});

hbs.registerHelper('for', function(from, to, incr, block) {
  var accum = '';
  for(var i = from; i < to; i += incr)
    accum += block.fn(i);
  return accum;
});


hbs.registerHelper('divideChannel', function (string) {
  var _arr = string.split(',');
  return _arr[0];
});