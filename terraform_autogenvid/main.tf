terraform {
  required_version = ">= 1.7"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.50"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.6"
    }
  }
}

provider "aws" {
  region  = var.aws_region
  profile = var.aws_profile

  default_tags {
    tags = {
      Project     = "VideoBot-AI"
      Environment = var.environment
      ManagedBy   = "Terraform"
    }
  }
}

# ── Sufijo aleatorio para evitar conflictos de nombres únicos ─────────────────
resource "random_id" "suffix" {
  byte_length = 4
}

locals {
  suffix = random_id.suffix.hex
  name_prefix = "${var.project_name}-${var.environment}"
}

# ──────────────────────────────────────────────────────────────────────────────
# Módulos
# ──────────────────────────────────────────────────────────────────────────────

module "s3" {
  source          = "./modules/s3"
  name_prefix     = local.name_prefix
  suffix          = local.suffix
  environment     = var.environment
}

module "cognito" {
  source          = "./modules/cognito"
  name_prefix     = local.name_prefix
  cloudfront_url  = "https://${module.cloudfront.cloudfront_url}"
  environment     = var.environment
}

module "dynamodb" {
  source          = "./modules/dynamodb"
  name_prefix     = local.name_prefix
  environment     = var.environment
}

module "lambda" {
  source                  = "./modules/lambda"
  name_prefix             = local.name_prefix
  environment             = var.environment
  dynamodb_table_name     = module.dynamodb.table_name
  dynamodb_table_arn      = module.dynamodb.table_arn
  s3_videos_bucket        = module.s3.videos_bucket_id
  s3_videos_bucket_arn    = module.s3.videos_bucket_arn
  use_mock                = var.use_mock
  elevenlabs_api_key      = var.elevenlabs_api_key
  gemini_api_key          = var.gemini_api_key
  pexels_api_key          = var.pexels_api_key
  unsplash_access_key     = var.unsplash_access_key
}

module "api_gateway" {
  source                     = "./modules/api-gateway"
  name_prefix                = local.name_prefix
  environment                = var.environment
  lambda_guion_arn           = module.lambda.lambda_guion_arn
  lambda_guion_invoke_arn    = module.lambda.lambda_guion_invoke_arn
  lambda_preview_arn         = module.lambda.lambda_preview_arn
  lambda_preview_invoke_arn  = module.lambda.lambda_preview_invoke_arn
  lambda_video_arn           = module.lambda.lambda_video_arn
  lambda_video_invoke_arn    = module.lambda.lambda_video_invoke_arn
}

module "cloudfront" {
  source                  = "./modules/cloudfront"
  name_prefix             = local.name_prefix
  frontend_bucket_id      = module.s3.frontend_bucket_id
  frontend_bucket_arn     = module.s3.frontend_bucket_arn
  frontend_bucket_domain  = module.s3.frontend_bucket_domain
}

module "eventbridge" {
  source                     = "./modules/eventbridge"
  name_prefix                = local.name_prefix
  environment                = var.environment
  lambda_batch_arn           = module.lambda.lambda_batch_arn
  lambda_batch_function_name = module.lambda.lambda_batch_function_name
}
