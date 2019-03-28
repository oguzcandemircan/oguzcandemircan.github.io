---
layout: post
title:  "Yeni nesil geliştirme ortamı Bölüm 1: Docker"
description: "Docker, Dockerfile, Docker Container(Konteyner), Docker Image(imaj), nedir ? Docker biz geliştiriciler için ne ifade ediyor ? Neden Docker kullanalım ? Dockerı nasıl kullanırız vb. gibi sorulara cevap arıyoruz."
keywords: docker, docker container, docker image, docker kurulumu, dockerfile, geliştirme ortamı, yazılım, software
image: /assets/posts/1/docker.jpg
tags: [docker, docker container, docker image, dockerfile, geliştirme ortamı, yazılım, software]
categories: [docker, geliştirme ortamı, yazılım, software]
---

**Yeni nesil geliştirme ortamı** adı altında başladığımız, 4.bölümlük yazı dizisinin 1. bölümüne hoş geldiniz. 

Bu bölümde Docker, Dockerfile, Docker Container(Konteyner), Docker Image(imaj), nedir ? Docker biz geliştiriciler için ne ifade ediyor ? Neden Docker kullanalım ? Dockerı nasıl kullanırız vb. gibi sorulara cevap arıyacağız.

#### Docker Nedir ?

Docker çeşitli sanallaştırma ortamları Virtual box ve benzerlerine alternatif uygulama
geliştirme ve yayınlama alt yapı aracıdır.

> Not: bu makalede Docker ve Docker teknojisinden ziyade. Docker biz geliştiriciler için ne ifade ediyor ? Neden Docker kullanalım ? Dockerı nasıl kullanırız vb. gibi sorulara cevap arıyoruz. Docker ve Docker teknolojisi hakkında detaylı bilgi için Gökhan Şengünün [websitesini](https://gokhansengun.com){:target="_blank"} ziyaret edebilirsiniz.

---

#### Dockerfile Nedir ?

Dockerfile geliştirdiğimiz uygulamamızın / yazılımın gerekliklerinin ( örneğin: nginx apache mysql vb.) tanımlandığı dosyadır.

---

#### Docker Image Nedir ?

Docker image, Dockerfile da tanımladığımız gerekliliklerin kurulup hazırlanmış görüntüsüdür.

---

#### Docker Container Nedir ?

Docker Container, Docker imajlarımızın (image) çalıştırıldığı alandır.

----

#### Peki Docker Bunu Nasıl Yapıyor  / Nasıl Çalışıyor ?

Docker, Dockerfile da tanımlanan gereklilikleri `docker build .` komutu ile
yeni bir Docker İmajı oluşturup içerisine,
 Dockerfile da tanımladığımız komutları tek tek çalıştırıp, gerekliliklerin kurulumlarını gerçekleştiriyor. 
 Sistemin çalışır halde olduğunu onayladıktan sonra
sistemin yedeğini yani imajını (image) alıp saklıyor. Hazırlanıp saklanan imajları

`docker images` komutu ile görüntüleyebiliriz.

`docker run {çalıştırmak_istediğimiz_imaj_idsi}` komut ile de imajını aldığımız sistemleri Docker Konteynerına koyup çalıştırıyor.
Hali hazırda çalışan imajları 
`docker ps` komutu ile görüntüleyebiliriz.
`docker ps -a` komutu ile daha önce çalıştırılmış fakat şuanda çalışmayan konteynerları görüntüleyebiliriz.

----

### Biz Geliştiriciler İçin Docker Ne Anlam İfade Ediyor ?

Geliştirdiğimiz herhangi bir uygulamayı yayına alırken kendi bilgisayarımızda çalışırken
sunucuda çalışmadığına en az 1 kere şahit olmuşuzdur. Docker sayesinde " benim bilgisayarımda çalışıyordu " sendromundan kurtuluyoruz. :)
Çünkü Docker sunucu ve çalışma ortamınızı eşitliyor. Kulağa hoş geliyor değil mi ?

---

### Docker Kurulumu

Kurulumu Linux üzerinden anlatacağım diğer işletim sistemleri için docker dökümantasyonunda ki kurulum adımlarını takip edebilirsiniz.

[Windows](https://docs.docker.com/docker-for-windows/install/)   - [Mac](https://docs.docker.com/docker-for-mac/install/)

Docker kurulumu:
```bash
# https://docs.docker.com/install/linux/docker-ce/ubuntu/
sudo apt-get install apt-transport-https ca-certificates curl software-properties-common
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu xenial stable"
sudo apt-get update
sudo apt-get install docker-ce
```
Docker Compose kurulumu:
```bash
# https://docs.docker.com/compose/install/
sudo curl -L https://github.com/docker/compose/releases/download/1.20.0/docker-compose-`uname -s`-`uname -m` -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```
Herhangi bir izin problemiyle karşılaşmamak için. "docker" kullanıcı grubu oluşturuyoruz ve mevcut kullanıcımızı oluşturduğumuz "docker" kullanıcı grubuna atıyoruz.
```bash
# https://docs.docker.com/install/linux/linux-postinstall/
sudo groupadd docker
sudo usermod -aG docker $USER
```

---

### Basit Bir Örnek Yapalım

Linux kullandığım için Linux komut satırı ( terminal ) üzerinden devam edeceğim.

İlk önce bir klasör oluşturalım ve içerisine girelim.

```bash
#docker-example adında klasör oluşturuyoruz.
mkdir docker-example

#docker-example klasörünün içerisine giriyoruz
cd docker-example

#Dockerfile ismiyle dosya oluşturuyoruz.
touch Dockerfile

#www adında klasör oluşturuyoruz.
mkdir www 

#oluşturduğumuz www klasörünün içerisine " index.html" adında bir dosya oluşturuyoruz.
touch www/index.html

# bir üst satırda oluşturduğumuz index.html içerisine ' <h1>Hello World</h1>' satırını ekliyoruz.
echo "<h1>Hello World</h1>" > www/index.html 

```
Dockerfile oluşturalım. Ve içerisine aşağıdaki komutları yazalım.

```dockerfile
# nginx imajını referans alıyoruz.
FROM nginx 

# www klasörümüzü Docker konteyner içerisinde ki /usr/share/nginx/html içerisine kopyalıyoruz.
COPY /www /usr/share/nginx/html

# Docker konteynerımızın içerisindeki 80 portunu dışarıya açıyoruz.
EXPOSE 80
```

Dockerfile ile görüntü oluşturalım. Daha rahat kullanım için etiketliyelim. Ve görüntünün oluşup oluşmadığını kontrol edelim.
```bash
#Oluşturduğumuz Dockerfile ile görüntü(image) alıyoruz / oluşturuyoruz.
docker build -t oguzcandemircan/nginx:1.0 . 

#docker ps komutu ile görüntümüzün(image) oluşup oluşmadığını kontrol ediyoruz.
docker ps
```
Aşığıdakine benzer bir çıktı almalısınız.
![docker ps çıktısı](/assets/posts/1/docker-ps.png)

Oluşturduğumuz imajı çalıştırıyoruz.
```bash
#Oluşturduğumuz imajı(image) çalıştırıyoruz.
docker run -p 81:80 oguzcandemircan/nginx:1.0 

#curl istek atıyoruz.
curl http://localhost:81 
```

curl yüklü değilse Herhangi bir tarayıcıdan http://localhost:81 adresine giderek aynı işlemi gerçekleştirebilirsiniz.

Herhangi bir sorun ile karşılaşmadıysanız aşağıda ki çıktıyı almalısınız.
![docker - curl istek çıktısı](/assets/posts/1/curl.png)

---

### Sonuç

Bu makalede **Docker**, **Dockerfile**, **Docker Image**, **Docker Container** nedir ? Nasıl
çalışır ? Öğrenmiş olduk. Basit bir örnekle öğrendiklerimizi uygulamaya dökerek pekiştirdik. 
4 bölümlük " yeni nesil geliştirme ortamı " serisinin 1. bölümünü tamamladık.
Bir sonraki bölümde **Docker Compose** ile oluşturduğumuz konteynerları yönetme konusuna değineceğiz.