FROM node:18.13.0
WORKDIR /app
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install
EXPOSE 3001
COPY . .
CMD ["npm", "run", "dev"]
