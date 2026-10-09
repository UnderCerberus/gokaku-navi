import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

# 記録（適用済み）: 受け身の do（More needs to be done / Unless more is done）
# - 不定詞・従属節・疑問では「行われる」（need の枠は「される → する」に直すので なされる は使えない）
# - p507b の !vg.nonfin 条件は外した
old1 = "/^(?:more|something|much|this|that|it|everything|anything)$/.test(o.subj.pron || '') && !vg.nonfin) {"
new1 = "/^(?:more|something|much|this|that|it|everything|anything)$/.test(o.subj.pron || '')) {"
old2 = "      if (o.sub || o.q) return done(vg, P('なす', 'v5'), st, j, 'SV', o, [], { noStative: true });"
new2 = "      if (o.sub || o.q || vg.nonfin) return done(Object.assign({}, vg, { passive: false }), P('行われる', 'v1'), st, j, 'SV', o, [], { noStative: true });"
for a, b in ((old1, new1), (old2, new2)):
    if s.count(a) == 1:
        s = s.replace(a, b)
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
