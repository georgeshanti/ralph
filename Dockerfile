FROM node:8

WORKDIR .

COPY frontend/package.json /frontend/package.json
COPY server/package.json /server/package.json

RUN cd frontend && npm install && cd ..
RUN cd server && npm install && cd ..

COPY frontend/ /frontend/
COPY server/ /server/

EXPOSE 3000 9000 8080 8081