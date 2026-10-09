import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = "      if (nAg && nAg.end === lim - 1 && (nAg.dur ||"
new = "      if (nAg && nAg.end === lim - 1 && /^(?:長い時間|長い間|ずいぶん長い時間)$/.test(nAg.ja || '')) return fin(P('ずっと前のことだ', 'da'), lim);   // That was a long time ago → ずっと前のことだった\n" + old
assert s.count(old) == 1
s = s.replace(old, new)
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
