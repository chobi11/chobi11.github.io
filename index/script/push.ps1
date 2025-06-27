# GitHub username and base URL
$username = "chobi11"
$token = ""

# Array of folder paths
$folders = @(
"c\119",
"c\120",
"c\121",
"c\122",
"c\123",
"c\124",
"c\125",
"c\126",
"c\127",
"c\128",
"c\129",
"c\130",
"c\131",
"c\132",
"c\133",
"c\134"
)

$currentFolder = Get-Location -PSProvider FileSystem | Select-Object -ExpandProperty ProviderPath

# Loop through each folder
foreach ($folder in $folders) {
    # Extract repository name from folder structure
    $repoName = ($folder -replace '\\', '-')
    # Navigate to folder
    Set-Location $folder    
    # Initialize Git repository
    git init
    #master checkout
    git checkout -b master
    # Set local Git configuration (optional)
    git config user.name "chobi11"
    git config user.email "showravsbr5@gmail.com"
    # Check if repository already exists on GitHub
    $repoExists = $false
    try {
        $response = Invoke-RestMethod -Uri "https://api.github.com/repos/$username/$repoName" -Headers @{
            Authorization = "token $token"
            Accept        = "application/vnd.github.v3+json"
        } -Method Get -ErrorAction Stop

        $repoExists = $true
    }
    catch {
        Write-Host "Repository '$repoName' does not exist on GitHub."
    }

    if (-not $repoExists) {
        # Create GitHub repository using API if it doesn't exist
        $body = @{
            name = $repoName
        } | ConvertTo-Json

        try {
            Invoke-RestMethod -Uri "https://api.github.com/user/repos" -Headers @{
                Authorization = "token $token"
                Accept        = "application/vnd.github.v3+json"
            } -Method Post -Body $body -ErrorAction Stop

            Write-Host "Created repository '$repoName' on GitHub."
        }
        catch {
            Write-Host "Failed to create repository '$repoName' on GitHub: $_"
            continue  # Skip to the next iteration if repository creation fails
        }
    }
    # Add remote origin with token authentication if not set
    $remoteOrigin = git remote get-url origin
    if (-not $remoteOrigin -or $remoteOrigin -notlike "https://$token@github.com/$username/$repoName.git") {
        git remote add origin "https://$token@github.com/$username/$repoName.git"
    }
    
    # Add all files
    git add .
    # Commit changes
    git commit -m "upload"
    # Push changes to GitHub
    git push -u origin master
    # Move back to parent directory
    Set-Location $currentFolder
}
