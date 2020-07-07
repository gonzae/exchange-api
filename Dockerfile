FROM node:12.17.0-slim

WORKDIR /usr/backend

COPY ["package.json", "package-lock.json", "/usr/backend/"]

RUN npm install --porcelain

COPY ["*.*", "/usr/backend/"]

EXPOSE 3001

CMD ["npm", "start"]
