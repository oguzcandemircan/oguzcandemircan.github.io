---
layout: post
title:  "Laravel Queue Nedir ? Laravel Queue Nasıl Yapılır ?"
description: "Bu makalede Laravel ile api authentication (kimlik doğrulaması) nasıl yapılır ? Laravel Passport Nedir ? vb. sorulara cevap arıyacağız ve örnek bir uygulama geliştireceğiz."
keywords: laravel, queue, laravel queue, laravel kuyruklama
image: /assets/posts/8/laravel-passpot-ile-authentication-nasil-yapilir.jpg
tags: [laravel, queue, laravel queue, laravel kuyruklama]
categories: [laravel]
---

#### Laravel Queue Nedir ?
Laravel Queue, e-posta göndermek vb. gibi zaman alıcı bir görevin işlenmesini daha sonra işlenmek üzere ertelemenizi sağlayan yapıdır. Bu zaman alıcı görevlerin ertelenmesi, uygulamanıza yapılan web isteklerini büyük ölçüde hızlandırır. Laravel Queue (Kuyruklama / Sıralama), Beanstalk, Amazon SQS, Redis ve hatta ilişkisel bir veritabanı gibi çeşitli kuyruk arka uçlarında birleşik bir API sağlar.

---

#### Laravel Jobs Nedir ?
Laravel Jobs, uygulamamızın normalden farklı, özel olarak yapmasını istediğimiz işlerin, görevlerin tanımlandığı sınıf (class) yapısıdır. Laravel Jobs ile uygulamamızın yaptığı işleri ayrı ayrı tanımlayıp Laravel Queue ile de sıraya sokarak dilediğimiz bir zamanda yaptırabiliriz.

---

#### Sorun Yaratalım / Neden Kullanalım ?
Örnek vermek gerekirse bir sosyal medya uygulamamız var. Bir kullanıcı yeni bir gönderi oluşturduğunda tüm takipçilerine e-posta (e-mail) göndermek istiyorsunuz. Kullanıcının 1000 takipçisi olduğunu farz edersek. Kullanıcı gönderiyi paylaş butonuna bastıktan sonra 1000 adet e-postanın takipçilerine ulaşmasını beklemek zorunda. Zamanın çok önemli olduğu bir çağda kullanıcıyı o kadar süre bekletmek istemezsiniz. Bekletmek isteseniz bile muhtemelen zaman aşımı (timeout) hatası ile karşılaşacaksınız :). İşte tamda burda çözüm olarak devreye **Laravel Queue** giriyor. 

---

>Not: Laravel Jobs ile yapılacak bir iş / görev tanımlayıp daha sonra Laravel Queue ile de bu işleri, bir işlem kuyruğuna ekleyip istediğimiz bir zamanda sırayla yaptırabiliyoruz.

---

#### Yarattığımız Sorunu Çözelim
Örneğimiz üzerinden devam edersek, sorunumuz kullanıcı bir gönderi paylaştığında, kullanıcının tüm takipçilerine e-posta gönderirken kullacının takipçilerinin çok olması sebebiyle zaman aşımı (timeout) hatası ile karşılaşmamız. Peki **Laravel Jobs** ve **Laravel Queue** bu ile sorunu nasıl çözeriz ?


Kurulumları anlatıp uzun olan bir makaleyi daha da uzatmamak için örneği docker üzerinden vereceğim. 

Yeni klasör oluşturup içerisine de **Laradock** projesini dahil edelim.
```bash
mkdir Laravel-Queue
cd Laravel-Queue
git clone https://github.com/Laradock/laradock.git
```
>Laradock hakkında herhangi bir bilginiz yok ise [Yeni Nesil Geliştirme Ortamı Docker Serisinin 3. Bölümünde Laradock](yeni-nesil-gelistirme-ortami-bolum-3-laradock)' tan bahsettim okuyabilirsiniz. 

Laradock klasörüne içerisinde ki env-example dosyasını “.env” olarak kopyalayalım.
```bash
cd laradock
cp env-example .env
```
Gerekli servisleri(konteyner) başlatalım.
```bash
docker-compose up -d nginx mysql
```
>Not : Laradock ‘ u ilk defa çalıştırdığınızda bu kısım biraz uzun sürebilir

Workspace servisimizin içerisine "laradock" kullanıcısı ile girelim.
```bash
docker-compose exec --user="laradock" workspace bash
```

Yeni Laravel projesi oluşturalım.
```bash
composer create-project --prefer-dist laravel/laravel laravel "5.8"
```
laravel klasörü içerisindeki dosyaları bir üst dizine taşıyalım.
```bash
mv laravel/{.,}* ./
```

veritabanı ayarlarımızı yapalım.
```bash
#.env
...
DB_CONNECTION=mysql
DB_HOST=mysql
DB_PORT=3306
DB_DATABASE=default
DB_USERNAME=root
DB_PASSWORD=root
...
```
`QUEUE_CONNECTION` "database" olarak ayarlıyalım.
```bash
#.env
...
QUEUE_CONNECTION=database
...
```

<!-- `routes/web.php` içersine aşağıdaki kodları ekliyelim.

```php
Route::get('share-post', function() {
    Post::create([
        'title' => 'başlık',
        'content' => 'içerik'
    ]);

    foreach(User::find(1)->followers as $follower) {
        new Mail($follower);
    }
});
``` -->

Artisan komutları ile **Job (İş / Görev)** oluşturalım.
```bash
php artisan make:job SendEmail
```
Yukarıda ki komut ile  `app\Jobs` dizini altında  `SendEmail` ismiyile bir job (iş/görev) oluşmuş oldu.
SendEmail.php içerisine de ki `handle` methodtuna aşağıdaki komutları yerleştirelim.
```php
#app\Jobs\SendEmail.php
...
    public function handle()
    {   
        # e-posta göndermek yerine 1 saniye gecikme ekliyoruz.
        sleep(1);
    }
...

```


`routes\web.php` içerisine de aşağıdaki komutları yerleştirelim.
```php

Route::get('share-post', function() {
   /**
    * Post Oluşturma vb. diğer işlemler
    */
    for ($i=0; $i < 10; $i++) {
        # e-posta göndermek yerine 1 saniye gecikme ekliyoruz.
        sleep(1); 
    }

    return 'Gönderiniz yayınlandı';
});

Route::get('share-post-with-queue', function() {
    /**
    * Post Oluşturma vb. diğer işlemler
    */
    for ($i=0; $i < 10; $i++) { 
        App\Jobs\SendMail::dispatch();
    }

    return 'Gönderiniz yayınlandı.';
});
```
> E-posta ayarları ile uğraşmamak için, e-posta göndermek yerine `sleep()` methodu ile 1 saniye gecikme ekliyoruz. Siz dilerseniz e-posta ayarlarını yapılandırıp e-posta gönderebilirsiniz.

Tarayıcıda 2 sekme veya pencere açarak birinden **[localhost/share-post](http://localhost/share-post){:target="_blank" rel="nofollow"}** adresine, diğerinde de **[localhost/share-post-with-queue](http://localhost/share-post-with-queue){:target="_blank" rel="nofollow"}** adresine istek atalım.


**[localhost/share-post](http://localhost/share-post){:target="_blank" rel="nofollow"}** adresine attığınız istek ekrana 10 saniye sonra "Gönderiniz yayınlandı" çıktısını verirken, **[localhost/share-post-with-queue](http://localhost/share-post-with-queue){:target="_blank" rel="nofollow"}** adresine attığınız istek ekrana direk "Gönderiniz yayınlandı" çıktısını verecektir. 

Bunun sebebi "share-post" rotası(route) sleep(1) işlemini siz butona basar basmaz gerçekleştirirken, "share-post-with-queue" rotası siz istek yaptıktan sonra veritabanında ki **jobs** tablosuna daha sonra gerçekleştirilmek üzere 10 adet `SendMail` görevi ekler ve direk ekrana "Gönderiniz yayınlandı sonucunu basar".

Veritabanına eklenen görevlerin gerçekleştirilmesi için terminalden `php artisan queue:work` komutu çalıştırılmalıdır. `php artisan queue:work` komutu ile birlikte **Laravel Queue**, **jobs** tablosundan daha önce eklenmiş ve gerçekleştirme zamanı gelmiş olan görevleri çeker. `handle` methodu içerisine yazılmış olan işlemleri sırayla gerçekleştirir.

> Not: `php artisan queue:work` komutunu çalıştırmadan önce veritabanında "jobs" tablosuna bakarsanız. 10 adet kayıt göreceksiniz. `php artisan queue:work` komutu çalıştırdığınızda sırayla işler gerçekleştirilecek ve kayıtlar tablodan silinecektir.


Biraz karmaşık bir konu olduğu için daha rahat anlaşılması için küçük bir video hazırladım.
<video autoplay loop controls>
  <source src="/assets/posts/9/laravel-queue-example.mp4" type="video/mp4" />
  Your browser does not support the video tag.
</video>

> Video üzerine tıklayarak daha net bir şekilde videoyu görüntüleyebilirsiniz.

Örneği veritabanı üzerinden vermemin sebebi phpmyadmin vb. ile kolayca jobs tablosuna gidip olan biteni izlemeniz içindi. Ama gelin görünki gerçek hayatta bu tarz uygulamalar için ilişkisel veritabanları biraz hantal kalıyor, dolayısı ile redis vb. teknolojilere ihtiyaç duyuyoruz. Laravel, **Beanstalk**, **Amazon SQS**, **Redis** vb. teknolojilere tam destek sağlıyor. Biz genellikle tercih edilen **Redis** üzerinden devam edelim. 

Laravel ile Redis kullanabilmemiz için "predis" paketini kuralım.
```bash
composer require predis/predis
```
Redis ayarlarını yapınlandıralım.
```bash
#.env
...
REDIS_HOST=redis
REDIS_PASSWORD=null
REDIS_PORT=6379
...
```


`QUEUE_CONNECTION` "redis" olarak ayarlıyalım.
```bash
#.env
...
QUEUE_CONNECTION=redis
...
```
Redis servisimizi ayağa kaldıralım.
```bash
docker-compose up -d redis
```

Redis yapılandırması ve entegrasyonu Bu kadar basit :)


#### Laravel Queue Gecikme (Delay)
İşlerinize gecikme ekleme isterseniz. `delay()` methodunuz kullanabilirsiniz.
```php
App\Jobs\SendMail::dispatch()->delay(now()->addMinutes(1));
```