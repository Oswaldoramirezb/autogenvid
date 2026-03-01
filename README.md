# VideoBot AI 🎬 🚀

Bienvenido a **VideoBot AI**, una plataforma serverless completa en AWS para automatizar la creación de contenido de video viral (YouTube/TikTok) de 60 segundos.

## 🏗️ Arquitectura del Proyecto

Este repositorio está dividido en 3 sub-proyectos independientes para mantener una separación clara de responsabilidades:

1.  **[frontend_autogenvid](./frontend_autogenvid)**: Aplicación React (Vite + Tailwind) con diseño Dark Neón. Gestiona el dashboard, autenticación con Cognito y vistas de preview.
2.  **[backoffice_autogenvid](./backoffice_autogenvid)**: 4 Lambdas en Node.js 20.x que manejan la lógica de guiones (Gemini), voz (ElevenLabs), búsqueda de medios y batch diario.
3.  **[terraform_autogenvid](./terraform_autogenvid)**: Infraestructura como Código (IaC) que despliega automáticamente S3, DynamoDB, API Gateway, Cognito, CloudFront y EventBridge.

---

## 🚀 Guía de Inicio Rápido

### 1. Desplegar Infraestructura
Primero, necesitamos crear los recursos en la nube:

```bash
cd terraform_autogenvid
cp terraform.tfvars.example terraform.tfvars
# (Opcional) Edita terraform.tfvars con tus API keys reales
terraform init
terraform apply
```
*Toma nota de los **Outputs** al finalizar el comando.*

### 2. Configurar el Backend (Mocks)
Por defecto, las lambdas vienen configuradas en **Modo Mock**. Si quieres usar las APIs reales de Gemini y ElevenLabs:

```bash
cd backoffice_autogenvid
cp .env.example .env
# Cambia USE_MOCK=false y añade tus claves
```

### 3. Lanzar el Frontend
Configura la conexión con los recursos creados por Terraform:

```bash
cd frontend_autogenvid
cp .env.example .env.local
# Copia los valores de los outputs de Terraform a .env.local
npm install
npm run dev
```

---

## 🛠️ Flujo de Trabajo
1.  **Dashboard**: Crea un nuevo tema (ej: "Misterios del Titanic").
2.  **Preview**: El sistema genera un guion con IA. Tú ajustas la voz y seleccionas los mejores fondos (video/foto).
3.  **Aprobar**: Una vez aprobado, el video se marca para el **Batch Diario**.
4.  **Generación**: Todos los días a las **8:00 AM**, el sistema procesa automáticamente hasta 5 videos aprobados.
5.  **Descarga**: Recibirás el MP4 final listo para subir a TikTok o Shorts.

## 🔒 Seguridad
- Todas las comunicaciones están protegidas por **HTTPS (CloudFront)**.
- El acceso está restringido mediante **AWS Cognito**.
- Las Lambdas usan el principio de **mínimo privilegio** con roles IAM específicos por recurso.

---
*Desarrollado con ❤️ para la automatización de contenido.*
