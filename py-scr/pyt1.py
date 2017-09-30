import urllib.request
import os
filename = "omgokienka.jpg"
url = "http://www.europeanvoice.com/GED/00000000/5600/5653.jpg"
if not os.path.exists(filename):
    urllib.request.urlretrieve(url, filename)
else:
    print('plik istnieje')
os.system("xdg-open " + filename)
