'use strict';
const load = require('./load.js');
const JK = load(['js/english/lemma.js']);
const en = JK.en;
let fail = 0, n = 0;
function eq(word, expect) {
  n++;
  const got = en.lemmas(word);
  const ok = expect.every((x) => got.indexOf(x) >= 0) && (expect.length > 0 || got.length === 0);
  if (!ok) { fail++; console.log('NG lemmas(' + word + ') =', JSON.stringify(got), 'expected ⊇', JSON.stringify(expect)); }
}
eq('studied', ['study']); eq('better', ['good', 'well']); eq('went', ['go']); eq('gone', ['go']); eq('children', ['child']);
eq('running', ['run']); eq('stopped', ['stop']); eq('making', ['make']); eq('loved', ['love']); eq('cities', ['city']);
eq('boxes', ['box']); eq('goes', ['go']); eq('has', ['have']); eq('was', ['be']); eq('were', ['be']); eq('been', ['be']);
eq('taller', ['tall']); eq('biggest', ['big']); eq('happier', ['happy']); eq('largest', ['large']); eq('worst', ['bad']);
eq('left', ['leave', 'left']); eq('found', ['find']); eq('thought', ['think', 'thought']); eq('lay', ['lie', 'lay']);
eq('lives', ['life', 'live']); eq('leaves', ['leaf', 'leave']); eq('knew', ['know']); eq('written', ['write']);
eq('taught', ['teach']); eq('lying', ['lie']); eq('dying', ['die']); eq('happily', ['happy']); eq('simply', ['simple']);
eq('books', ['book']); eq('plays', ['play']); eq('broken', ['break']); eq('scientists', ['scientist']); eq('raining', ['rain']);
eq('men', ['man']); eq('women', ['woman']); eq('feet', ['foot']); eq('more', ['many', 'much', 'more']); eq('did', ['do']);
eq('xyzzy', []); eq('number', ['number']); eq('water', ['water']); eq('this', ['this']); eq('its', ['its']);
eq('news', []); eq('only', ['only']); eq('during', ['during']); eq('thing', ['thing']); eq('morning', ['morning']);
// 余計な原形が混ざらないこと
function not(word, bad) {
  n++;
  const got = en.lemmas(word);
  if (bad.some((x) => got.indexOf(x) >= 0)) { fail++; console.log('NG lemmas(' + word + ') =', JSON.stringify(got), 'must not contain', JSON.stringify(bad)); }
}
not('number', ['numb']); not('his', ['hi']); not('its', ['it']); not('as', ['a']); not('only', ['on']); not('early', ['ear']);
not('evening', ['even']); not('forest', ['for']); not('news', ['new']); not('us', ['u']); not('need', ['ne']);
console.log('lemmas:', n - fail, '/', n, 'ok');
['left', 'studied', 'better', 'books', 'broken', 'is', 'living', 'found', 'quickly', 'happily', 'more', 'lives', "boy's", 'Tokyo', 'used', 'tired', 'interested', 'saw', 'rose', 'fell', 'felt', 'spoke', 'wound', 'bound', 'ground']
  .forEach((w) => console.log(w.padEnd(11), en.lookup(w).map((e) => e.w + '/' + e.pos + (e.form ? '[' + e.form + ']' : '') + ':' + e.ja.split(';')[0]).join(' | ') || '---'));
console.log('isPP(broken)', en.morph.isPP('broken'), 'isPP(lived)', en.morph.isPP('lived'), 'isIng(reading)', en.morph.isIng('reading'), 'isBaseVerb(learn)', en.morph.isBaseVerb('learn'), 'isBaseVerb(book)', en.morph.isBaseVerb('book'), 'isPast(went)', en.morph.isPast('went'));
process.exit(fail ? 1 : 0);
