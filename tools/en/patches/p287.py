import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# An hour passed → 1時間が過ぎた
rep("""    if (L === 'store' && !objs.length && !vg.passive && (!o.subj || o.subj.pron === 'you')) sense = { particle: '', core: '保管する', tr: false };""",
    """    if (L === 'store' && !objs.length && !vg.passive && (!o.subj || o.subj.pron === 'you')) sense = { particle: '', core: '保管する', tr: false };
    if (L === 'pass' && !objs.length && !vg.passive && o.subj && !o.subj.an && (o.subj.dur || /^(?:time|year|years|day|days|month|months|week|weeks|hour|hours|minute|minutes|decade|decades|century|centuries|season|seasons)$/.test(plainSubj(o.subj).head || ''))) sense = { particle: '', core: '過ぎる', tr: false };   // An hour passed → 1時間が過ぎた / Ten years have passed since then → それ以来10年が過ぎた""")

# He was ten minutes late → 彼は10分遅刻した / It's hard on the outside and soft on the inside
rep("""    // She was so kind as to help me → 親切にも私を手伝ってくれた""",
    """    // He was ten minutes late → 彼は10分遅刻した / The train is five minutes late → 電車は5分遅れている
    if (vg.lemma === 'be' && !vg.passive && !vg.neg && i + 1 < lim) {
      let xLt = -1;
      for (let x = i + 1; x < Math.min(lim, i + 5); x++) if (isW(T[x], 'late') || isW(T[x], 'early')) { xLt = x; break; }
      if (xLt > i && !(T[i].k === 'w' && /^(?:so|too|very|a|quite|rather|pretty)$/.test(T[i].w) && xLt === i + 1)) {
        const mLt = mark();
        const nLt = np(i, xLt, {});
        if (nLt && nLt.end === xLt && (nLt.dur || (nLt.num && /^(?:minute|minutes|hour|hours|second|seconds|day|days|week|weeks)$/.test(nLt.head || ''))) && !nLt.pron) {
          const durLt = nLt.ja.replace(/間$/, '');
          let preLt = '', eLt = xLt + 1;
          if (eLt + 1 < lim && /^(?:for|to)$/.test(T[eLt].w || '')) { const nFor = np(eLt + 1, lim, {}); if (nFor && nFor.end === lim) { preLt = nFor.ja + 'に'; eLt = lim; } }
          if (eLt === lim) {
            const earlyLt = isW(T[xLt], 'early');
            const coreLt = earlyLt ? (vg.past || vg.modal ? P(durLt + '早く着く', 'v5') : P(durLt + '早く着いている', 'v1'))
              : (anim && !vg.modal ? (vg.past ? P(durLt + '遅刻する', 'suru') : P(durLt + '遅刻している', 'v1')) : (vg.past || vg.modal ? P(durLt + '遅れる', 'v1') : P(durLt + '遅れている', 'v1')));
            name('be-late');
            return fin(coreLt, lim, 'SV', preLt ? [preLt] : []);
          }
        }
        fail(mLt);
      }
    }
    // It's hard on the outside and soft on the inside → それは外側が硬くて、内側が柔らかい
    if (vg.lemma === 'be' && !vg.passive && T[i] && T[i].k === 'w' && adjC(T[i]) && seq(i + 1, ['on', 'the']) && T[i + 3] && /^(?:outside|inside)$/.test(T[i + 3].w || '') && T[i + 4] && /^(?:and|but)$/.test(T[i + 4].w || '') && T[i + 5] && T[i + 5].k === 'w' && adjC(T[i + 5])) {
      const a1O = adjC(T[i]), a2O = adjC(T[i + 5]);
      let eO = i + 6;
      if (seq(eO, ['on', 'the']) && T[eO + 2] && /^(?:outside|inside)$/.test(T[eO + 2].w || '')) eO += 3;
      else if (T[eO] && /^(?:inside|outside)$/.test(T[eO].w || '')) eO += 1;
      if (eO === lim && a1O.e && a2O.e) {
        const SOFTJ = { hard: '硬い', soft: '柔らかい', tough: '硬い', crispy: 'カリカリの', crisp: 'カリッとした', warm: '温かい', cold: '冷たい', sweet: '甘い', soft2: '柔らかい' };
        const f1O = en.jp.adj(SOFTJ[a1O.lemma] || a1O.e.ja), f2O = en.jp.adj(SOFTJ[a2O.lemma] || a2O.e.ja);
        const w1O = T[i + 3].w === 'outside' ? '外側' : '内側', w2O = w1O === '外側' ? '内側' : '外側';
        pick(i, a1O.e); pick(i + 5, a2O.e);
        name('svc');
        return fin(f2O.pred, lim, 'SVC', [w1O + 'が' + (T[i + 4].w === 'but' ? f1O.pred.plain() + 'が、' : f1O.te + '、') + w2O + 'が']);
      }
    }
    // She was so kind as to help me → 親切にも私を手伝ってくれた""")

# Have your tickets ready → チケットを用意しておいてください
rep("""    if (SVOCV[L] && !T.slice(i, j).some((x) => isW(x, 'with')) && !(tj && tj.k === 'w' && /^(?:later|soon|again|back|tonight|tomorrow|today|now|early|late|often|first)$/.test(tj.w) && /^(?:call|get|find|leave|make|turn)$/.test(L))) {""",
    """    if (/^(?:have|get|keep)$/.test(L) && isW(tj, 'ready') && !ob.an && !vg.passive && (j + 1 === lim || isP(T[j + 1], ',') || isW(T[j + 1], 'for') || isW(T[j + 1], 'before'))) {   // Please have your tickets ready → チケットを用意しておいてください
      pick(j, adjC(T[j]) ? adjC(T[j]).e : null);
      name('svoc');
      return done(vg, P('用意しておく', 'v5'), st, j + 1 < lim ? tail(j + 1, lim, st, o, vg) : j + 1, 'SVOC', o, [objStr(ob, 'を', st).replace(/^(?:あなたの|あなたたちの|自分の)/, '')], { noStative: true });
    }
    if (L === 'leave' && isW(tj, 'unattended') && !vg.passive) {   // Don't leave your bags unattended → かばんを放置しないでください
      name('svoc');
      return done(vg, P('放置する', 'suru'), st, j + 1 < lim ? tail(j + 1, lim, st, o, vg) : j + 1, 'SVOC', o, [objStr(ob, 'を', st).replace(/^(?:あなたの|自分の)/, '')], { noStative: true });
    }
    if (SVOCV[L] && !T.slice(i, j).some((x) => isW(x, 'with')) && !(tj && tj.k === 'w' && /^(?:later|soon|again|back|tonight|tomorrow|today|now|early|late|often|first)$/.test(tj.w) && /^(?:call|get|find|leave|make|turn)$/.test(L))) {""")

rep("""'wet paint': 'ペンキ塗りたて', """,
    """'wet paint': 'ペンキ塗りたて', 'attention please': 'お知らせいたします', 'may i have your attention please': 'お知らせいたします', 'may i have your attention': 'お知らせいたします', 'we apologize for the delay': '遅れて申し訳ありません', 'i apologize for the delay': '遅れて申し訳ありません', 'sorry for the delay': '遅れてすみません', 'sorry for the wait': 'お待たせしました', 'sorry to keep you waiting': 'お待たせしてすみません', 'i am sorry to have kept you waiting': 'お待たせしてすみません', 'thank you for waiting': 'お待たせしました', 'we are now boarding': 'ただいま搭乗を開始しております', 'mind your step': '足元にご注意ください', """)

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
