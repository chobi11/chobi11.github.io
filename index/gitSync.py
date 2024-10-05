import requests
import json
from concurrent.futures import ThreadPoolExecutor, as_completed
import base64

from requests.auth import HTTPBasicAuth

# GitHub Personal Access Token
git_token = '' # Replace with your GitHub token
username = 'chobi11'
branch = "master"
repos = [
"a-1","a-2","a-3","a-4","a-5","b-1","b-10","b-11","b-12","b-13","b-14","b-15","b-16","b-17","b-18","b-19","b-2","b-20","b-21","b-22","b-23","b-24","b-25","b-26","b-27","b-28","b-29","b-3","b-30","b-31","b-32","b-33","b-34","b-35","b-36","b-37","b-38","b-39","b-4","b-40","b-41","b-42","b-43","b-44","b-45","b-46","b-47","b-48","b-49","b-5","b-6","b-7","b-8","b-9","c-1","c-10","c-11","c-12","c-13","c-14","c-15","c-16","c-17","c-18","c-19","c-2","c-20","c-21","c-22","c-23","c-24","c-25","c-26","c-27","c-28","c-29","c-3","c-30","c-31","c-32","c-33","c-34","c-35","c-36","c-37","c-38","c-39","c-4","c-40","c-41","c-42","c-43","c-44","c-45","c-46","c-47","c-48","c-49","c-5","c-50","c-51","c-52","c-53","c-54","c-55","c-56","c-57","c-58","c-59","c-6","c-60","c-61","c-62","c-63","c-64","c-65","c-66","c-67","c-68","c-69","c-7","c-70","c-71","c-72","c-73","c-74","c-75","c-76","c-77","c-78","c-79","c-8","c-80","c-81","c-9","d-1","d-2","d-3","d-4","d-5","d-s","d-w","f-1","f-2","f-3","f-4","r-1","r-10","r-11","r-12","r-13","r-14","r-15","r-16","r-17","r-18","r-19","r-2","r-20","r-21","r-22","r-23","r-24","r-25","r-26","r-27","r-28","r-29","r-3","r-30","r-31","r-32","r-33","r-34","r-35","r-36","r-37","r-38","r-39","r-4","r-40","r-5","r-6","r-7","r-8","r-9"
]
repository = "chobi11.github.io"

file_path = "dir.js"
print("No. of repos: ", len(repos))
arrayf = []
arrayd = []
count_files = 0
def update_git_file(file_path, new_content_base64,git_token):
    # Fetch the current content and details of the file
    url = f'https://api.github.com/repos/{username}/{repository}/contents/{file_path}'
    response = requests.get(url, auth=HTTPBasicAuth(username, git_token))

    if response.status_code == 200:
        file_data = response.json()

        # Update the file on GitHub with the new base64 content
        update_url = f'https://api.github.com/repos/{username}/{repository}/contents/{file_path}'
        update_payload = {
            'message': 'Update file',
            'content': new_content_base64,
            'sha': file_data['sha'],
        }

        update_response = requests.put(update_url, auth=HTTPBasicAuth(username, git_token), json=update_payload)

        if update_response.status_code == 200:
            print(f'File updated: {file_path}')
        else:
            print(f'Error updating file: {update_response.text}')
    else:
        print(f'Error fetching file details: {response.text}')


# Create a global session for reusing connections
session = requests.Session()
session.headers.update({'Authorization': f'Bearer {git_token}'})

# Dictionary to hold the repo data as {repo_name: response_data}
maindata = {}

# Function to fetch data for a single repository
def fetch_repo_data(repo):
    try:
        url = f'https://api.github.com/repos/{username}/{repo}/git/trees/{branch}?recursive=1'
        response = session.get(url).json()
        return repo, response  # Return repo name and fetched data as a tuple
    except Exception as e:
        print(f"Error fetching repository {repo}: {e}")
        return repo, None

# Using ThreadPoolExecutor for parallel fetching
max_workers = min(20, len(repos))  # Adjust `max_workers` based on your requirements
with ThreadPoolExecutor(max_workers=max_workers) as executor:
    # Submit fetch tasks for each repository and collect the futures
    futures = {executor.submit(fetch_repo_data, repo): repo for repo in repos}

    # Process each future as it completes
    for future in as_completed(futures):
        repo, result = future.result()  # Get the repo name and result from the future
        if result and 'tree' in result:
            maindata[repo] = result['tree']
            count_files += len(result['tree'])
        else:
            maindata[repo] = []  # If no data, store an empty list to maintain order

# Sort maindata based on the order of `repos` list
sorted_data = {repo: maindata[repo] for repo in repos if repo in maindata}

# Process sorted data and populate arrayf and arrayd based on repo name
for repo, data in sorted_data.items():
    print(f"{repo}, {len(data)}")  # Print the repo and the count of files fetched
    if repo.startswith("a") or repo.startswith("b") or repo.startswith("d"):
        for file in data:
            arrayd.append(repo + '/' + file['path'].replace('.jpg', ''))
    else:
        for file in data:
            arrayf.append(repo + '/' + file['path'].replace('.jpg', ''))

# Constructing JavaScript export string
export = f'let DATAf = {json.dumps(arrayf)};\n'
export += f'let DATAd = {json.dumps(arrayd)};\n'
export += 'DATAf = DATAf.map(item => { let parts = item.split("/"); return `https://raw.githubusercontent.com/chobi11/${parts[0]}/master/${parts[1]}.jpg`; });\n'
export += 'DATAd = DATAd.map(item => { let parts = item.split("/"); return `https://raw.githubusercontent.com/chobi11/${parts[0]}/master/${parts[1]}.jpg`; });\n'
export += 'let DATA = DATAd.concat(DATAf);\n'

new_content_base64 = base64.b64encode(export.encode()).decode()
update_git_file(file_path, new_content_base64,git_token)
# Save export as dir2.js
with open("dir2.js", 'w') as file:
    file.write(export)

print(f"Text successfully saved to dir2.js with {count_files} files processed.")
