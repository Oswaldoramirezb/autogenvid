output "frontend_url" {
  description = "URL pública del frontend (CloudFront HTTPS)"
  value       = "https://${module.cloudfront.cloudfront_url}"
}

output "api_gateway_url" {
  description = "URL base del API Gateway para las Lambdas"
  value       = module.api_gateway.api_gateway_url
}

output "cognito_hosted_ui_url" {
  description = "URL del Cognito Hosted UI (login)"
  value       = module.cognito.hosted_ui_url
}

output "cognito_user_pool_id" {
  description = "ID del Cognito User Pool"
  value       = module.cognito.user_pool_id
}

output "cognito_app_client_id" {
  description = "App Client ID para el frontend Amplify"
  value       = module.cognito.app_client_id
}

output "dynamodb_table_name" {
  description = "Nombre de la tabla DynamoDB de videos"
  value       = module.dynamodb.table_name
}

output "s3_frontend_bucket" {
  description = "Nombre del bucket S3 del frontend"
  value       = module.s3.frontend_bucket_id
}

output "s3_videos_bucket" {
  description = "Nombre del bucket S3 de videos generados"
  value       = module.s3.videos_bucket_id
}

output "env_local_template" {
  description = "Bloque listo para copiar en .env.local del frontend"
  sensitive   = false
  value       = <<-EOT
    # ── Pega esto en frontend_autogenvid/.env.local ──
    VITE_API_GATEWAY_URL=${module.api_gateway.api_gateway_url}
    VITE_COGNITO_USER_POOL_ID=${module.cognito.user_pool_id}
    VITE_COGNITO_APP_CLIENT_ID=${module.cognito.app_client_id}
    VITE_COGNITO_DOMAIN=${module.cognito.cognito_domain}
    VITE_COGNITO_REDIRECT_URI=https://${module.cloudfront.cloudfront_url}
    VITE_AWS_REGION=${var.aws_region}
    VITE_USE_MOCK=false
  EOT
}
