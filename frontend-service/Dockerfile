# Use a lightweight Nginx image
FROM public.ecr.aws/docker/library/nginx:alpine

# Copy the Phaser game files (HTML, JS, assets)
COPY . /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]

