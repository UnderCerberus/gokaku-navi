import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# have lunch in the park instead of staying inside → 中にいる代わりに公園で昼食を食べる（instead of / rather than の句は場所の句より前へ）
rep("""        else if (pp.kind === 'time') st.time.push(pp.ja);
        else if (pp.ja) st.other.push(pp.ja);
        return pp.end;""",
    """        else if (pp.kind === 'time') st.time.push(pp.ja);
        else if (pp.ja && /(?:の代わりに|代わりに|のではなく|ではなく)$/.test(pp.ja) && /^(?:instead of|rather than)$/.test(pp.prep || '')) st.other.unshift(pp.ja);
        else if (pp.ja) st.other.push(pp.ja);
        return pp.end;""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
