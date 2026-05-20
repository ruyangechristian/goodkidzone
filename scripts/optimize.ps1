Add-Type -AssemblyName System.Drawing

function Optimize-Image {
    param (
        [string]$SrcName,
        [string]$DestName
    )
    
    $srcPath = "c:\Users\LENOVO\Desktop\CLIENTS PROJECTS\ISHYA-PULSE\goodkidzone\public\images-to-use\$SrcName"
    $destPath = "c:\Users\LENOVO\Desktop\CLIENTS PROJECTS\ISHYA-PULSE\goodkidzone\public\images\$DestName"
    
    if (Test-Path $srcPath) {
        Write-Host "Optimizing $SrcName -> $DestName..."
        $image = [System.Drawing.Image]::FromFile($srcPath)
        
        $newImage = New-Object System.Drawing.Bitmap(800, 600)
        $graph = [System.Drawing.Graphics]::FromImage($newImage)
        
        $graph.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $graph.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
        $graph.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
        $graph.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
        
        $graph.DrawImage($image, 0, 0, 800, 600)
        $newImage.Save($destPath, [System.Drawing.Imaging.ImageFormat]::Jpeg)
        
        $image.Dispose()
        $newImage.Dispose()
        $graph.Dispose()
        
        $size = (Get-Item $destPath).Length / 1KB
        Write-Host ("Done! Size: {0:N2} KB" -f $size)
    } else {
        Write-Error "Source file not found: $srcPath"
    }
}

# 1. Amateka (History/Culture)
Optimize-Image -SrcName "Family fun with Kigali Convention puzzle.png" -DestName "amateka.jpg"

# 2. Uburezi (Education) - Using abana pazzo.jpg
Optimize-Image -SrcName "abana pazzo.jpg" -DestName "uburezi.jpg"

# 3. Film z'Abana 1-5 (Kids Watching TV)
Optimize-Image -SrcName "umwana areba television.png" -DestName "abana_television.jpg"

# 4. Film z'Abana 5-14 (Older Kids Watching TV)
Optimize-Image -SrcName "abana bareba television.jpg" -DestName "abana_5_14_television.jpg"

# 5. Ubuzima (Health/Life) - Using abana basura ingagi.png
Optimize-Image -SrcName "abana basura ingagi.png" -DestName "ubuzima.jpg"
