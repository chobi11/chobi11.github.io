# runner.ps1
$maxConcurrent = 20

# Folder where this script is located
$folder = Split-Path -Parent $MyInvocation.MyCommand.Path
$doneFolder = Join-Path $folder "done"

# Create "done" folder if it doesn't exist
if (-not (Test-Path $doneFolder)) {
    New-Item -ItemType Directory -Path $doneFolder | Out-Null
}

# Get all .bat files in the folder (excluding "done" folder)
$files = Get-ChildItem -Path $folder -Filter *.bat | Where-Object { $_.DirectoryName -ne $doneFolder } | Select-Object -ExpandProperty FullName

# Function: check internet availability (pings Google DNS)
function Test-Internet {
    try {
        Test-Connection -ComputerName 8.8.8.8 -Count 1 -Quiet -ErrorAction Stop
    } catch {
        $false
    }
}

# Active jobs (processes + file mapping)
$jobs = @()

foreach ($file in $files) {
    # Wait until we have a free slot
    while ($jobs.Count -ge $maxConcurrent) {
        $finished = $jobs | Where-Object { $_.Process.HasExited }
        if ($finished) {
            # Wait until internet is available
            while (-not (Test-Internet)) {
                Write-Host "Internet not available, waiting..."
                Start-Sleep -Seconds 5
            }

            foreach ($j in $finished) {
                # Move file to "done" folder
                $dest = Join-Path $doneFolder (Split-Path $j.File -Leaf)
                Move-Item -Path $j.File -Destination $dest -Force
                Write-Host "Completed: $($j.File)"
            }

            # Remove finished jobs
            $jobs = $jobs | Where-Object { -not $_.Process.HasExited }
        }
        else {
            Start-Sleep -Milliseconds 200
        }
    }

    # Wait until internet is available before starting new one
    while (-not (Test-Internet)) {
        Write-Host "Internet not available, waiting to start: $file"
        Start-Sleep -Seconds 5
    }

    # Start a new job (minimized)
    Write-Host "Starting: $file"
    $proc = Start-Process -FilePath "cmd.exe" -ArgumentList "/c `"$file`"" -PassThru -WindowStyle Minimized
    $jobs += [pscustomobject]@{ Process = $proc; File = $file }
}

# Handle remaining jobs
while ($jobs.Count -gt 0) {
    $finished = $jobs | Where-Object { $_.Process.HasExited }
    if ($finished) {
        # Wait until internet is available
        while (-not (Test-Internet)) {
            Write-Host "Internet not available, waiting..."
            Start-Sleep -Seconds 5
        }

        foreach ($j in $finished) {
            $dest = Join-Path $doneFolder (Split-Path $j.File -Leaf)
            Move-Item -Path $j.File -Destination $dest -Force
            Write-Host "Completed: $($j.File) → moved to done"
        }
        $jobs = $jobs | Where-Object { -not $_.Process.HasExited }
    }
    else {
        Start-Sleep -Milliseconds 200
    }
}

Write-Host "All scripts completed and moved to done folder!"
