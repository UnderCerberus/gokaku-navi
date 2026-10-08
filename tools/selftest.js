#!/usr/bin/env node
/* 共通基盤（js/core）の自己テスト: node tools/selftest.js */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const ROOT = path.resolve(__dirname, '..');
const sandbox = { console };
sandbox.window = sandbox;
vm.createContext(sandbox);
['js/core/ns.js', 'js/core/util.js', 'js/core/tex.js', 'js/core/plot.js', 'js/core/steps.js', 'js/data/units.js']
  .forEach((f) => vm.runInContext(fs.readFileSync(path.join(ROOT, f), 'utf8'), sandbox, { filename: f }));
const JK = sandbox.JK;
const { Q, poly, expr, util: U, check } = JK;
let fail = 0, pass = 0;
function eq(name, got, want) {
  const ok = typeof want === 'number' ? Math.abs(got - want) < 1e-9 : got === want;
  if (ok) pass++; else { fail++; console.log('✖ ' + name + '\n    got : ' + got + '\n    want: ' + want); }
}

// Q
eq('Q reduce', Q(6, -8).toString(), '-3/4');
eq('Q add', Q(1, 2).add(Q(1, 3)).toString(), '5/6');
eq('Q from str', Q.from('0.75').toString(), '3/4');
eq('Q from frac', Q.from('-6/4').toString(), '-3/2');
eq('Q from dec', Q.from(-1.5).toString(), '-3/2');
eq('Q from 1/3', Q.from(1 / 3).toString(), '1/3');
eq('Q tex', Q(-3, 4).tex(), '-\\frac{3}{4}');
eq('Q pow', Q(2, 3).pow(-2).toString(), '9/4');
eq('Q null', Q.from('abc'), null);
eq('Q int add', Q(1, 2).add(1).toString(), '3/2');

// util
eq('sqrtTex 12', U.sqrtTex(12), '2\\sqrt{3}');
eq('sqrtTex 2/3', U.sqrtTex(Q(2, 3)), '\\frac{\\sqrt{6}}{3}');
eq('sqrtTex 16', U.sqrtTex(16), '4');
eq('sqrtTex -4', U.sqrtTex(-4), '2\\,i');
eq('sqrtTex -3', U.sqrtTex(-3), '\\sqrt{3}\\,i');
eq('fmt int', U.fmt(3.0000000001), '3');
eq('fmt dec', U.fmt(1.5), '1.5');
eq('fmt 100', U.fmt(100), '100');
eq('fmt third', U.fmt(1 / 3), '0.3333');
eq('sig 9.8', U.sig(9.8, 2), '9.8');
eq('sig 340', U.sig(340, 2), '3.4 \\times 10^{2}');
eq('sig 0.00123', U.sig(0.00123, 2), '1.2 \\times 10^{-3}');
eq('sig 3', U.sig(3, 2), '3.0');
eq('sig 12.34', U.sig(12.34, 3), '12.3');
eq('sig tie 15.75', U.sig(15.75, 3), '15.8');
eq('sig tie float', U.sig(55.5 - 39.75, 3), '15.8');
eq('sig tie 2.195e4', U.sig(21950, 3), '2.20 \\times 10^{4}');
eq('sig tie noisy', U.sig(36.749999999999993, 3), '36.8');
eq('sig carry', U.sig(9.996, 3), '10.0');
eq('sig carry exp', U.sig(9.996e5, 3), '1.00 \\times 10^{6}');
eq('sig small', U.sig(0.012345, 3), '0.0123');
eq('sig neg', U.sig(-0.5, 2), '-0.50');
eq('sig neg exp', U.sig(-3.315e-19, 3), '-3.32 \\times 10^{-19}');
eq('roundSig tie', U.roundSig(15.75, 3), 15.8);
eq('roundSig noisy', U.roundSig(1.005 * 1000, 3), 1010);
eq('roundSig below', U.roundSig(36.7499, 3), 36.7);
eq('roundSig carry', U.roundSig(99.96, 3), 100);
eq('roundSig tiny', U.roundSig(3.315e-19, 3), 3.32e-19);
eq('roundSig neg', U.roundSig(-21950, 3), -22000);
eq('roundSig 0', U.roundSig(0, 3), 0);
eq('roundSig n2', U.roundSig(0.0455, 2), 0.046);
eq('nCr', U.nCr(9, 2), 36);
eq('primeFactors', JSON.stringify(U.primeFactors(360)), '[[2,3],[3,2],[5,1]]');
eq('exactTrig 150 sin', U.exactTrig(150).sin, '\\frac{1}{2}');
eq('exactTrig 150 cos', U.exactTrig(150).cos, '-\\frac{\\sqrt{3}}{2}');
eq('exactTrig 90 tan', U.exactTrig(90).tan, null);
eq('exactTrig 315 tan', U.exactTrig(315).tan, '-1');
eq('signed', U.signed(Q(-2, 3)), '- \\frac{2}{3}');
eq('paren', U.paren(Q(-3)), '\\left(-3\\right)');

// expr
eq('expr 2√3', U.parseNum('2√3'), 2 * Math.sqrt(3));
eq('expr 3/4', U.parseNum('3/4'), 0.75);
eq('expr π/6', U.parseNum('π/6'), Math.PI / 6);
eq('expr sci', U.parseNum('1.5e-3'), 0.0015);
eq('expr pow', U.parseNum('2^10'), 1024);
eq('expr full-width', U.parseNum('－３／４'), -0.75);
eq('expr sqrt()', U.parseNum('sqrt(2)/2'), Math.SQRT1_2);
eq('expr sup', U.parseNum('3²'), 9);
eq('expr neg pow', U.parseNum('-2^2'), -4);
eq('expr implicit', U.parseNum('2(3+1)'), 8);
eq('expr fact', U.parseNum('5!'), 120);
eq('expr bad', isNaN(U.parseNum('2+')), true);
eq('expr equal 1', expr.equal('2x+1', '1+2x', ['x']), true);
eq('expr equal 2', expr.equal('(4x+2)/2', '2x+1', ['x']), true);
eq('expr equal 3', expr.equal('2x+2', '2x+1', ['x']), false);
eq('expr equal 4', expr.equal('(x-1)(x+2)', 'x^2+x-2', ['x']), true);
eq('expr equal 5', expr.equal('sin 2x', '2sin(x)cos(x)', ['x']), true);
eq('expr equal 6', expr.equal('x e^(-x)', 'x/e^x', ['x']), true);
eq('expr equal 7', expr.equal('log(x)/√x', 'ln(x)/sqrt(x)', ['x']), true);
eq('expr equal 8', expr.equal('2a+b', 'b+2a', ['a', 'b']), true);
eq('expr equal const', expr.equal('1/2', '0.5', []), true);

// poly
const p = poly.parse('x^3 - 3x^2 + 2');
eq('poly tex', poly.tex(p), 'x^{3} - 3x^{2} + 2');
eq('poly parse prod', poly.tex(poly.parse('(x-1)(x+2)^2')), 'x^{3} + 3x^{2} - 4');
eq('poly frac', poly.tex(poly.parse('1/2x^2 - x')), '\\frac{1}{2}x^{2} - x');
eq('poly deriv', poly.tex(poly.deriv(p)), '3x^{2} - 6x');
eq('poly integ', poly.tex(poly.integ(poly.parse('3x^2+2x'))), 'x^{3} + x^{2}');
eq('poly eval Q', poly.eval(p, Q(1, 2)).toString(), '11/8');
eq('poly eval num', poly.eval(p, 2), -2);
const dm = poly.divmod(poly.parse('x^4-2x^3+3x-5'), poly.parse('x^2+x-1'));
eq('poly div q', poly.tex(dm.q), 'x^{2} - 3x + 4');
eq('poly div r', poly.tex(dm.r), '-4x - 1');
const dm2 = poly.divmod(poly.parse('x^2+1'), poly.parse('x^3'));
eq('poly div small q', poly.tex(dm2.q), '0');
eq('poly div small r', poly.tex(dm2.r), 'x^{2} + 1');
const dm3 = poly.divmod(poly.parse('2x^3+3x^2-1'), poly.parse('2x-1'));
eq('poly div3 q', poly.tex(dm3.q), 'x^{2} + 2x + 1');
eq('poly div3 r', poly.tex(dm3.r), '0');
eq('poly roots', poly.rationalRoots(poly.parse('2x^3-3x^2-3x+2')).map(String).join(','), '-1,1/2,2');
eq('poly roots zero', poly.rationalRoots(poly.parse('x^3-x')).map(String).join(','), '-1,0,1');
eq('poly deg zero', poly.deg(poly.parse('0')), -1);
eq('poly neg lead', poly.tex(poly.parse('-x^2+4')), '-x^{2} + 4');

// check
eq('check num', check.part({ type: 'num', answer: 2 / 3 }, '2/3').ok, true);
eq('check num dec', check.part({ type: 'num', answer: 2 / 3 }, '0.6667').ok, true);
eq('check num ng', check.part({ type: 'num', answer: 2 / 3 }, '0.66').ok, false);
eq('check num rel', check.part({ type: 'num', answer: 9.8, rel: 0.02 }, '9.7').ok, true);
eq('check num tiny ok', check.part({ type: 'num', answer: 3.3e-19, rel: 0.02 }, '3.3e-19').ok, true);
eq('check num tiny near', check.part({ type: 'num', answer: 3.3e-19, rel: 0.02 }, '3.35*10^-19').ok, true);
eq('check num tiny zero', check.part({ type: 'num', answer: 3.3e-19, rel: 0.02 }, '0').ok, false);
eq('check num tiny double', check.part({ type: 'num', answer: 3.3e-19, rel: 0.02 }, '6.6e-19').ok, false);
eq('check num tiny default', check.part({ type: 'num', answer: 2e-7 }, '0').ok, false);
eq('check num tiny default ok', check.part({ type: 'num', answer: 2e-7 }, '2*10^-7').ok, true);
eq('check num zero', check.part({ type: 'num', answer: 0 }, '0').ok, true);
eq('check num zero rel', check.part({ type: 'num', answer: 0, rel: 0.02 }, '0.0').ok, true);
eq('check num blank', check.part({ type: 'num', answer: 1 }, ' ').blank, true);
eq('check num invalid', check.part({ type: 'num', answer: 1 }, 'abc+').invalid, true);
eq('check expr', check.part({ type: 'expr', answer: '-12x+6', vars: ['x'] }, '6-12x').ok, true);
eq('check choice', check.part({ type: 'choice', choices: ['a', 'b'], answer: 1 }, 1).ok, true);
eq('check multi', check.part({ type: 'multi', choices: ['a', 'b', 'c'], answer: [0, 2] }, [2, 0]).ok, true);
eq('check text', check.part({ type: 'text', answer: ['Take off', 'took off'] }, ' take  off. ').ok, true);
eq('check order', check.part({ type: 'order', words: ['to', 'want', 'I', 'go'], answer: 'I want to go' }, ['I', 'want', 'to', 'go']).ok, true);
// 入力例（hint）の答え漏えい判定
eq('hint examples', check.hintExamples('例: 25/4 や 6.25（小数第 2 位まで）').join('|'), '25/4|6.25');
eq('hint examples tex', check.hintExamples('$\\dfrac{3}{4}$ は 3/4、$2.5 \\times 10^{8}$ は 2.5e8 と入力').join('|'), '(3)/(4)|3/4|2.5 × 10^(8)|2.5|×|10^(8)|2.5e8');
eq('hint leak frac', check.hintLeak({ type: 'num', answer: 6.25, hint: '例: 25/4 や 6.25' }).join('|'), '25/4|6.25');
eq('hint leak sci', check.hintLeak({ type: 'num', answer: 4200, rel: 0.02, hint: '例: 4.2e3' }).length, 1);
eq('hint leak tex', check.hintLeak({ type: 'num', answer: 2.5e8, rel: 0.02, hint: '$2.5 \\times 10^{8}$ は 2.5e8 と入力' }).length > 0, true);
eq('hint leak expr', check.hintLeak({ type: 'expr', answer: '2x-5', vars: ['x'], hint: '例: 2x-5' }).length, 1);
eq('hint leak text', check.hintLeak({ type: 'text', answer: ['house'], hint: '例: house' }).length, 1);
eq('hint leak ja', check.hintLeak({ type: 'text', answer: '現在完了', hint: '例: 現在完了' }).length, 1);
eq('hint ok other value', check.hintLeak({ type: 'num', answer: 6.25, hint: '例: 3/4 や 0.75' }).length, 0);
eq('hint ok counter', check.hintLeak({ type: 'num', answer: 3, hint: '小数第 3 位まで（例: 1.234）' }).length, 0);
eq('hint ok digits', check.hintLeak({ type: 'num', answer: 2, hint: '有効数字 2 桁で答える' }).length, 0);
eq('hint ok word', check.hintLeak({ type: 'text', answer: 'house', hint: '頭文字 h で始まる 1 語を半角英字で入力' }).length, 0);
eq('hint ok choice', check.hintLeak({ type: 'choice', choices: ['a', 'b'], answer: 1, hint: '例: 1' }).length, 0);
// 乱数演習の答えと解説の数値のずれ
eq('numbersIn', check.numbersIn('T = 36.75 \\fallingdotseq 36.8, \\; 3.68 \\times 10^{4}, -2.5').join('|'), '36.75|36.8|36800|2.5');
eq('roundGap hit', check.roundGap({ parts: [{ type: 'num', answer: 36.8 }], solution: [{ m: 'T = 36.7\\,\\mathrm{N}' }] }).join(','), '0');
eq('roundGap ok', check.roundGap({ parts: [{ type: 'num', answer: 36.8 }], solution: [{ m: 'T = 36.75 \\fallingdotseq 36.8' }] }).length, 0);
eq('roundGap far', check.roundGap({ parts: [{ type: 'num', answer: 36.8 }, { type: 'choice', choices: ['a', 'b'], answer: 0 }], solution: [{ n: '面積は 12.0' }] }).length, 0);
eq('hintFor hides', check.hintFor({ type: 'num', answer: 6.25, hint: '例: 25/4' }), '');
eq('hintFor keeps', check.hintFor({ type: 'num', answer: 6.25, hint: '例: 3/4' }), '例: 3/4');

// tex
const texCases = [
  String.raw`\frac{-b \pm \sqrt{b^{2}-4ac}}{2a}`,
  String.raw`\int_{0}^{1} x^{2}\,dx = \left[ \frac{x^{3}}{3} \right]_{0}^{1} = \frac{1}{3}`,
  String.raw`\sum_{k=1}^{n} k^{2} = \frac{n(n+1)(2n+1)}{6}`,
  String.raw`\lim_{x \to \infty} \left(1 + \frac{1}{x}\right)^{x} = e`,
  String.raw`\begin{aligned} y &= x^{2}-4x+1 \\ &= (x-2)^{2}-3 \end{aligned}`,
  String.raw`|x| = \begin{cases} x & (x \ge 0) \\ -x & (x < 0) \end{cases}`,
  String.raw`\vec{a} \cdot \vec{b} = |\vec{a}||\vec{b}|\cos\theta,\quad \overline{AB} = 3\,\mathrm{m/s^{2}}`,
  String.raw`\C{5}{2} = 10,\ \P{5}{2} = 20,\ 30\degree,\ \text{速さ } v_0 = 3.0 \times 10^{8}`,
  String.raw`\begin{pmatrix} 1 \\ 2 \end{pmatrix},\ f'(x) = \boxed{ア},\ \sqrt[3]{8} = 2,\ \log_{2} 8 = 3`,
  String.raw`a \leq b \neq c \Rightarrow \triangle ABC \sim \triangle DEF,\ \angle A = 90^{\circ}`
];
texCases.forEach((t, i) => eq('tex ok ' + i, JSON.stringify(JK.tex.check(t)), '[]'));
eq('tex unknown', JK.tex.check(String.raw`\foo{1}`).length > 0, true);
eq('tex unbalanced', JK.tex.check(String.raw`\frac{1}{2`).length > 0, true);
eq('rich', JK.richCheck(String.raw`値は $x^{2}$ で **重要**。価格は \$5 です。` + '\n\n次の段落 $$\\frac{1}{2}$$').length, 0);
eq('rich unbalanced', JK.richCheck('abc $x^2').length, 1);
eq('rich html', JK.rich('a < b **c**').includes('&lt;') && JK.rich('**c**').includes('<strong>c</strong>'), true);

// passage
eq('passage plain', JK.passage.plain('Most people spend {b1:about} a third {u2:of their lives}.'), 'Most people spend about a third of their lives.');
eq('passage marks', JK.passage.marks('{b1:a} {u2:b c}').length, 2);

// plot
const gsvg = JK.plot.graph({ x: [-3, 5], curves: [{ f: (x) => x * x - 4 * x + 1 }], points: [{ x: 2, y: -3, label: '頂点' }], fills: [{ f: (x) => x * x - 4 * x + 1, from: 0, to: 2 }], vlines: [{ x: 2, label: 'x=2' }] });
eq('graph svg', /^<svg[\s\S]*<\/svg>$/.test(gsvg) && !/NaN|undefined/.test(gsvg), true);
const g2 = JK.plot.graph({ x: [-4, 4], equal: true, param: [{ x: (t) => 3 * Math.cos(t), y: (t) => 2 * Math.sin(t), t: [0, 2 * Math.PI] }], curves: [{ f: (x) => 1 / x }] });
eq('graph svg2', !/NaN|undefined/.test(g2), true);
const d = JK.plot.draw(360, 220);
d.hatch(20, 200, 340, 200).line(40, 200, 300, 80).rect(150, 100, 40, 26, { fill: 'f1', rot: 25 }).arrow(170, 113, 170, 170, { label: 'mg' })
  .angle(40, 200, 30, 0, 25, 'θ').spring(20, 50, 120, 50).resistor(150, 30, 250, 30, { label: 'R₁' }).battery(260, 60, 260, 120, { label: 'E' })
  .capacitor(300, 60, 300, 120, { label: 'C' }).coil(40, 150, 120, 150, { label: 'L' }).acsource(320, 160, 12).meter(200, 60, 11, 'A')
  .wire([[10, 10], [50, 10], [50, 30]]).dot(50, 10).circle(100, 100, 20).poly([[0, 0], [10, 0], [5, 8]]).text(100, 20, 'm = 2.0 kg').path('M0 0 L10 10');
const dsvg = d.svg();
eq('draw svg', /^<svg[\s\S]*<\/svg>$/.test(dsvg) && !/NaN|undefined/.test(dsvg), true);

// steps / inputs
const html = JK.steps.render([{ t: 'a', m: 'x^{2}', n: 'n', easy: 'e', pro: 'p' }, { n: 'detail', lv: 3 }], 'easy');
eq('steps easy', html.includes('step-easy') && html.includes('detail'), true);
eq('steps pro', JK.steps.render([{ n: 'x', pro: 'p' }, { n: 'detail', lv: 2 }], 'pro').includes('detail'), false);
// 簡潔表示でも、答えを出しているステップは省かない
const covSteps = [{ n: '図で確かめる' }, { m: 'C = 44.3\\,\\mathrm{pF}', lv: 2 }, { m: 'V = 100\\,\\mathrm{V}', lv: 2 }, { n: '検算 44.3', lv: 3 }];
const covParts = [{ type: 'num', answer: 4.43e-11 }, { type: 'choice', choices: ['a', 'b'], answer: 0 }];
eq('steps pro cover', JK.steps.filter(covSteps, 'pro', covParts).length, 2);
eq('steps pro cover which', JK.steps.filter(covSteps, 'pro', covParts)[1].m, 'C = 44.3\\,\\mathrm{pF}');
eq('steps pro no parts', JK.steps.filter(covSteps, 'pro').length, 1);
eq('steps normal cover', JK.steps.filter(covSteps, 'normal', covParts).length, 3);
eq('steps cover explain', JK.steps.filter(covSteps, 'pro', [{ type: 'num', answer: 4.43e-11, explain: '$C = 4.43 \\times 10^{-11}$' }]).length, 1);
eq('hasValue prefix', check.hasValue('U = 111\\,\\mathrm{nJ}', 1.11e-7), true);
eq('hasValue wrap', check.hasValue('x = 9.998', 10), true);
eq('hasValue no', check.hasValue('Q = fd = 6.43\\,\\mathrm{J}', 12.9), false);
eq('hasValue frac', check.hasValue('S = \\frac{49}{12}', 49 / 12), true);
eq('hasValue sqrt', check.hasValue('d = \\frac{3\\sqrt{21}}{7}', 3 * Math.sqrt(21) / 7), true);
eq('hasValue pi', check.hasValue('V = 8\\pi - 16', 8 * Math.PI - 16), true);
eq('hasValue dfrac', check.hasValue('p = \\dfrac{12}{35}', 12 / 35), true);
eq('hasValue frac no', check.hasValue('S = \\frac{49}{12}', 49 / 13), false);
eq('exactValuesIn', check.exactValuesIn('x = \\frac{\\sqrt{6} - 2}{2},\\ y = 3').map((v) => v.toFixed(4)).join('|'), '0.2247');
eq('uncovered', check.uncovered({ parts: [{ type: 'num', answer: 12.9 }, { type: 'num', answer: 1.89 }], solution: [{ m: 'd = 1.89' }, { m: 'Q = 6.43', lv: 2 }] }).join(','), '0');
const pr = JK.inputs.parse([{ key: 'a', label: 'a', type: 'q', def: '1/2' }, { key: 'l', label: 'l', type: 'list', def: '1, 2 3' }, { key: 'f', label: 'f', type: 'poly', def: 'x^2-1' }], { a: '1/2', l: '1, 2 3', f: 'x^2-1' });
eq('inputs', pr.error === null && pr.values.a.toString() === '1/2' && pr.values.l.length === 3 && poly.deg(pr.values.f) === 2, true);
eq('inputs err', JK.inputs.parse([{ key: 'a', label: 'a', type: 'int', def: '1' }], { a: '1.5' }).error !== null, true);
eq('units', JK.unitList.length, 53);
eq('level', JK.levelOf(55) + JK.levelOf(49.9) + JK.levelOf(60), 'midbasicadv');

console.log('\npass ' + pass + ' / fail ' + fail);
process.exit(fail ? 1 : 0);
