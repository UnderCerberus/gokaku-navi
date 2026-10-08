import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# in the same way that humans do → in the same way as humans（人間と同じように）
rep(r"""      .replace(/\b([Nn]o|[Nn]ot) (more|less) than (?=""",
    r"""      .replace(/\bin the same way (?:that|as) (humans|people|we|they|adults|children|animals|men|women|he|she|I|you|[A-Z][a-z]+) (?:do|does|did)\b/g, 'in the same way as $1')   // in the same way that humans do → 人間と同じように
      .replace(/\b([Nn]o|[Nn]ot) (more|less) than (?=""")

# For instance, elephants have been observed … （文頭のつなぎ言葉があっても主語の は → が）
rep("""          if (rOb && rOb.ok && /ていた。$/.test(rOb.ja) && /^[^、。]+?は/.test(rOb.ja)) {""",
    """          if (rOb && rOb.ok && /ていた。$/.test(rOb.ja) && /^(?:[^、。]*、)?[^、。]+?は/.test(rOb.ja)) {""")
rep("""            const jaOb = rOb.ja.replace(/^([^、。]+?)は/, '$1が')""",
    """            const jaOb = rOb.ja.replace(/^((?:[^、。]*、)?[^、。]+?)は/, '$1が')""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
