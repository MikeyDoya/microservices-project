# ECS-Shoes-app
Sistema de e-commerce para calzado construido con arquitectura de microservicios en AWS ECS Fargate. Implementa un pipeline CI/CD automatizado con despliegues Blue/Green nativos para máxima disponibilidad y cero downtime.

# Estrategia Blue/Green
ALB Configuration:
- Listener 80 (Production) → Target Groups Blue
- Listener 8080 (Testing) → Target Groups Green
- 8 Target Groups Total (4 servicios × 2 colores)
- Health Checks independientes por servicio en /health

# Prerrequisitos
Cuenta AWS con permisos administrativos

AWS CLI configurado con credenciales apropiadas

Repositorio GitHub con el código fuente

Docker instalado localmente para desarrollo

Roles IAM necesarios:

CodeBuildServiceRole (para CodeBuild con permisos ECR/ECS)

ecsTaskExecutionRole (para ejecución de tasks ECS)

SecretsManagerReadWrite (para gestionar PAT de GitHub)

PAT de GitHub con scopes: repo y admin:repo_hook

4 repositorios ECR pre-creados para cada microservicio

Cluster ECS configurado con servicios Blue/Green

ALB con listeners 80 (prod) y 8080 (test) + 8 target groups


✅ Implementado
4 Microservicios independientes en ECS Fargate

Application Load Balancer con 8 Target Groups (4 blue + 4 green)

Base de datos RDS PostgreSQL Single-AZ

4 Repositorios privados ECR (uno por microservicio)

Pipeline CI/CD completo con CodeBuild/CodePipeline

Despliegues Blue/Green nativos (zero-downtime)

Health Checks personalizados por servicio

Integración con GitHub via Webhooks y PAT

Concurrent Build Limit configurado para deployments ordenados


🏗️ Configuración ECS
Cluster: ECS Fargate Cluster

Services: 4 servicios con deployment Blue/Green nativo

Task Definitions: Configuración optimizada para cada microservicio

Load Balancer: ALB con path-based routing

Health Checks: Personalizados por servicio (HTTP/HTTPS)


🗄️ Base de Datos
Engine: PostgreSQL

Deployment: Single-AZ

Backup: Automático y point-in-time recovery

Security: Encriptación at-rest y in-transit

Conectividad: Desde VPC privada


📦 Container Registry
4 Repositorios ECR privados (uno por microservicio)

Scanning de vulnerabilidades automático

Lifecycle policies para gestión de imágenes

Tags: latest, commit-hash, timestamp


📄 Licencia
Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

