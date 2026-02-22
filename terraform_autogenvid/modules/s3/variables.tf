variable "name_prefix"  { type = string }
variable "environment"  { type = string }
variable "suffix"       { type = string }

output "frontend_bucket_id"     { value = aws_s3_bucket.frontend.id }
output "frontend_bucket_arn"    { value = aws_s3_bucket.frontend.arn }
output "frontend_bucket_domain" { value = aws_s3_bucket.frontend.bucket_regional_domain_name }
output "videos_bucket_id"       { value = aws_s3_bucket.videos.id }
output "videos_bucket_arn"      { value = aws_s3_bucket.videos.arn }
