import requests
import json
from concurrent.futures import ThreadPoolExecutor, as_completed
import base64

from requests.auth import HTTPBasicAuth

# GitHub Personal Access Token
git_token = '' # Replace with your GitHub token
username = 'chobi11'
branch = "master"

repository = "chobi11.github.io"


def get_repo_names(username):
    repos = []
    page = 1
    while True:
        url = f'https://api.github.com/users/{username}/repos?per_page=100&page={page}'
        response = requests.get(url)
        data = response.json()

        if not data:
            break

        for repo in data:
            repo_name = repo['name']
            if repo_name != 'chobi11.github.io':  # Exclude "chobi11.github.io"
                repos.append(repo_name)

        page += 1

    return repos

repos = get_repo_names(username)
#print(repo_names)

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
print(f"Total files: {len(arrayf) + len(arrayd)}")
# Constructing JavaScript export string
export = f'let DATAf = {json.dumps(arrayf)};\n'
export += f'let DATAd = {json.dumps(arrayd)};\n'
export += 'DATAf = DATAf.map(item => { let parts = item.split("/"); return `https://raw.githubusercontent.com/chobi11/${parts[0]}/master/${parts[1]}.jpg`; });\n'
export += 'DATAd = DATAd.map(item => { let parts = item.split("/"); return `https://raw.githubusercontent.com/chobi11/${parts[0]}/master/${parts[1]}.jpg`; });\n'
export += 'let DATA = DATAd.concat(DATAf);\n'

new_content_base64 = base64.b64encode(export.encode()).decode()
#update_git_file(file_path, new_content_base64,git_token)
# Save export as dir2.js
with open("dir2.js", 'w') as file:
    file.write(export)

print(f"Text successfully saved to dir2.js with {count_files} files processed.")
