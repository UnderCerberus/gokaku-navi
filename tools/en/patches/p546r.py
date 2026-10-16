import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# I was chosen to run the last leg → 最後の区間を走る役に選ばれた / He was selected to represent Japan → 日本を代表する役に選ばれた
# （受け身の choose / select / elect / pick / appoint + to do は「〜する役に選ばれる」。「〜するために選ばれた」にしない）
rep("""      permit: ['ことを', '許す', 'v5'], instruct: ['ように', '指示する', 'suru'], train: ['ように', '訓練する', 'suru'], enable: ['ことを', '可能にする', 'suru'] };""",
    """      permit: ['ことを', '許す', 'v5'], instruct: ['ように', '指示する', 'suru'], train: ['ように', '訓練する', 'suru'], enable: ['ことを', '可能にする', 'suru'],
      choose: ['役に', '選ぶ', 'v5'], select: ['役に', '選ぶ', 'v5'], pick: ['役に', '選ぶ', 'v5'], elect: ['役に', '選ぶ', 'v5'], appoint: ['役に', '任命する', 'suru'] };""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
