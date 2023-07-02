FROM node:18.13.0
WORKDIR /app
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install
EXPOSE 3003
COPY . .
CMD ["node"]
