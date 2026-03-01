variable "aws_region" {
  description = "Región AWS donde se desplegará la infraestructura"
  type        = string
  default     = "us-east-1"
}

variable "aws_profile" {
  description = "Perfil AWS CLI a usar (dejar en default si no usas múltiples perfiles)"
  type        = string
  default     = "default"
}

variable "project_name" {
  description = "Nombre del proyecto (prefijo de todos los recursos)"
  type        = string
  default     = "videobot"
}

variable "environment" {
  description = "Ambiente de despliegue (dev, staging, prod)"
  type        = string
  default     = "prod"
  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "El environment debe ser dev, staging o prod."
  }
}

# ── APIs de terceros ──────────────────────────────────────────────────────────
variable "elevenlabs_api_key" {
  description = "API key de ElevenLabs para síntesis de voz"
  type        = string
  default     = "CAMBIA_ESTE_VALOR"
  sensitive   = true
}

variable "gemini_api_key" {
  description = "API key de Google Gemini para generación de guiones"
  type        = string
  default     = "CAMBIA_ESTE_VALOR"
  sensitive   = true
}


variable "use_mock" {
  description = "Si true, las lambdas usan datos mock en lugar de APIs reales"
  type        = bool
  default     = true
}

variable "elevenlabs_voice_id" {
  description = "Voice ID de ElevenLabs (David Energetic u otra voz)"
  type        = string
  default     = "qRUgOhnxGASxirG4fKjv"
  sensitive   = true
}

variable "elevenlabs_model_id" {
  description = "Modelo de ElevenLabs (eleven_turbo_v2_5, eleven_flash_v2_5, etc)"
  type        = string
  default     = "eleven_turbo_v2_5"
}
