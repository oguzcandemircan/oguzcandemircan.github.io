---
layout: post
title: "Docker ile Vue Js Projesi Nasıl Oluşturulur, Geliştirilir ve Yayınlanır ?"
description: "Bu makalede Docker kullanarak yeni bir Vue Js projesi oluşturacağız geliştireceğiz ve yayınlıyacağız."
keywords: vue js ile server side rendering nasıl yapılır ?, vue js, server side rendering, ssr, express, vue server renderer, client side rendering
image: /assets/posts/7/vue-docker.jpg
tags: [vue js, server side rendering, ssr, express, vue server renderer, client side rendering,]
categories: 
---

Bu makalede **Docker** kullanarak yeni bir **Vue Js** projesi **oluşturacağız** **geliştireceğiz** ve **yayınlıyacağız**.

Gereksinimler:
- Temel seviyede Docker bilgisi
- Temel seviyede Vue-Cli bilgisi
- Docker yüklü bir bilgisayar

*Docker hakkında hiç bilginiz yok ise " [yeni-nesil-gelistirme-ortami-bolum-1-docker](/yeni-nesil-gelistirme-ortami-bolum-1-docker) " makalemi okuyabilisiniz.*

---

#### Docker ve Vue Cli ile Yeni Bir Vue Js Projesi Nasıl Oluşturulur ?
Yeni bir poje oluşturmak için aşağıdaki kodu çalıştıralım. 
```bash
mkdir vue-docker && cd "$_" && docker run --rm -v "${PWD}:/$(basename `pwd`)" -w "/$(basename `pwd`)" -it node:11.1-alpine sh -c "yarn global add @vue/cli && vue create ."
```

> Not: Yeni bir poje oluştururken "vue-docker" kısmını kendi proje adınız ile değiştirebilirsiniz. "vue create ." kımını "vue init webpack ." vb. değiştirerek herhangi bir vue-cli komutu ile projenizi oluşturabilirsiniz.

---

#### Docker ile Vue Js Projesi Yayınlamak (Deploy)
Vue Js projemizi Docker ile yayınlamak (deploy) için Dockerfile oluşturalım ve içerisine aşağıdaki kodları yerleştirelim.

```dockerfile
# develop stage
FROM node:11.1-alpine as develop-stage
WORKDIR /app
COPY package*.json ./
RUN yarn install
COPY . .
# build stage
FROM develop-stage as build-stage
RUN yarn build
# production stage
FROM nginx:1.15.7-alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Dockerfile' ı `vue-docker` ismiyle etiketleyerek imaj (image) alalım.
```bash
docker build -t vue-docker .
```
Docker Konteynerı(Container) çalıştıralım.
```bash
docker run -it -p 80:80 --rm vue-docker
```
Şimdi tarayıcımızdan **http://localhost** adresine gidelim.

![Docker ile vue js projesi yayınlama örneği](/assets/posts/7/vue-deploy.png)

Yukarıdaki görüntü ile karşılaştıysak her şey yolunda demektir.

---

#### Docker ile Vue JS Projesi Nasıl Geliştirilir (Development)

**Docker** ile **VueJS** projesi geliştirmek için **docker-compose** kullanacağız.

`docker-compose.yml` ismi ile dosya oluşturup içerisine aşağıdaki komutları yerleştirelim.

```yml
version: '3.5'
services:
  frontend:
    build:
      context: .
      target: 'develop-stage'
    ports:
    - '8080:8080'
    volumes:
    - '.:/app'
    command: /bin/sh -c "yarn serve"
```
frontend servisini `hedefi(target)` **"develop-stage"** olarak çalıştıralım.
```bash
docker-compose up -d
```

Şimdi tarayıcımızdan http://localhost:8000 adresine gidelim.

<!-- `hedefi(target)` **"developer-stage"** olarak ayarladığımız için  -->
Her zaman çalıştığımız gibi kodumuzda herhangi bir değişiklik yaptığımız zaman kodumuz derlenecek ve tarayıcımız otomatik olarak yeniden yüklenecek.

---

Projemize herhangi bir başka paket yüklemek için aşağıdaki komutu kullanabiliriz.

```bash
docker-compose exec frontend yarn add <paket-ismi>
```

---

Kaynaklar:
 - [Dockerize Vue.js App](https://vuejs.org/v2/cookbook/dockerize-vuejs-app.html){:target="_blank"}
 - [Vue with Docker; initialize, develop and build](https://medium.com/@jwdobken/vue-with-docker-initialize-develop-and-build-51fad21ad5e6){:target="_blank"}