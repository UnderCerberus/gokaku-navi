import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# can be harvested as often as twenty times a year → 年に20回も収穫できる（as often as + 回数は「〜も」。「年に20回と同じくらいよく」にしない）
rep("""        if (isW(T[ja0 + 3], 'possible')) { st.manner.push(pre0 + 'できるだけ' + a0.ja); return ja0 + 4; }
        const el0 = thanEllipsis(ja0 + 3, lim, o && o.subj);""",
    """        if (isW(T[ja0 + 3], 'possible')) { st.manner.push(pre0 + 'できるだけ' + a0.ja); return ja0 + 4; }
        if (isW(T[ja0 + 1], 'often') && !pre0 && T[ja0 + 3] && (T[ja0 + 3].k === 'num' || /^(?:once|twice|two|three|four|five|six|seven|eight|nine|ten|twelve|fifteen|twenty|thirty|fifty|a|several)$/.test(T[ja0 + 3].w || ''))) {
          let eOf = ja0 + 3;
          while (eOf < lim && T[eOf].k !== 'p') eOf++;
          const mOf = mark();
          const stOf = newSt(vg);
          const eOf2 = tail(ja0 + 3, eOf, stOf, o, vg);
          const gOf = stOf.time.concat(stOf.freq || [], stOf.other, stOf.manner).join('');
          if (eOf2 === eOf && /回$/.test(gOf)) { name('as-as'); st.other.push(gOf + 'も'); return eOf; }
          fail(mOf);
        }
        const el0 = thanEllipsis(ja0 + 3, lim, o && o.subj);""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
