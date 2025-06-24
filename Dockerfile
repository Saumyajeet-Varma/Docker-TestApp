FROM node:18

ENV MONGO_DB_USERNAME=admin \
    MONGO_DB_PWD=password

RUN mkdir -p /app

COPY ./app /app

# set default dir so that next commands executes in /app dir
WORKDIR /app

# will execute npm install in /app because of WORKDIR
RUN npm install

EXPOSE 3000

# no need for /app/server.js because of WORKDIR
CMD ["node", "server.js"]
