import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = "if (v1tb && v2tb && verbal(v1tb.pred) && verbal(v2tb.pred)) { name('not-but'); st.other.push("
new = "if (v1tb && v2tb && verbal(v1tb.pred) && verbal(v2tb.pred)) { name('not-but'); if (kTtb > j || isW(T[j - 1], 'not') || kTtb === j) { vg.neg = false; st.neg = false; } st.other.push("
assert s.count(old) == 1
s = s.replace(old, new)
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
