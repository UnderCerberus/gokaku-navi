import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# make a video with messages from everyone in our class / a card with a message → みんなからの伝言の入ったビデオ（入れ物・媒体の名詞 + with + 中身の名詞。手段の「で」にしない）
rep("""      if (isW(t, 'for') && !node.pron && node.head && !/^(?:trip|trips|stay|visit|vacation|holiday|holidays|break|delay|journey|course|period|program|programme|contract|ban|leave|absence|sentence|war|drought|walk|run|flight|ride|drive|class|lesson|lessons|meeting|session|shift|plan|plans|record|job|work|treatment|training|rest|silence|wait|warranty|guarantee|subscription|membership|rental|loan|lea""",
    """      if (isW(t, 'with') && node.head && /^(?:video|videos|card|cards|letter|letters|album|albums|email|emails|package|packages|parcel|parcels|envelope|envelopes|poster|posters|book|books|notebook|notebooks|file|files|message|messages)$/.test(node.head) && !node.pron && j + 1 < lim && !o.noPost) {
        const mWv = mark();
        const nWv = np(j + 1, lim, { noRel: true, noCoord: o.noCoord, pp: true });
        if (nWv && /^(?:message|messages|note|notes|photo|photos|picture|pictures|comment|comments|greeting|greetings|letter|letters|drawing|drawings|information|wish|wishes|signature|signatures|story|stories|song|songs|video|videos)$/.test(nWv.head || '')) { node = Object.assign({}, node, { ja: nWv.ja + 'の入った' + node.ja, end: nWv.end }); continue; }
        fail(mWv);
      }
      if (isW(t, 'for') && !node.pron && node.head && !/^(?:trip|trips|stay|visit|vacation|holiday|holidays|break|delay|journey|course|period|program|programme|contract|ban|leave|absence|sentence|war|drought|walk|run|flight|ride|drive|class|lesson|lessons|meeting|session|shift|plan|plans|record|job|work|treatment|training|rest|silence|wait|warranty|guarantee|subscription|membership|rental|loan|lea""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
