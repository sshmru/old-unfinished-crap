def fun(c= 3, a= 1):
    '''
    dokumentacja funkcji fun
    '''
    return(a+(2*c))

print fun.__doc__
print(fun())
print(fun(c=2, a=1))
print(fun(a=2, c=1))
