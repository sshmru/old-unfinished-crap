import sys

if len(sys.argv) > 1:
    f = open(sys.argv[1], 'r')
    print(f.read()[0:200][::-1])
else:
    print("odpal na pliku, np. $python3 pyt3.py tekst.txt")
