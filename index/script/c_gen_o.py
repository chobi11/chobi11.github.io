import json
import os
fileName="oo.txt"
#date = ""
# Read 'on' variable from file.json
with open(fileName, 'r') as file:
    content=file.read()
    data = json.loads(content.replace("\'", ""))
    on = data
    print(len(on))

def save(filename, content):
    with open(filename, 'w') as file:
        file.write(content)

for i in range(len(on)):
    year = on[i]["t"].split("-")[0]
    month = on[i]["t"].split("-")[1].lstrip("0")
    day = on[i]["t"].split("-")[2].lstrip("0")
    k=on[i]["n"]+"_"+str(i)
    date = f"date > datetime({year}, {month}, {day}, 23, 59, 59, 999999) and "
    save(f"{k}.bat", f'gallery-dl --filter "{date}extension not in (\'mp4\', \'gif\', \'m4v\', \'mp3\')" {on[i]["l"]}')
    print(f"{k}.bat")
