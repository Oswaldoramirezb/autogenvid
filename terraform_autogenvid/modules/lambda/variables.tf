variable "name_prefix"             { type = string }
variable "environment"             { type = string }
variable "dynamodb_table_name"     { type = string }
variable "dynamodb_table_arn"      { type = string }
variable "s3_videos_bucket"        { type = string }
variable "s3_videos_bucket_arn"    { type = string }
variable "use_mock"                { type = bool    default = true }
variable "elevenlabs_api_key"      { type = string  sensitive = true }
variable "gemini_api_key"          { type = string  sensitive = true }
variable "pexels_api_key"          { type = string  sensitive = true }
variable "unsplash_access_key"     { type = string  sensitive = true }

output "lambda_guion_arn"              { value = aws_lambda_function.guion.arn }
output "lambda_guion_invoke_arn"       { value = aws_lambda_function.guion.invoke_arn }
output "lambda_preview_arn"            { value = aws_lambda_function.preview.arn }
output "lambda_preview_invoke_arn"     { value = aws_lambda_function.preview.invoke_arn }
output "lambda_video_arn"              { value = aws_lambda_function.video.arn }
output "lambda_video_invoke_arn"       { value = aws_lambda_function.video.invoke_arn }
output "lambda_batch_arn"              { value = aws_lambda_function.batch.arn }
output "lambda_batch_function_name"    { value = aws_lambda_function.batch.function_name }
