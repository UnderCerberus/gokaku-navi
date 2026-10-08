import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = """        const r2 = c1 && gap.used && c1.subj ? predOnly(x + 1, lim, { subj: c1.subj }) : null;
        if (c1 && r2) { name('relative-what');"""
assert s.count(old) == 1
s = s.replace(old, """        // 2 つ目の述語も what の空所を共有するときだけ（what I needed and went home の went home は外の文の述語）
        const gap2 = { type: 'np', rel: true, used: false };
        const r2 = c1 && gap.used && c1.subj ? predOnly(x + 1, lim, { subj: c1.subj, gap: gap2 }) : null;
        if (c1 && r2 && gap2.used) { name('relative-what');""")
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
