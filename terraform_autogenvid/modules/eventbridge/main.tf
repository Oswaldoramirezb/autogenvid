# ── EventBridge Rule: cron diario 8AM UTC ────────────────────────────────────
resource "aws_cloudwatch_event_rule" "batch_diario" {
  name                = "${var.name_prefix}-batch-diario"
  description         = "Dispara lambda-batch a las 8AM UTC todos los días"
  schedule_expression = "cron(0 8 * * ? *)"
  state               = "ENABLED"
  tags                = { Name = "${var.name_prefix}-batch-cron" }
}

resource "aws_cloudwatch_event_target" "lambda_batch" {
  rule      = aws_cloudwatch_event_rule.batch_diario.name
  target_id = "LambdaBatch"
  arn       = var.lambda_batch_arn
}

# Permiso para que EventBridge invoque la Lambda
resource "aws_lambda_permission" "eventbridge_batch" {
  statement_id  = "AllowEventBridgeInvokeBatch"
  action        = "lambda:InvokeFunction"
  function_name = var.lambda_batch_function_name
  principal     = "events.amazonaws.com"
  source_arn    = aws_cloudwatch_event_rule.batch_diario.arn
}

variable "name_prefix"                  { type = string }
variable "environment"                  { type = string }
variable "lambda_batch_arn"             { type = string }
variable "lambda_batch_function_name"   { type = string }

output "rule_arn"  { value = aws_cloudwatch_event_rule.batch_diario.arn }
output "rule_name" { value = aws_cloudwatch_event_rule.batch_diario.name }
