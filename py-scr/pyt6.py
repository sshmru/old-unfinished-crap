json = {
    1: "asd",
    "a": "AAaA",
    "c": [1, 2, 3],
    "i": {
        "a": 1,
        "i": {
            "a":1
        }
    }
}

def i(x):
    print(x)

json["a"] = i
print(json)
print(json["a"](json[1]))

