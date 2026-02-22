resource "aws_dynamodb_table" "videos" {
  name           = "${var.name_prefix}-videos"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "id"

  attribute {
    name = "id"
    type = "S"
  }

  attribute {
    name = "estado"
    type = "S"
  }

  attribute {
    name = "fechaObjetivo"
    type = "S"
  }

  # GSI para que lambda-batch consulte eficientemente por estado+fecha
  global_secondary_index {
    name               = "estado-fechaObjetivo-index"
    hash_key           = "estado"
    range_key          = "fechaObjetivo"
    projection_type    = "ALL"
  }

  point_in_time_recovery { enabled = true }

  tags = { Name = "${var.name_prefix}-videos-table" }
}

variable "name_prefix"  { type = string }
variable "environment"  { type = string }

output "table_name" { value = aws_dynamodb_table.videos.name }
output "table_arn"  { value = aws_dynamodb_table.videos.arn }
