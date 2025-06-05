# Etapa base
FROM node:20-alpine

# Diretório de trabalho
WORKDIR /app

# Copia apenas os arquivos de dependência
COPY package.json ./

# Instala dependências
RUN npm install

# Copia o restante da aplicação
COPY . .

# Expõe a porta da aplicação
EXPOSE 3000

# Comando de desenvolvimento (com hot reload)
CMD ["npm", "run", "start:dev"]
