data "aws_caller_identity" "current" {}

# ── Frontend Bucket (S3 Static Website) ───────────────────────────────────────
resource "aws_s3_bucket" "frontend" {
  bucket = "${var.name_prefix}-frontend-${var.suffix}"
  tags   = { Name = "${var.name_prefix}-frontend", Purpose = "Frontend SPA" }
}

resource "aws_s3_bucket_ownership_controls" "frontend" {
  bucket = aws_s3_bucket.frontend.id
  rule   { object_ownership = "BucketOwnerPreferred" }
}

resource "aws_s3_bucket_public_access_block" "frontend" {
  bucket = aws_s3_bucket.frontend.id
  # CloudFront accede vía OAI — no se necesita acceso público directo
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# ── Videos Bucket ─────────────────────────────────────────────────────────────
resource "aws_s3_bucket" "videos" {
  bucket = "${var.name_prefix}-videos-${var.suffix}"
  tags   = { Name = "${var.name_prefix}-videos", Purpose = "Generated Videos" }
}

resource "aws_s3_bucket_cors_configuration" "videos" {
  bucket = aws_s3_bucket.videos.id
  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET", "PUT", "POST"]
    allowed_origins = ["*"]
    max_age_seconds = 3000
  }
}

resource "aws_s3_bucket_public_access_block" "videos" {
  bucket                  = aws_s3_bucket.videos.id
  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

# Política para lectura pública de videos generados
resource "aws_s3_bucket_policy" "videos_public_read" {
  bucket     = aws_s3_bucket.videos.id
  depends_on = [aws_s3_bucket_public_access_block.videos]
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Sid       = "PublicReadGetObject"
      Effect    = "Allow"
      Principal = "*"
      Action    = "s3:GetObject"
      Resource  = "${aws_s3_bucket.videos.arn}/videos/*"
    }]
  })
}
