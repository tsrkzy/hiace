# https://hub.docker.com/layers/node/library/node/lts/images/sha256-7f47823592cb3e65849a2605173f327a9bb014d406333be0e368798fcf8c3aa3?context=explore
FROM  node:lts

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies (package.json and package-lock.json)
COPY package*.json ./
RUN npm install

# /hiace/socketServer -> /usr/src/app
COPY . .

# Listen port - http(s)3000(4000)
EXPOSE 3000

# Run server.js
CMD ["node", "server.js"]