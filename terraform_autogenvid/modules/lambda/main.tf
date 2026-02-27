data "aws_region" "current" {}
data "aws_caller_identity" "current" {}

# ── IAM Role para todas las Lambdas ──────────────────────────────────────────
resource "aws_iam_role" "lambda_exec" {
  name = "${var.name_prefix}-lambda-exec-role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect    = "Allow"
      Principal = { Service = "lambda.amazonaws.com" }
      Action    = "sts:AssumeRole"
    }]
  })
}

resource "aws_iam_role_policy" "lambda_policy" {
  name = "${var.name_prefix}-lambda-policy"
  role = aws_iam_role.lambda_exec.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "DynamoDB"
        Effect = "Allow"
        Action = ["dynamodb:GetItem","dynamodb:PutItem","dynamodb:UpdateItem",
                  "dynamodb:DeleteItem","dynamodb:Scan","dynamodb:Query"]
        Resource = [var.dynamodb_table_arn, "${var.dynamodb_table_arn}/index/*"]
      },
      {
        Sid    = "S3Videos"
        Effect = "Allow"
        Action = ["s3:GetObject","s3:PutObject","s3:DeleteObject","s3:ListBucket"]
        Resource = [var.s3_videos_bucket_arn, "${var.s3_videos_bucket_arn}/*"]
      },
      {
        Sid    = "InvokeLambda"
        Effect = "Allow"
        Action = ["lambda:InvokeFunction"]
        Resource = "arn:aws:lambda:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:function:${var.name_prefix}-*"
      },
      {
        Sid    = "CloudWatchLogs"
        Effect = "Allow"
        Action = ["logs:CreateLogGroup","logs:CreateLogStream","logs:PutLogEvents"]
        Resource = "arn:aws:logs:*:*:*"
      }
    ]
  })
}

locals {
  lambda_env = {
    DYNAMODB_TABLE_NAME     = var.dynamodb_table_name
    S3_VIDEOS_BUCKET        = var.s3_videos_bucket
    USE_MOCK                = tostring(var.use_mock)
    ELEVENLABS_API_KEY      = var.elevenlabs_api_key
    GEMINI_API_KEY          = var.gemini_api_key
    PEXELS_API_KEY          = var.pexels_api_key
    UNSPLASH_ACCESS_KEY     = var.unsplash_access_key
    LAMBDA_VIDEO_FUNCTION_NAME = "${var.name_prefix}-lambda-video"
  }
}

# ── Archivos ZIP de placeholder (en producción usar data source real) ─────────
# Los ZIPs reales se generan con: cd lambda-xxx && zip -r function.zip .
# y se suben via Terraform o CI/CD.

resource "aws_lambda_function" "guion" {
  function_name = "${var.name_prefix}-lambda-guion"
  role          = aws_iam_role.lambda_exec.arn
  runtime       = "nodejs20.x"
  handler       = "index.handler"
  timeout       = 30
  memory_size   = 256

  # En producción usar filename = "../backoffice_autogenvid/lambda-guion/function.zip"
  filename      = "${path.module}/placeholder.zip"
  source_code_hash = filebase64sha256("${path.module}/placeholder.zip")

  environment { variables = local.lambda_env }
  tags = { Name = "${var.name_prefix}-lambda-guion" }
}

resource "aws_lambda_function" "preview" {
  function_name = "${var.name_prefix}-lambda-preview"
  role          = aws_iam_role.lambda_exec.arn
  runtime       = "nodejs20.x"
  handler       = "index.handler"
  timeout       = 30
  memory_size   = 512
  filename      = "${path.module}/placeholder.zip"
  source_code_hash = filebase64sha256("${path.module}/placeholder.zip")
  environment { variables = local.lambda_env }
  tags = { Name = "${var.name_prefix}-lambda-preview" }
}

resource "aws_lambda_function" "video" {
  function_name = "${var.name_prefix}-lambda-video"
  role          = aws_iam_role.lambda_exec.arn
  runtime       = "nodejs20.x"
  handler       = "index.handler"
  timeout       = 900  # 15 min para procesamiento de video
  memory_size   = 3008 # máximo para ffmpeg
  filename      = "${path.module}/placeholder.zip"
  source_code_hash = filebase64sha256("${path.module}/placeholder.zip")
  environment { variables = local.lambda_env }
  tags = { Name = "${var.name_prefix}-lambda-video" }
}

resource "aws_lambda_function" "batch" {
  function_name = "${var.name_prefix}-lambda-batch"
  role          = aws_iam_role.lambda_exec.arn
  runtime       = "nodejs20.x"
  handler       = "index.handler"
  timeout       = 60
  memory_size   = 256
  filename      = "${path.module}/placeholder.zip"
  source_code_hash = filebase64sha256("${path.module}/placeholder.zip")
  environment { variables = local.lambda_env }
  tags = { Name = "${var.name_prefix}-lambda-batch" }
}
