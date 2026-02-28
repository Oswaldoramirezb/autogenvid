# NUNCA guardes API keys directamente en este archivo.
# Las keys se leen desde variables de entorno del sistema o se piden por parametro.
#
# Uso:
#   .\update-key.ps1 -GeminiKey "TU_NUEVA_KEY"
#
# O configura las variables de entorno antes de correr el script:
#   $env:GEMINI_API_KEY = "TU_NUEVA_KEY"
#   .\update-key.ps1

param(
    [string]$GeminiKey = $env:GEMINI_API_KEY,
    [string]$ElevenLabsKey = $env:ELEVENLABS_API_KEY,
    [string]$UnsplashKey = $env:UNSPLASH_ACCESS_KEY,
    [string]$PexelsKey = $env:PEXELS_API_KEY
)

if (-not $GeminiKey) {
    $GeminiKey = Read-Host "Ingresa tu nueva GEMINI_API_KEY"
}
if (-not $ElevenLabsKey) {
    Write-Warning "ELEVENLABS_API_KEY no definida. Se mantendra el valor actual en Lambda."
}

$envVars = @{
    "DYNAMODB_TABLE_NAME"        = "videobot-prod-videos"
    "S3_VIDEOS_BUCKET"           = "videobot-prod-videos-2c4e4bd5"
    "USE_MOCK"                   = "false"
    "LAMBDA_VIDEO_FUNCTION_NAME" = "videobot-prod-lambda-video"
    "GEMINI_API_KEY"             = $GeminiKey
}

if ($ElevenLabsKey) { $envVars["ELEVENLABS_API_KEY"] = $ElevenLabsKey }
if ($UnsplashKey)   { $envVars["UNSPLASH_ACCESS_KEY"] = $UnsplashKey }
if ($PexelsKey)     { $envVars["PEXELS_API_KEY"] = $PexelsKey }

$envJson = @{ Variables = $envVars } | ConvertTo-Json -Compress

Write-Host "Actualizando Lambda con nueva GEMINI_API_KEY..."

aws lambda update-function-configuration `
    --function-name videobot-prod-lambda-guion `
    --environment $envJson `
    --query "Environment.Variables.GEMINI_API_KEY" `
    --output text

Write-Host "Listo."
