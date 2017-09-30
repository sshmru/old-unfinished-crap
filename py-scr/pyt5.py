import re

nrs = ['1a23', '1234', 'asd2', '2566', '24677']
regexp = re.compile("\d{4}$")


def check(rx, tab):
    for a in tab:
        if rx.match(a):
            print(a)


check(regexp, nrs)
regexp2 = re.compile(input('wpisz wyrazenie regularne:   '))
check(regexp2, nrs)
