import json
import os
fileName="../extra/cn.txt"
#date = "date > datetime(2024, 2, 8, 23, 59, 59, 999999) and "
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


str_var = ""
k = 1
for i in range(len(on)):
    str_var += " " + on[i]
    #print(i)
    if i != 0 and i % 1 == 0:  
        print(f"{k}.bat")
        save(f"{k}.bat", f'gallery-dl --filter "extension not in (\'mp4\', \'gif\', \'m4v\', \'mp3\')" {str_var}')
        str_var = ""
        k += 1

# Save remaining items in str_var
save(f"{k}.bat", f'gallery-dl --filter "extension not in (\'mp4\', \'gif\', \'m4v\', \'mp3\')" {str_var}')