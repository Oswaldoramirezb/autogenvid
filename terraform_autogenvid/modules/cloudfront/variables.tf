variable "name_prefix"             { type = string }
variable "frontend_bucket_id"      { type = string }
variable "frontend_bucket_arn"     { type = string }
variable "frontend_bucket_domain"  { type = string }

output "cloudfront_url" { value = aws_cloudfront_distribution.frontend.domain_name }
output "cloudfront_id"  { value = aws_cloudfront_distribution.frontend.id }
