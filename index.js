#!/usr/bin/env node

const argv = process.argv;
const filePath = __dirname;
const loadLanguages = require('prismjs/components/index');
const fs = require('fs');
const Prism = require('prismjs');
const { isArray, isRegExp } = require('lodash');

// remove unrequire args
argv.shift();
argv.shift();

// add global flag
function addGlobal(pattern) {
  if (!pattern.global) {
    const flags = pattern.toString().match(/[imuy]*$/)[0];
    if (flags) {
      return new RegExp(pattern.source, `${flags}g`);
    }
    return new RegExp(pattern.source, 'g');
  }
  return pattern;
}

/** Traverse all pattern into an array
 * @param {String} name className,regexpName
 * @param {Object} obj some language(javascript,css etc...)
 * @param {Array} arr an array contain all regexp
 * @param {String} children the nest(deepin) object name
 */
function findPattern(name, obj, arr = [], children) {
  if (isRegExp(obj)) {
    arr.push({ name, reg: addGlobal(obj) });
  }
  if (isArray(obj)) {
    obj.forEach(i => findPattern(name, i, arr, children));
  }
  if (isRegExp(obj.pattern)) {
    arr.push({ name, reg: addGlobal(obj.pattern) });
  }
  if (obj[children]) {
    findPattern(name, obj[children], arr, children);
  }

  if (!isArray(obj)) {
    // loop all keys to find the children in deep
    Object.keys(obj).forEach((key) => {
      if (obj[key].pattern) {
        arr.push({ name: key, reg: addGlobal(obj[key].pattern) });
      }
      if (obj[key][children]) {
        findPattern(key, obj[key].inside, arr, children);
      }
    });
  }
}

// the aim arr fullfilled regexp
let checkers = [];

/**convert checkers to formatted string
 * @param {string} lang // the language name
 */
const convertArrayToStr = (lang) =>{
  let str = `const ${lang} =\n[\n`;

  checkers.forEach((item) => {
    str += '  { ';
    Object.keys(item).forEach((key) => {
      if (key === 'name') {
        str += `${key}: '${item[key]}', `;
      } else {
        str += `${key}: ${item[key]}, `;
      }
    });
    str += '},\n';
  });
  str += `];\n\nexport default ${lang};\n`;
  return str;
};

// The main method, traverse the input languages
argv.forEach((langName = 'javascript') => {

  // a language object contain the structuration regexp
  let langRegObj = null;

  if (langName in Prism.languages) {
    loadLanguages(langName);
    langRegObj = Prism.languages[langName];
  } else {
    return;
  }

  const finderNames = Object.getOwnPropertyNames(langRegObj);

  checkers = [];
  // gain all regexp
  finderNames.forEach((name) => {
    findPattern(name, langRegObj[name], checkers, 'inside');
  });

  fs.writeFile(`${filePath}/${langName}.js`, convertArrayToStr(langName), (err) => {
    if (err) {
      console.log(err);
      return;
    }
    console.log('done');
  });

});
