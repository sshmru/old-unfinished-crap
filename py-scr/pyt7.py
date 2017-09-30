def nuf(b):
    tmp = 3
    def fun(a):
        print(a+b+tmp)
    return fun


x = nuf(3)
x(2)
x(3)
x = nuf(1)
x(2)
x(3)


a = 5
def fuf():
    print(a)
    print(b)

b = 5
fuf()
