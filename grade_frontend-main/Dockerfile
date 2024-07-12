# Use uma imagem base do Nginx ou de um servidor de sua escolha
FROM nginx:alpine

# Remova a configuração padrão do Nginx
RUN rm -rf /usr/share/nginx/html/*

# Copie os arquivos do front end para o diretório do Nginx
COPY . /usr/share/nginx/html

# Exponha a porta padrão do Nginx
EXPOSE 80

# Comando para rodar o Nginx
CMD ["nginx", "-g", "daemon off;"]
