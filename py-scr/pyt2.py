from PIL import Image
import sys

if len(sys.argv) > 1:
    imgname = sys.argv[1]
    img = Image.open(imgname)
    width = 300
    height = 300
    thb = img.resize((width, height), Image.LINEAR)
    thb.save("THUMBNAIL"+imgname)
else:
    print("odpal na obrazku, np. $python3 pyt2.py obraz.jpg")
