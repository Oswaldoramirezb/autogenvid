# frontend_autogenvid 📱

Frontend del proyecto **VideoBot AI** construido con React + Vite + Tailwind CSS.

## Características
- **Tema Dark Neón**: Interfaz premium diseñada para desktop y mobile.
- **Autenticación**: Integración con AWS Cognito (Hosted UI).
- **Dashboard**: Gestión de estados de videos (pendiente, preview, aprobado, listo).
- **Editor de Voz**: Sliders para estabilidad y similitud (ElevenLabs).
- **Selector de Fondos**: Buscador y toggle entre videos (Pexels) y fotos (Unsplash).

## Instalación

```bash
cd frontend_autogenvid
npm install
```

## Configuración

Copia el archivo de ejemplo y rellena los valores con los outputs de Terraform:

```bash
cp .env.example .env.local
```

| Variable | Descripción |
|----------|-------------|
| `VITE_API_GATEWAY_URL` | URL del API Gateway |
| `VITE_COGNITO_USER_POOL_ID` | ID del User Pool de Cognito |
| `VITE_COGNITO_APP_CLIENT_ID` | ID del Cliente de App |
| `VITE_USE_MOCK` | `true` para usar datos locales sin AWS |

## Desarrollo

```bash
npm run dev
```

## Construcción para Producción

```bash
npm run build
# Los archivos generados estarán en la carpeta /dist
```
