FROM node:20-alpine

# app 디렉터리 생성
WORKDIR /app

# 앱 의존성 설치
COPY package*.json ./
RUN npm ci --omit=dev

# app 소스 추가
COPY . .

EXPOSE 3000
CMD ["node", "src/server.js"]
