---
layout: post
title: "Yeni Nesil Geliştirme Ortamı Bölüm 3: Laradock"
description: "Yeni nesil geliştirme ortami serimizin 3. bölümüne hoş geldiniz.
Bu bölümde konumuz Laradock. Laradock ile tekli ve çoklu projeler üzerinde nasıl çalışabiliriz ? Laradock nedir ? vb. sorulara cevap arıyacağız ve nginx + php + mysql + phpmyadmin kullanarak örnek laravel projesi yapacağız."
keywords: laradock, docker, laravel, mysql, phpmyadmin, nginx, php, geliştirme ortamı, docker-compose, software, yazılım
image: /assets/posts/3/laradock.jpg
tags: [laradock, docker, laravel, mysql, phpmyadmin, nginx, php, geliştirme ortamı, docker-compose, software, yazılım]
categories: [docker]
---

**Yeni nesil geliştirme ortami** serimizin 3. bölümüne hoş geldiniz.
Bu bölümde konumuz "**Laradock**"

---

#### Laradock Nedir ?

**Laradock**, PHP ile uygulama geliştirmek için oluşturulmuş "Docker" altyapısı kullanan geliştirme ortamıdır. Adını her ne kadar " Laravel + Docker " kelimerinin ilk hecelerinden almış ve ilk çıkış amacı "Docker" ile "Laravel" geliştirme ortamı sunmak olsada. Zamanla Topluluğun desteğiyle Symfony, CodeIgniter WordPress, Drupal vb. diğer PHP projelerini destekler hale geldi.

---

#### Hem Tekli Hemde Çoklu Proje Örneği Yapalım

##### Laradock Kurulumu:

Öncelikle githubta ki laradock projesini bilgisayarımıza kopyalayalım ve içerisine girelim.
```bash
git clone https://github.com/Laradock/laradock.git
cd laradock
```
Daha sonra .env-example dosyasını .env ismiyle kopyalayalım.
```bash
cp env-example .env
```

[Tek proje örneği için buraya tıklayın ](#Tek-proje-örneği) 

[Çoklu proje örneği için  buraya tıklayın ](#çoklu-proje-örneği)

---

<!-- Nginx, varsayılan konfigürasyonun da "index.html" dosyasını, Laradock ".env" dosyasında "APP_CODE_PATH_HOST" değişkeni ile belirtilen yolun içerisinde ki public klasörü içerisinde arar. Laradock ".env" dosyasında yer alan "APP_CODE_PATH_HOST" değişkeninin değeri ../  -->

#### Tek Proje Örneği

Nginx servisini(Konteyner) bağımsız (detached) modda başlatalım.

```bash
# İlk defa çalıştırdığınızda bu kısım biraz uzun sürebilir.
docker-compose up -d nginx mysql
```

Laradock klasörünün bir üst dizinine geçelim ve aşağıda ki kodları çalıştıralım.

```bash
#public ismiyle klasör oluşturuyoruz.
mkdir public
#public klasörünün içerisine index.html ismiyle dosya oluşturuyoruz.
touch public/index.html
#index.html içerisine "<h1>Hello World</h1>" satırını ekliyoruz.
echo "<h1>Hello World</h1>" > public/index.html
```

Tarayıcımızdan http://localhost adresine gidelim.
![Laradock Tek Proje Örneği](/assets/posts/3/one-project-example.jpg)

Yukarıdaki çıktıyı aldıysak her şey yolunda demektir.

---

#### Laravel ile Çoklu Proje Örneği

<!-- Nginx, varsayılan konfigürasyonuna göz atalım. -->
Laradock klasörüne geçelim ve Laravel projemiz için gerekli olan Nginx ve Mysql servislerini bağımsız (detached) modda başlatalım.
```bash
# İlk defa çalıştırdığınızda bu kısım biraz uzun sürebilir.
docker-compose up -d nginx mysql
```
Nginx konfigürasyonlarının tanımlandığı klasöre 2 adet yeni konfigürasyon dosyası oluşturalım ve gerekli tanımlamaları yapalım.
```bash
touch nginx/sites/project1.conf
touch nginx/sites/project2.conf
```
**"laradock/nginx/sites/project1.conf"** dosyasının içerisine aşağıda ki tanımlamaları yapalım.
```nginx
server {

    listen 80;
    listen [::]:80;

    # For https
    # listen 443 ssl;
    # listen [::]:443 ssl ipv6only=on;
    # ssl_certificate /etc/nginx/ssl/default.crt;
    # ssl_certificate_key /etc/nginx/ssl/default.key;

    server_name project1.local;
    root /var/www/project1/public;
    index index.php index.html index.htm;

    location / {
         try_files $uri $uri/ /index.php$is_args$args;
    }

    location ~ \.php$ {
        try_files $uri /index.php =404;
        fastcgi_pass php-upstream;
        fastcgi_index index.php;
        fastcgi_buffers 16 16k;
        fastcgi_buffer_size 32k;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        #fixes timeouts
        fastcgi_read_timeout 600;
        include fastcgi_params;
    }

    location ~ /\.ht {
        deny all;
    }

    location /.well-known/acme-challenge/ {
        root /var/www/letsencrypt/;
        log_not_found off;
    }

    error_log /var/log/nginx/project1_error.log;
    access_log /var/log/nginx/project1_access.log;
}
```

**"laradock/nginx/sites/project2.conf"** dosyasının içerisine de aşağıda ki tanımlamaları yapalım.
```nginx
server {

    listen 80;
    listen [::]:80;

    # For https
    # listen 443 ssl;
    # listen [::]:443 ssl ipv6only=on;
    # ssl_certificate /etc/nginx/ssl/default.crt;
    # ssl_certificate_key /etc/nginx/ssl/default.key;

    server_name project2.local;
    root /var/www/project2/public;
    index index.php index.html index.htm;

    location / {
         try_files $uri $uri/ /index.php$is_args$args;
    }

    location ~ \.php$ {
        try_files $uri /index.php =404;
        fastcgi_pass php-upstream;
        fastcgi_index index.php;
        fastcgi_buffers 16 16k;
        fastcgi_buffer_size 32k;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        #fixes timeouts
        fastcgi_read_timeout 600;
        include fastcgi_params;
    }

    location ~ /\.ht {
        deny all;
    }

    location /.well-known/acme-challenge/ {
        root /var/www/letsencrypt/;
        log_not_found off;
    }

    error_log /var/log/nginx/project2_error.log;
    access_log /var/log/nginx/project2_access.log;
}
```

Yukarıda tanımlamış olduğumuz nginx konfigürasyonlarının, nginx tarafından tanınması için nginx servisimizi yeniden başlatalım.

```bash
# laradock klasörü içerisinde
docker-compose restart nginx
```

Tarayıcıdan http://project1.local adresinde gittiğimizde **"project1"** klasörü altındaki websitesini http://project2.local adresine gittiğimizde **"project2"** klasörü altındaki websitemizi getirmesi için.
"hosts" dosyasını düzenliyelim. Linux ' ta hosts dosyası "/etc" dizininde bulunurken windows ' ta  "C:\Windows\System32\drivers\etc\" dizininde bulunur.
İşletim sistemimize göre host dosyamızı bulduktan sonra içerisine aşağıdaki satırları ekliyelim.

```bash
127.0.0.1   project1.local
127.0.0.1   project2.local
```

Daha sonra "workspace" servisimizin (Konteyner) içerisine "laradock" kullanıcısı ile girelim.
```bash
docker-compose exec --user="laradock" workspace bash
```

workspace servisimizin içerisinde composer, git, node, npm vb. bir çok gerekli araç gereç bulunuyor. 
Laravel projelerimizi kurmak için workspace içerisinde ki Composer ' ı kullanacağız.
Workspace içerisindeyken aşağıdaki kodu çalıştıralım.
```bash
composer create-project --prefer-dist laravel/laravel project1
composer create-project --prefer-dist laravel/laravel project2
```

Tarayıcıdan **http://project1.local** ve **http://project.2.local** adreslerine gidelim.

![Laravel hoşgeldin sayfası - laradock örneği](/assets/posts/3/laravel-welcome-page.jpg)

Her iki adreste de yukardaki sayfa ile karşılaştıysak doğru yoldayız demektir.

---
#### Mysql

"project1" projesine **mysql** bağlantısı yapalım.

project1 klasörü içerisinde ki ".env" dosyasını açalım.
```bash
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=homestead
DB_USERNAME=homestead
DB_PASSWORD=secret
```
olan satırları aşağıdaki gibi değiştirelim.
```bash
DB_CONNECTION=mysql
DB_HOST=mysql
DB_PORT=3306
DB_DATABASE=default
DB_USERNAME=root
DB_PASSWORD=root
```
workspace servisimizin içerisindeyken aşağıda ki komutları çalıştıralım.

```bash
# project1 klasörü içerisine giriyoruz.
cd project1
php artisan migrate
php artisan make:auth
```
**http://project1.local/register** adresine gidelim ve gerekli alanları doldurarak kayıt işlemini gerçekleştirelim.
![laravel kayıt sayfası - laradock](/assets/posts/3/register.png)

kayıt olduktan sonra **http://project1.local/home** adresine yönlendirileceksiniz.
 
![laravel home - laradock](/assets/posts/3/home.png)

Yukarıda ki gibi bir sayfa ile karşılaştıysak kayıt işlemimiz başarıyla gerçekleşmiştir. 

Yaptığımız işlemleri veri tabanında görmek için **"PhpMyAdmin"** servisimizi başlatalım.

```bash
# laradock klasörü içerisinde iken
docker-compose up -d phpmyadmin
```

PhpMyAdmin ' e erişmek için  **http://localhost:8080/** adresine gidelim.

![Laradock - PhpMyAdmin](/assets/posts/3/phpyadmin.png)

Yukarıda ki gibi bir görüntü ile karşılaştıysak doğru yoldayız demektir.

| Sunucu | mysql |
| Kullanıcı Adı | root |
| Parola | root |

Gerekli alanları yukarıdaki tabloda verilen bilgilerle doldurup giriş yaplabiliriz.

Giriş yaptıktan sonra "default" veritabanının "users" tablosuna giderek kullanıcı kaydımızın gerçekleşip gerçekleşmediğini teyit edebiliriz.

![Laradock - PhpMyAdmin](/assets/posts/3/phpmyadmin-2.png)

Gördüğünüz gibi kayıt işlemimiz gerçekleşmiş. :)

---

> Not: Veri tabanı ayarlarını yaparken root kullanıcısının şifresinin neden root olduğunu vs. merak ediyorsanız. Laradock klasörü altında **".env"** dosyasını incelemenizi tavsiye ediyorum.
> Laradock hakkında daha detaylı bilgi için [laradock.io](http://laradock.io/) adresini ziyaret edebilirsiniz.

---

### Sonuç
"Yeni nesil geliştirme ortamı" serimizin 3. bölümünde konumuz Laradock ' tu. Bu bölümde 
Laradock nedir ? Nasıl kullanılır öğrenmiş olduk. Hem tekli hemde çoklu proje örnekleri ile öğrendiklerimizi pekiştirdik. 
Sizinde fark edeceğiniz üzere her yeni proje için, önce nginx konfigürasyonlarını ayarlıyoruz ve nginx servisimizi yeniden başlatıyoruz. Daha sonra etc dosyamızı düzenliyoruz. Son olarak da workspace servisimizin içerisine girip gerekli dosyaları composer vs. araçlar ile oluşturuyoruz. "Yeni nesil geliştirme ortamı" serimizin 4. bölümünde bu soruna değineceğiz ve bu işlemleri nasıl tek satır kod ile halledebileceğimizi öğreneceğiz. 4. bölümde görüşmek üzere.