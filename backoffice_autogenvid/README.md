# backoffice_autogenvid 🤖

Backend serverless del proyecto **VideoBot AI**. Contiene 4 AWS Lambda Functions en Node.js 20.x para la generación automatizada de videos.

## Estructura

```
backoffice_autogenvid/
├── shared/                 ← Clientes AWS y helpers compartidos
│   ├── dynamoClient.js     ← DynamoDB Document Client
│   ├── s3Client.js         ← S3 Client + presigned URLs
│   └── response.js         ← Respuestas HTTP estandarizadas + CORS
├── lambda-guion/           ← POST /guion → genera guion con Gemini AI
├── lambda-preview/         ← POST /preview → audio ElevenLabs + fondos Pexels
├── lambda-video/           ← POST /video → genera MP4 con ffmpeg
└── lambda-batch/           ← EventBridge cron 8AM → procesa 5 aprobados
```

## Variables de Entorno

```bash
cp .env.example .env
# Edita .env con tus credenciales reales
```

| Variable | Descripción | Default |
|----------|-------------|---------|
| `AWS_REGION` | Región AWS | `us-east-1` |
| `DYNAMODB_TABLE_NAME` | Tabla DynamoDB | `videos` |
| `S3_VIDEOS_BUCKET` | Bucket de videos generados | — |
| `USE_MOCK` | Usa mocks en lugar de APIs reales | `true` |
| `ELEVENLABS_API_KEY` | Clave ElevenLabs para voz | — |
| `GEMINI_API_KEY` | Clave Gemini AI para guiones | — |
| `PEXELS_API_KEY` | Clave Pexels para fondos de video | — |
| `UNSPLASH_ACCESS_KEY` | Clave Unsplash para fondos foto | — |

## Instalación y Tests

```bash
# Instalar dependencias de cada lambda
cd lambda-guion && npm install && npm test
cd ../lambda-preview && npm install && npm test
cd ../lambda-video && npm install && npm test
cd ../lambda-batch && npm install && npm test
```

## Deploy con Terraform

El deploy de las Lambdas se gestiona desde `terraform_autogenvid/`. Ver el README de ese módulo.

```bash
cd ../terraform_autogenvid
terraform init && terraform apply
```

## Flujo de Estados DynamoDB

```
pendiente → preview → aprobado → generando → listo
                                           ↘ error
```

## Activar APIs Reales

1. Cambiar `USE_MOCK=false` en `.env`
2. Configurar las API keys correspondientes
3. El código tiene los conectores listos pero comentados en cada `*Service.js`
