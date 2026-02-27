$env = @{
    "DYNAMODB_TABLE_NAME" = "videobot-prod-videos"
    "S3_VIDEOS_BUCKET" = "videobot-prod-videos-2c4e4bd5"
    "USE_MOCK" = "false"
    "ELEVENLABS_API_KEY" = "sk_2207da2c8961c72ebf1155a01dae4813fa64972286225cf1"
    "GEMINI_API_KEY" = "AIzaSyBvmu48pJBVdmamS1Ajy5nWzEhE8lDODpw"
    "UNSPLASH_ACCESS_KEY" = "7DCrhPfSOH79LHF8yy8ibk5OULfU4GkPdgYBOc6TeAw"
    "PEXELS_API_KEY" = "531zYgcp9O7NlD9DLL1t5RNKjzOYxOD021wuGJsWsL6oH3YGKc5lQiUN"
    "LAMBDA_VIDEO_FUNCTION_NAME" = "videobot-prod-lambda-video"
}

$envJson = @{ Variables = $env } | ConvertTo-Json -Compress

aws lambda update-function-configuration `
    --function-name videobot-prod-lambda-guion `
    --environment $envJson `
    --query "Environment.Variables.GEMINI_API_KEY" `
    --output text
