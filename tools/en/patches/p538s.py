import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# I still think about my stay with you → あなたのところでの滞在について考える（stay + with + 人は名詞につける。「あなたと一緒に…考える」にしない）
rep("""      // a reminder of how translation works / a sense of where they are（of + 疑問詞節 → 〜かの）
      // a town three hours away → 3時間離れた町""",
    """      if (isW(t, 'with') && /^(?:stay|stays|homestay|homestays)$/.test(node.head || '') && !node.pron && j + 1 < lim && !o.noPost) {
        const mSw = mark();
        const nSw = np(j + 1, lim, { noRel: true });
        if (nSw && !nSw.clause && (nSw.an || (nSw.pron && PRON[nSw.pron] && PRON[nSw.pron].an) || /(?:^| )(?:family|families)$/.test(nSw.head || ''))) { node = Object.assign({}, node, { ja: nSw.ja + 'のところでの' + node.ja, end: nSw.end }); continue; }
        fail(mSw);
      }
      // a reminder of how translation works / a sense of where they are（of + 疑問詞節 → 〜かの）
      // a town three hours away → 3時間離れた町""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
