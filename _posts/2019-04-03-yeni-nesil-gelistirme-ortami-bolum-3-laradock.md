---
layout: post
# title:  Yeni nesil geliştirme ortamı Docker ! <br> 2.bölüm - docker compose
title: "Yeni Nesil Geliştirme Ortamı Bölüm 3: Laradock"
description: "Bu makale de Docker nedir ? Docker biz geliştiriciler için ne ifade ediyor ? Neden Docker kullanalım ? Dockerı nasıl kullanırız vb. gibi sorulara cevap arıyoruz."
keywords: docker, laradock, laravel, php, geliştirme ortamı
image: /assets/posts/3/laradock.jpg
tags: [laradock, docker, laravel, software, php, geliştirme ortamı, yazılım]
categories: [docker]
---

**Yeni nesil geliştirme ortami** serimizin 3. bölümüne hoş geldiniz.
Bu bölümde konumuz "**Laradock**"

---

#### Laradock Nedir ?

**Laradock**, PHP ile uygulama geliştirmek için oluşturulmuş "Docker" altyapısı kullanan geliştirme ortamıdır. Adını her ne kadar " Laravel + Docker " kelimerinin ilk hecelerinden almış ve ilk çıkış amacı "Docker" ile "Laravel" geliştirme ortamı sunmak olsada. Zamanla Topluluğun desteğiyle Symfony, CodeIgniter WordPress, Drupal vb. diğer PHP projelerini destekler hale geldi.

---

#### Tek Projelik Basit Bir Örnek Yapalım

Öncelikle githubta ki laradock projesini bilgisayarımıza kopyalayalım ve içerisine girelim.(copy)
```bash
git clone https://github.com/Laradock/laradock.git
```
Daha sonra .env-example dosyasını .env ismiyle kopyalayalım.
```bash
cp env-example .env
```
Laravel projemiz için gerekli olan Nginx ve Mysql servislerimizi çalıştıralım.
```bash
docker-compose up -d nginx mysql
```
workspace servisimizin (Konteyner) içerisine girelim.
```bash
docker-compose exec workspace bash
```

workspace servisimizin içerisinde composer, git, node, npm vb. bir çok gerekli araç gereç bulunuyor. 
Laravel projemizi kurmak için workspace içerisinde ki Composer ' ı kullanacağız.
workspace içerisindeyken aşağıdaki kodu çalıştıralım.
```bash
composer create-project --prefer-dist laravel/laravel ."5.5.*"
```
Tarayıcıdan http://localhost adresine gidelim.

![laravel - laravel hoşgeldin sayfası](/assets/posts/3/laravel-welcome-page)