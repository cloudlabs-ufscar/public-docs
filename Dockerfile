FROM node:lts

WORKDIR /web

COPY package*.json ./

RUN npm install

CMD ["npx", "docusaurus", "start", "-h", "0.0.0.0"]