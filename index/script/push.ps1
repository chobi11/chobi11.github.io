# GitHub username and base URL
$username = "chobi11"
$token = ""

# Array of folder paths
$folders = @(
#     "a\1",
#   "a\2",
#   "a\3",
#   "a\4",
#   "a\5",
#   "b\1",
#   "b\10",
#   "b\11",
#   "b\12",
#   "b\13",
#   "b\14",
#   "b\15",
#   "b\16",
#   "b\17",
#   "b\18",
#   "b\19",
#   "b\2",
#   "b\20",
#   "b\21",
#   "b\22",
#   "b\23",
#   "b\24",
#   "b\25",
#   "b\26",
#   "b\27",
#   "b\28",
#   "b\29",
#   "b\3",
#   "b\30",
#   "b\31",
#   "b\32",
#   "b\33",
#   "b\34",
#   "b\35",
#   "b\36",
#   "b\37",
#   "b\38",
#   "b\39",
#   "b\4",
#   "b\40",
#   "b\41",
#   "b\42",
#   "b\43",
#   "b\44",
#   "b\45",
#   "b\46",
#   "b\47",
#   "b\48",
#   "b\49",
#   "b\5",
#   "b\6",
#   "b\7",
#   "b\8",
#   "b\9",
#   "c\1",
#   "c\10",
#   "c\11",
#   "c\12",
#   "c\13",
#   "c\14",
#   "c\15",
#   "c\16",
#   "c\17",
#   "c\18",
#   "c\19",
#   "c\2",
#   "c\20",
#   "c\21",
#   "c\22",
#   "c\23",
#   "c\24",
#   "c\25",
#   "c\26",
#   "c\27",
#   "c\28",
#   "c\29",
#   "c\3",
#   "c\30",
#   "c\31",
#   "c\32",
#   "c\33",
#   "c\34",
#   "c\35",
#   "c\36",
#   "c\37",
#   "c\38",
#   "c\39",
#   "c\4",
#   "c\40",
#   "c\41",
#   "c\42",
#   "c\43",
#   "c\44",
#   "c\45",
#   "c\46",
#   "c\47",
#   "c\48",
#   "c\49",
#   "c\5",
#   "c\50",
#   "c\51",
#   "c\52",
#   "c\53",
#   "c\54",
#   "c\55",
#   "c\56",
#   "c\57",
#   "c\58",
#   "c\59",
#   "c\6",
#   "c\60",
#   "c\61",
#   "c\62",
#   "c\63",
#   "c\64",
#   "c\65",
#   "c\66",
#   "c\67",
#   "c\68",
#   "c\69",
#   "c\7",
#   "c\70",
#   "c\71",
#   "c\72",
#   "c\73",
#   "c\74",
#   "c\75",
#   "c\8",
#   "c\9",
#   "d\1",
#   "d\2",
#   "d\3",
#   "d\4",
#   "d\5",
#   "d\s",
#   "d\w",
#   "f\1",
#   "f\2",
#   "f\3",
#   "f\4",
#   "r\1",
#   "r\10",
#   "r\11",
#   "r\12",
#   "r\13",
#   "r\14",
#   "r\15",
#   "r\16",
#   "r\17",
#   "r\18",
#   "r\19",
#   "r\2",
#   "r\20",
#   "r\21",
#   "r\22",
#   "r\23",
#   "r\24",
#   "r\25",
#   "r\26",
#   "r\27",
#   "r\28",
#   "r\29",
#   "r\3",
#   "r\30",
#   "r\31",
#   "r\32",
#   "r\33",
#   "r\34",
#   "r\35",
#   "r\36",
#   "r\37",
#   "r\38",
#   "r\39",
#   "r\4",
#   "r\40",
#   "r\5",
#   "r\6",
#   "r\7",
#   "r\8",
#   "r\9"
"c\76",
"c\77",
"c\78",
"c\79",
"c\80",
"c\81"
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
