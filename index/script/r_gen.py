import json
import os
fileName="2024-02-08.txt"
date = "date > datetime(2024, 2, 8, 23, 59, 59, 999999) and "
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
    if i != 0 and i % 10 == 0:
        folder_name = str(k)
        if not os.path.exists(folder_name):
            os.makedirs(folder_name)
        print(f"{k}.bat")
        save(f"{k}.bat", f'cd {k} & gallery-dl --filter "{date}extension not in (\'mp4\', \'gif\')" {str_var}')
        str_var = ""
        k += 1
folder_name = str(k)
if not os.path.exists(folder_name):
    os.makedirs(folder_name)
# Save remaining items in str_var
save(f"{k}.bat", f'cd {k} & gallery-dl --filter "{date}extension not in (\'mp4\', \'gif\')" {str_var}')