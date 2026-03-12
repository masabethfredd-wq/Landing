$listener = [System.Net.HttpListener]::new()
$listener.Prefixes.Add("http://localhost:8888/")
$listener.Start()
Write-Host "Server running on http://localhost:8888"

while ($listener.IsListening) {
    $ctx = $listener.GetContext()
    $req = $ctx.Request
    $resp = $ctx.Response
    $path = $req.Url.LocalPath

    if ($path -eq "/") { $path = "/index.html" }

    $filePath = Join-Path "c:\Users\maria\Downloads\Landing" $path.TrimStart("/")

    if (Test-Path $filePath) {
        $bytes = [System.IO.File]::ReadAllBytes($filePath)
        $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
        
        $contentType = switch ($ext) {
            ".html" { "text/html; charset=utf-8" }
            ".css"  { "text/css; charset=utf-8" }
            ".js"   { "application/javascript; charset=utf-8" }
            ".png"  { "image/png" }
            ".webp" { "image/webp" }
            ".jpg"  { "image/jpeg" }
            ".jpeg" { "image/jpeg" }
            ".svg"  { "image/svg+xml" }
            ".ico"  { "image/x-icon" }
            default { "application/octet-stream" }
        }
        
        $resp.ContentType = $contentType
        $resp.ContentLength64 = $bytes.Length
        $resp.OutputStream.Write($bytes, 0, $bytes.Length)
    }
    else {
        $resp.StatusCode = 404
        $body = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
        $resp.OutputStream.Write($body, 0, $body.Length)
    }

    $resp.OutputStream.Close()
}
