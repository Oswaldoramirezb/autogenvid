resource "aws_api_gateway_rest_api" "main" {
  name        = "${var.name_prefix}-api"
  description = "VideoBot AI — API Gateway REST"
  endpoint_configuration { types = ["REGIONAL"] }
  tags = { Name = "${var.name_prefix}-api" }
}

# ── Recurso /guion ────────────────────────────────────────────────────────────
resource "aws_api_gateway_resource" "guion" {
  rest_api_id = aws_api_gateway_rest_api.main.id
  parent_id   = aws_api_gateway_rest_api.main.root_resource_id
  path_part   = "guion"
}

resource "aws_api_gateway_method" "guion_post" {
  rest_api_id   = aws_api_gateway_rest_api.main.id
  resource_id   = aws_api_gateway_resource.guion.id
  http_method   = "POST"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "guion" {
  rest_api_id             = aws_api_gateway_rest_api.main.id
  resource_id             = aws_api_gateway_resource.guion.id
  http_method             = aws_api_gateway_method.guion_post.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = var.lambda_guion_invoke_arn
}

resource "aws_lambda_permission" "guion" {
  statement_id  = "AllowAPIGatewayInvokeGuion"
  action        = "lambda:InvokeFunction"
  function_name = var.lambda_guion_arn
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.main.execution_arn}/*/*"
}

# ── Recurso /preview ──────────────────────────────────────────────────────────
resource "aws_api_gateway_resource" "preview" {
  rest_api_id = aws_api_gateway_rest_api.main.id
  parent_id   = aws_api_gateway_rest_api.main.root_resource_id
  path_part   = "preview"
}

resource "aws_api_gateway_method" "preview_post" {
  rest_api_id   = aws_api_gateway_rest_api.main.id
  resource_id   = aws_api_gateway_resource.preview.id
  http_method   = "POST"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "preview" {
  rest_api_id             = aws_api_gateway_rest_api.main.id
  resource_id             = aws_api_gateway_resource.preview.id
  http_method             = aws_api_gateway_method.preview_post.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = var.lambda_preview_invoke_arn
}

resource "aws_lambda_permission" "preview" {
  statement_id  = "AllowAPIGatewayInvokePreview"
  action        = "lambda:InvokeFunction"
  function_name = var.lambda_preview_arn
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.main.execution_arn}/*/*"
}

# ── Recurso /video ────────────────────────────────────────────────────────────
resource "aws_api_gateway_resource" "video" {
  rest_api_id = aws_api_gateway_rest_api.main.id
  parent_id   = aws_api_gateway_rest_api.main.root_resource_id
  path_part   = "video"
}

resource "aws_api_gateway_method" "video_post" {
  rest_api_id   = aws_api_gateway_rest_api.main.id
  resource_id   = aws_api_gateway_resource.video.id
  http_method   = "POST"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "video" {
  rest_api_id             = aws_api_gateway_rest_api.main.id
  resource_id             = aws_api_gateway_resource.video.id
  http_method             = aws_api_gateway_method.video_post.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = var.lambda_video_invoke_arn
}

resource "aws_lambda_permission" "video" {
  statement_id  = "AllowAPIGatewayInvokeVideo"
  action        = "lambda:InvokeFunction"
  function_name = var.lambda_video_arn
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.main.execution_arn}/*/*"
}

# ── Deployment ────────────────────────────────────────────────────────────────
resource "aws_api_gateway_deployment" "main" {
  depends_on = [
    aws_api_gateway_integration.guion,
    aws_api_gateway_integration.preview,
    aws_api_gateway_integration.video,
  ]
  rest_api_id = aws_api_gateway_rest_api.main.id
  lifecycle { create_before_destroy = true }
}

resource "aws_api_gateway_stage" "prod" {
  deployment_id = aws_api_gateway_deployment.main.id
  rest_api_id   = aws_api_gateway_rest_api.main.id
  stage_name    = "prod"
  tags          = { Name = "${var.name_prefix}-api-stage" }
}

variable "name_prefix"                  { type = string }
variable "environment"                  { type = string }
variable "lambda_guion_arn"             { type = string }
variable "lambda_guion_invoke_arn"      { type = string }
variable "lambda_preview_arn"           { type = string }
variable "lambda_preview_invoke_arn"    { type = string }
variable "lambda_video_arn"             { type = string }
variable "lambda_video_invoke_arn"      { type = string }

output "api_gateway_url" { value = "${aws_api_gateway_stage.prod.invoke_url}" }
output "api_gateway_id"  { value = aws_api_gateway_rest_api.main.id }
