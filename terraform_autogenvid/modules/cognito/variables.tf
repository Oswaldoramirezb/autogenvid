variable "name_prefix"    { type = string }
variable "environment"    { type = string }
variable "cloudfront_url" { type = string }

output "user_pool_id"   { value = aws_cognito_user_pool.main.id }
output "app_client_id"  { value = aws_cognito_user_pool_client.main.id }
output "cognito_domain"  { value = "${aws_cognito_user_pool_domain.main.domain}.auth.${data.aws_region.current.name}.amazoncognito.com" }
output "hosted_ui_url"   { value = "https://${aws_cognito_user_pool_domain.main.domain}.auth.${data.aws_region.current.name}.amazoncognito.com/login" }

data "aws_region" "current" {}
