import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# He gave the students books → 学生に本を与えた（1 つ目が人の名詞 + 授与動詞なら、節末の「3 単現 = 複数名詞」も 2 つ目の目的語）
rep("""&& !(objs[0].pron && /^(?:me|him|her|us|them|you)$/.test(objs[0].pron) && /^(?:give|send|buy|bring|show|offer|hand|lend|pay|sell|teach|tell|get|make|cook|leave|throw|pass|wish|owe|promise)$/.test(vg.lemma))) { fail(m1); break; }""",
    """&& !(((objs[0].pron && /^(?:me|him|her|us|them|you)$/.test(objs[0].pron)) || (objs[0].an && !objs[0].pron)) && /^(?:give|send|buy|bring|show|offer|hand|lend|pay|sell|teach|tell|get|make|cook|leave|throw|pass|wish|owe|promise)$/.test(vg.lemma))) { fail(m1); break; }""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
