# GitHub username and base URL
$username = "chobi11"
$token = ""

# Array of folder paths
$folders = @(
"c\135",
"c\136",
"c\137",
"c\138",
"c\139",
"c\140",
"c\141",
"c\142",
"c\143",
"c\144",
"c\145",
"c\146",
"c\147",
"c\148",
"c\149",
"c\150",
"c\151",
"c\152",
"c\153",
"c\154",
"c\155",
"c\156",
"c\157",
"c\158",
"c\159",
"c\160",
"c\161",
"c\162",
"c\163",
"c\164",
"c\165",
"c\166",
"c\167",
"c\168",
"c\169",
"c\170",
"c\171",
"c\172",
"c\173",
"c\174",
"c\175",
"c\176",
"c\177",
"c\178",
"c\179",
"c\180",
"c\181",
"c\182",
"c\183",
"c\184",
"c\185",
"c\186",
"c\187",
"c\188",
"c\189",
"c\190",
"c\191",
"c\192",
"c\193",
"c\194",
"c\195",
"c\196",
"c\197",
"c\198",
"c\199",
"c\200",
"c\201",
"c\202",
"c\203",
"c\204",
"c\205",
"c\206",

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
