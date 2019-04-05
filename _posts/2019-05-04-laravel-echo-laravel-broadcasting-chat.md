---
layout: post
title: "Laravel Echo + Redis + Laravel Broadcasting"
description: "Yeni nesil geliştirme ortami serimizin 3. bölümüne hoş geldiniz.
Bu bölümde konumuz Laradock. Laradock ile tekli ve çoklu projeler üzerinde nasıl çalışabiliriz ? Laradock nedir ? vb. sorulara cevap arıyacağız ve nginx + php + mysql + phpmyadmin kullanarak örnek laravel projesi yapacağız."
keywords: laradock, docker, laravel, mysql, phpmyadmin, nginx, php, geliştirme ortamı, docker-compose, software, yazılım
image: /assets/posts/5/main.jpg
tags: [laradock, docker, laravel, mysql, phpmyadmin, nginx, php, geliştirme ortamı, docker-compose, software, yazılım]
categories: [docker]
---

Günümüzde birçok modern web uygulaması kullanıcı deneyimini en üst seviyeye çıkartmak için **"gerçek zamanlı (real time)"** güncellenen arayüzler kullanır.
Gerçek zamanlı arayüzler oluşturmak için ise **"WebSoket (WebSocket)"** teknolojisinden yararlanırlar.

Bu tür uygulamaları oluşturmamıza yardımcı olmak için Laravel, **"Brodcasting"** servisini oluşturdu. Bu servis, sunucu tarafında (sever side) oluşan değişiklikleri WebSoket ile  ön yüze (frontend) aktarmayı kolaylaştırdı. 

----

#### Laravel Broadcasting Nedir ?
Laravel Broadcasting, Laravel etkinliklerinizi (Events) yayınlamak, aynı etkinlik adlarını sunucu taraflı kodunuz ve istemci taraflı JavaScript uygulamanız arasında paylaşmanıza olanak sağlayan servistir.

---

#### Laravel Echo Nedir ?
**Laravel Echo**, Laravel tarafından oluşturulan **kanallara(channels)** abone olmayı ve Laravel tarafından yayınlanan **etkinlikleri (Events)** dinlemeyi kolaylaştıran bir JavaScript kütüphanesidir.

---

#### Redis Nedir ?
En basit haliyle Redis, key-value şeklinde tasarlanmış bir NoSQL veritabanıdır. Memcache gibi verileri HDD yazmadan Ram üzerinde tutmaya yarayan bir platformdur. Memcaheden farklı olarak NoSql mantığıyla çalıştığı için serverin kapansa dahi verilerin kaybolmasına izin vermez.

---

#### Vue Js Nedir ?
Modern web arayüzleri oluşturmak için kullanılan Javascript kütüphanesidir.

---

#### Basit Bir Sohbet Uygulaması Yapalım.

Yeni bir klasör oluşturup içerisine laradock projesini dahil edelim.
```bash
mkdir broadcasting
cd broadcasting
git clone https://github.com/Laradock/laradock.git
```
laradock klasörüne içerisinde ki env-example dosyasını ".env" olarak kopyalayalım.
```bash
cd laradock
cp env-example .env
```

Gerekli servisleri başlatalım.
```bash
docker-compose up -d nginx mysql laravel-echo-server redis
```
> Not : Laradock ' u ilk defa çalıştırdığınızda bu kısım biraz uzun sürebilir

Workspace konteynerımızın(container) içerisine girelim.
```bash
docker-compose exec --user="laradock" workspace bash
```
yeni bir laravel projesi oluşturalım.

```bash
composer create-project --prefer-dist laravel/laravel blog
```

Javascript bağımlılıklarını (paketleri) yükleyelim.
```bash
npm install
```

Javascript tarafında yaptığımız değişikliklerin derlenmesi için aşağıdaki kodu çalıştıralım.
```bash
npm run dev
```

#### Broadcast Data
Bir etkinlik yayınlandığında, genel özelliklerinin tümü otomatik olarak serileştirilir ve etkinliğin yükü olarak yayınlanır, böylece genel verilerinize JavaScript uygulamanızdan erişebilirsiniz. Dolayısıyla, örneğin, etkinliğinizin Eloquent modeli içeren tek bir ortak $ user özelliği varsa, etkinliğin yayın yükü

```json
{
    "user": {
        "id": 1,
        "name": "Patrick Stewart"
        ...
    }
}
```

Ancak, yayın yükünüz üzerinde daha hassas kontrol sahibi olmak istiyorsanız, etkinliğinize broadcastWith yöntemini ekleyebilirsiniz. Bu yöntem, etkinlik yükü olarak yayınlamak istediğiniz veri dizisini döndürmelidir:

```php
/**
 * Get the data to broadcast.
 *
 * @return array
 */
public function broadcastWith()
{
    return ['id' => $this->user->id];
}
```


#### Broadcast Name
Varsayılan olarak, Laravel olayı sınıfın adını kullanarak etkinliği yayınlar. Bununla birlikte, etkinlik üzerinde broadcastAs yöntemini tanımlayarak yayın adını özelleştirebilirsiniz

```php
/**
 * The event's broadcast name.
 *
 * @return string
 */
public function broadcastAs()
{
    return 'istediniz_herhangi_bir_isim';
}
```

#### Broadcast Conditions
Bazen etkinliğinizi yalnızca belirli bir koşul geçerli olduğunda yayınlamak istersiniz. Bu koşulu, olay sınıfınıza bir broadcastWhen yöntemi ekleyerek tanımlayabilirsiniz.

```php
/**
 * Determine if this event should broadcast.
 *
 * @return bool
 */
public function broadcastWhen()
{
    return $this->value > 100;
}
```

#### Authorizing Channels
Özel kanallar, o anda doğrulanmış kullanıcının gerçekte kanalı dinleyebileceğini onaylamanızı gerektirir. Bu, Laravel uygulamanıza kanal adıyla bir HTTP isteği yaparak ve uygulamanızın kullanıcının bu kanalı dinleyip dinleyemeyeceğini belirlemesine izin vererek gerçekleştirilir. Laravel Echo kullanırken, özel kanallara abonelikleri yetkilendirme HTTP isteği otomatik olarak yapılacaktır; Ancak, bu isteklere cevap vermek için uygun yolları tanımlamanız gerekir.


```php
use App\Order;

Broadcast::channel('order.{order}', function ($user, Order $order) {
    return $user->id === $order->user_id;
});
```