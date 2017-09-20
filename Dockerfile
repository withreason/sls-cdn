FROM lambci/lambda:build-nodejs6.10

ADD . .

RUN npm install && npm install serverless -g && sls deploy -v
