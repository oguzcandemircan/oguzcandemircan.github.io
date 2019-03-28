---
layout: post
title: "Yeni Nesil Geliştirme Ortamı Bölüm 2: Docker Compose"
description: "Yeni Nesil Geliştirme Ortamı serimizin 2.bölümüne hoş geldiniz. 2. bölümde Docker Compose konusuna değineceğiz.
Docker Compose Nedir ? DockerHub Nedir ? docker-compose.yml nedir ? Docker Compose Nasıl çalışır ? vb. sorulara cevap arıyacağız."
keywords: docker-compose, docker,  yeni nesil geliştirme ortami, geliştirme ortamı
image: /assets/posts/2/docker-compose.jpg
tags: [docker compose, docker,  yeni nesil geliştirme ortami, geliştirme ortamı, yazılım, software]
categories: [docker]
---

**Yeni Nesil Geliştirme Ortamı** serimizin 2.bölümüne hoş geldiniz. 2. bölümde  <br>  **" Docker Compose "** konusuna değineceğiz.
Docker Compose Nedir ? DockerHub Nedir ? docker-compose.yml nedir ? Docker Compose Nasıl çalışır ? vb. sorulara cevap arıyacağız.

---

#### Docker Compose Nedir ?
Docker Composer, Docker Konteynerların (Container) tek bir yml uzantılı dosya ile yönetmemize olanak sağlayan orkestrasyon aracıdır.

---

#### DockerHub Nedir ?
Github benzeri Docker imajlarının (Dockerfile) saklandığı uzak sunucudur.
`docker pull docker_hub_kullanıcı_adı/docker_imaj_adı` komutu ile uzaktaki imajı kendi bilgisayarımıza çekebiliriz.

---

#### Docker Compose Nasıl Çalışır ?
**Docker Compose** çalışmak için bir adet " **docker-compose.yml** " ayar (config) dosyasına ihtiyaç duyar. Docker Compose " docker-compose.yml " dosyasında tanımlanan servisleri (Container) `docker-compose build` komutu ile imajını alır. `docker-compose up` komutu ile de Docker Container içersine koyar çalıştır. `docker-compose stop` komutu ile çalışan servisleri durdurabilir veya `docker-compose down` ile silebiliriz.

Hali hazırda çalışan servisleri görüntülemek için `docker-compose ps` komutunu kullanabiliriz.

---


#### Basit Bir Örnek Yapalım

Linux kullandığım için Linux komut satırı (terminal) üzerinden gideceğim. Terminal deyince hemen korkmanıza gerek yok basit klasör / dosya oluştur vb. işlemleri yapacağız. Siz isterseniz sağtık klasör/dosya oluştur vs. ile de yapabilirsiniz.

```bash
# docker-compose-example ismiyle bir klasör oluşturuyoruz.
mkdir docker-compose-example

# docker-compose-example klasörünün içerisine giriyoruz.
cd docker-compose-example

# musul ismiyle klasör oluşturuyoruz.
mkdir musul

# musul klasörünün içerisine index.html oluşturuyoruz.
touch musul/index.html

# musul klasörünün içerisinede ki index.html içerisine " <h1>Musul</h1> " satırını ekliyoruz.
echo "<h1>Welcome Musul</h1>" > musul/index.html

# kerkuk ismiyle klasör oluşturuyoruz.
mkdir kerkuk

# kerkuk klasörünün içerisine index.html oluşturuyoruz.
touch kerkuk/index.html

# kerkük klasörünün içerisinede ki index.html içerisine " <h1>Kerkuk</h1> " satırını ekliyoruz.
echo "<h1>Welcome Kerkuk</h1>" > kerkuk/index.html

# docker-compose.yml ismiyle bir dosya oluşturuyouz.
touch docker-compose.yml

# oluşturduğumuz dosyanın içerisini dolduruyoruz.
echo 'version: "3"
services:
    website1:
        image: nginx
        ports:
        - "82:80"
        volumes:
        - ./musul:/usr/share/nginx/html
    website2:
        image: nginx
        ports:
        - "83:80"
        volumes:
        - ./kerkuk:/usr/share/nginx/html
    database:
        image: mysql
        restart: always
        environment:
            - MYSQL_DATABASE=veri_tabanı_adı
            - MYSQL_ROOT_PASSWORD=root_sifresi
            - MYSQL_USER=mysql_kullanicisi
            - MYSQL_PASSWORD=mysql_kullanici_sifresi
        ports:
            - "8989:3306"' > docker-compose.yml

```

<!-- **" docker-compose.yml "** ismiyle bir dosya oluşturup içerisine aşağıdaki komutları yazalım. -->

Tüm adımları eksiksiz uyguladıysak  **" docker-compose.yml "** dosyamız aşığda ki gibi görünmelidir.

```yml
version: '3'
services:
    website1:
        image: nginx
        ports:
        - "82:80"
        volumes:
        - ./musul:/usr/share/nginx/html
    website2:
        image: nginx
        ports:
        - "83:80"
        volumes:
        - ./kerkuk:/usr/share/nginx/html
    database:
        image: mysql
        restart: always
        environment:
            - MYSQL_DATABASE=veri_tabanı_adı
            - MYSQL_ROOT_PASSWORD=root_sifresi
            - MYSQL_USER=mysql_kullanicisi
            - MYSQL_PASSWORD=mysql_kullanici_sifresi
        ports:
            - "8989:3306"
```
Dosyanın içeriğini inceliyelim.

| Değer        	| Açıklaması  |
| ------------- |-------------|
| Version	      | adından da anlaşılacağı üzere docker-compose version numaramız |
| services      | kullanacağımız servislerin tanımlandığı alan.      |
| website1 | servisimizin adını tanımladığımız alan.|
| website2 | diğer bir servisimizin adı. |
| mysql    | bir başka servisimizin adı. |
| image | servizimizin kullanacağı imajı(image) adı. |
| volumes | Docker Konteyner ile kendi bilgisayarımızda ki klasörleri eşitlediğimiz alan |
| ports | servisimizin dışarıya açılan portun kendi bilgisayarımızda hangi porta karşılık geleceğini tanımladığımız alan. |
| restart | servisimiz herhangi bir sebepten ötürü durursa ne sıklıkta yeniden başlamayı deniyeceğini belirttiğimiz alan. örnek: " always " her zaman |
| environment | servisimizin ortam değişkenlerini tanımladığımız alan. |

daha iyi anlaşılması için bir kaç kısmı daha açıklayalım.

- **Volume** :
`./musul:/usr/share/nginx/html `  ifadesi ile bilgisayarımızda yer alan "musul" klasörünü servisimizin içerisinde ki "/usr/share/nginx/html" klasörüne eşitlemiş oluyoruz.


- **Ports** :
docker-compose.yml da yer alan `82:80` ifadesi ile servisimizin dışarıya açık olan "80" portunu bilgisayarımzda ki "82" portuna eşitlemiş oluyoruz.
daha sonra tarayıcımızdan http://localhost:82 yazarak servisimize erişebiliriz.

- **environment** : 
`MYSQL_DATABASE=veri_tabanı_adı` ifadesi ile servisimizin içerisinde yer alan `MYSQL_DATABASE` değişkenini "veri_tabanı_adı" olarak ayarlamış oluyoruz.

`docker-compose up -d` komut ile servislerimizi ayağa kaldıralım.
<!-- herhangi bir sorun ile karşılaşmadıysanız aşağıdakine benzer bir çıktı almalısınız. -->
<!-- ![docker compose up komutu çıktı görüntüsü](/assets/posts/2/docker-compose-up.jpg) -->

Tarayıcıdan önce http://localhost:82
![docker compose - ornek musul](/assets/posts/2/ornek-musul.jpg)
daha sonra http://localhost:83 adresine gidelim.
![docker compose - ornek kerkuk](/assets/posts/2/ornek-kerkuk.jpg)

Yukarıda ki çıktıları aldıysanız doğru yoldasınız demektir.

`docker-compose exec {service_adı} {komut}` komutu ile servislerimizin içerisinde komut çalıştırabilmekteyiz. Örneğin :

```bash
docker-compose exec database mysql -uroot -proot_sifresi
```
çıktı:
![docker compose exec örneği](/assets/posts/2/docker-compose-database-connect.jpg)

veri tabanında ki tabloları görüntüleyelim.
```sql
show databases;
```
çıktı:
![docker compose - show database](/assets/posts/2/docker-compose-mysql-show-database.jpg)

oluşturduğumuz.

"**veri_tabanı_adi**" adlı veri tabanını (database) görmekteyiz.

----

### Sonuç

Docker Compose, docker-compose.yml, DockerHub, Nedir ? öğrenmiş olduk. Öğrendiklerimizide basit bir örnekle pekiştirdik.
"Yeni nesil geliştirme ortamı " serimizin 2.bölümünü tamamladık. 3. bölümde " **Laradock** " konusuna değineceğiz.