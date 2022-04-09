FROM node:15-alpine3.13
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm install
RUN npm i -g ts-node
COPY . ./
EXPOSE 3000
RUN chmod +x start.sh
CMD ["sh", "-c", "/usr/src/app/start.sh"]
