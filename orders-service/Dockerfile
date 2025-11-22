FROM python:3.9-slim

WORKDIR /app

# Instalar dependencias del sistema y limpiar cache
RUN apt-get update && apt-get install -y \
    libpq-dev \
    gcc \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get clean

# Copiar requirements e instalar Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar código de la aplicación
COPY . .

# Saludar y verificar que todo está bien
RUN echo "Microservice built successfully!"

# Puerto (cambiar según el servicio: 3000, 3001, 3002)
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

# Usar gunicorn para producción
CMD ["gunicorn", "--bind", "0.0.0.0:3001", "app:app"]
