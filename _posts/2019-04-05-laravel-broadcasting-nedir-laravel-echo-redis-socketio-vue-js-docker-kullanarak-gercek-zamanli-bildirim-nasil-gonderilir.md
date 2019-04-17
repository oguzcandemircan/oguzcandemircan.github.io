---
layout: post
title: "Laravel Broadcasting Nedir ? Laravel Echo + Redis + Socket.io + Vue JS + Docker Kullanarak Gerçek Zamanlı Bildirim Nasıl Gönderilir ?"
description: "Bu makalede Laravel Broadcasting, Echo, Redis, Vue Js  nedir ? vb. sorulara cevap arıyoruz ve Laravel Echo + Redis + Socket.io + Vue JS + Docker kullanarak gerçek zamanlı (realtime) bildirim uygulaması yapıyoruz."
keywords: laravel, laravel broadcasting, docker, redis, socket.io, laravel echo, web socket, gerçek zamanlı bildirim, gerçek zamanlı uygulamalar , software, yazılım, real time
image: /assets/posts/5/main.jpg
tags: [laravel, laravel broadcasting, docker, redis, socket.io, laravel echo, web socket, gerçek zamanlı bildirim, gerçek zamanlı uygulamalar , software, yazılım, real time]
categories: [laravel, laravel broadcasting, docker, redis, socket.io, laravel echo, web socket, gerçek zamanlı bildirim, gerçek zamanlı uygulamalar , software, yazılım, real time]
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
En basit haliyle Redis, **anahtar-değer( key-value )** şeklinde tasarlanmış bir NoSQL veritabanıdır. Memcache benzeri verileri sabit diske yazmadan **ram** üzerinde tutarak veriye erişim hızını arttırmayı amaçlayan teknolojidir. Redis' in Memcahe' den farkı NoSql mantığı ile çalıştığı için sunucu kapansa dahi verilerin kaybolmasını önler.

---

#### Vue Js Nedir ?
Modern web arayüzleri oluşturmak için kullanılan Javascript kütüphanesidir. 

---

#### Basit Gerçek Zamanlı Bildirim Gönderen Uygulama Yapalım

Sıfırdan redis vs. kurulumu ile uğraşmamak için docker kullanarak yapmayı tercih ediyorum.

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
composer create-project --prefer-dist laravel/laravel laravel
```
laravel klasörü içerisindeki dosyaları bir üst dizine taşıyalım.
```bash
mv laravel/* .
```

Laravel ile redis kullanabilmemiz için **predis** paketini kuralım.
```bash
composer require predis/predis
```

*"config/app.php"* dosyasını açın providers(sağlayıcılar) dizisi içerisinde ki **App\Providers\BroadcastServiceProvider::class** yorum satırı olmaktan kurtarın.

Bu sağlayıcı *"routes/channels.php"* dosyası içerisinde tanımlanan yayınlama(broadcasting) rotalarını (route) etkinleştirecektir.
```php
App\Providers\BroadcastServiceProvider::class,
```

".env" dosyasını oluşturalım.
```bash
touch .env
```
Ve gerekli tanımlamaları yapalım.
```bash
APP_NAME=broadcasting
APP_ENV=local
APP_KEY=base64:Imv6pjPkcuVgNOiiKnEEq8IbdskDOCZnLWkVjzp4QCA=
APP_DEBUG=true
APP_URL=http://broadcasting.local

LOG_CHANNEL=stack

DB_CONNECTION=mysql
DB_HOST=mysql
DB_PORT=3306
DB_DATABASE=default
DB_USERNAME=root
DB_PASSWORD=root

BROADCAST_DRIVER=redis
CACHE_DRIVER=file
QUEUE_CONNECTION=sync
SESSION_DRIVER=file
SESSION_LIFETIME=120

REDIS_HOST=redis
REDIS_PASSWORD=null
REDIS_PORT=6379

MAIL_DRIVER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_ENCRYPTION=null

PUSHER_APP_ID=
PUSHER_APP_KEY=
PUSHER_APP_SECRET=
PUSHER_APP_CLUSTER=mt1

MIX_PUSHER_APP_KEY="${PUSHER_APP_KEY}"
MIX_PUSHER_APP_CLUSTER="${PUSHER_APP_CLUSTER}"
```

Yeni bir **etkinlik(Event)** oluşturalım.
```bash
php artisan make:event NotificationEvent
```
Yukarıdaki kod ile App\Events dizini altında `NotificationEvent.php` ismiyle bir dosya oluştu.
Oluşturduğumuz etklinliği yayınlayabilmek için etkinliğimiz `ShouldBroadcast` sınıfını uygulaması (implement) gerekmetedir.

Satırını
```php
class NotificationEvent
```
Aşağıdaki şekilde değiştirelim.
```php
class NotificationEvent implements ShouldBroadcast
```
Satırını
```php
return new PrivateChannel('channel-name');
```
Aşağıdaki şekilde değiştirerek. Kanalımızı herkese açalım ve isimlendirelim.
```php
return new Channel('notification-event');
```

`broadcastWith` methodu ile kanalımıza veri gönderebiliriz. Aşağıdaki satırları ekleyerek `notification-event` kanalımıza veri gönderelim.
```php
public function broadcastWith()
{
    return [
        'title' => 'Bildirim başlığı',
        'message' => 'Bildirim mesajı',
    ];
}
```

**App\Events\NotificationEvent.php** dosyasının son hali aşağıdaki gibi olmalıdır.
```php
<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Queue\SerializesModels;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class NotificationEvent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return \Illuminate\Broadcasting\Channel|array
     */
    public function broadcastOn()
    {
        return new Channel('notification-event');
    }

    public function broadcastWith()
    {
        return [
            'title' => 'Bildirim başlığı',
            'message' => 'Bildirim mesajı',
        ];
    }
}
```

Etkinliklerimizi yayınlamak için `broadcast()` yardımcı(helper) methodundan yararlanabiliriz.
Test için "add-notification" ismi ile rota oluşturup. `broadcast()` yardımcı methodu ile etkinliğimizi yayınlıyalım.
**Routes/web.php** içerisine aşağıdaki rota(route) tanımlamasını yapalım.
```php
Route::get('add-notification', function() {
    broadcast(new \App\Events\NotificationEvent);
    return 'Bildirim Gönderildi.';
});
```
`resouces/views/welcome.blade.php` dosyasında body etkiketi(tag) içerisini aşağıdaki kodları yerleştirelim.
```html
<div id="app">
        <example-component></example-component>
    </div>
<script src="/js/app.js"></script>
```

Javascript bağımlılıklarını (paketleri) yükleyelim.
```bash
npm install
npm install --save socket.io-client
npm install --save laravel-echo
```

**"resources/js/bootstrap.js"** dosyasını açın, en alt satırına aşağıdaki kodu yerleştirin.
```js
import Echo from 'laravel-echo'

window.io = require('socket.io-client');
window.Echo = new Echo({
    broadcaster: 'socket.io',
    host: window.location.hostname + ':6001'
}); 
```
> not: bootstrap.js dosyası Laravel 5.6 ve daha alt sürümlerde resources/assets/js/bootstrap.js dizininde bulunur.

**"resources/js/components/ExampleComponent.vue"** dosyasının içerisindeki mounted methodunun içerisine aşağıdaki kodu yerleştirin.
```js
window.Echo.channel('notification-event')
.listen('NotificationEvent', (e) => {
    alert(`title: ${e.title} , message: ${e.message}`)
});
```

Yukarıdaki satırları biraz açıklamak gerekirse `channel` methodu ile `notification-event` kanalına gelen `NotificationEvent` etkinliğini `listen` method ile dinliyoruz. `NotificationEvent` eklinliğinden gelen verileri de alert ile yazdırıyoruz.

**"resources/js/components/ExampleComponent.vue"** dosyasının son hali aşağıdaki gibi olmadıdır.
```html
<template>
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-8">
                <div class="card">
                    <div class="card-header">Example Component</div>

                    <div class="card-body">
                        I'm an example component.
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        mounted() {
            console.log('Component mounted.')
            window.Echo.channel('notification-event')
            .listen('NotificationEvent', (e) => {
                alert(`title: ${e.title} , message ${e.message}`)
            });
        }
    }
</script>
```

Javascript tarafında yaptığımız değişikliklerin derlenmesi için aşağıdaki kodu çalıştıralım.
```bash
npm run dev
```
Tarayıcıdan `http://localhost` adresine gidelim. Daha sonra Yeni bir sekme açarak `http://localhost/add-notification` adresine gidelim.
![laravel add notification](/assets/posts/5/add-notification.png)
 `http://localhost` adresine geri dönelim.

![laravel broadcasting - bildirim örneği](/assets/posts/5/notification-example.png)

Yukarıdaki çıktıyı aldıysanız her şey yolunda demektir.

---

#### Sonuç
Laravel Broadcasting, Echo, Redis, Vue Js  nedir ? vb. sorulara cevap aradık. Basit gerçek zamanlı bildirim(notification) uygulaması ile öğrendiklerimizi pekiştirdik. 

Daha detaylı bilgi için [Laravel](https://laravel.com/docs/5.8/broadcasting#presence-channels){:target="_blank"}  Dökümantasyonunu ziyaret edebilirsiniz.

Kaynak kodlarını [Github](https://github.com/oguzcandemircan/Laravel-Broadcasting-Real-Time-Notification-App){:target="_blank"} ' da bulabilirsiniz.

Makaleyi oluştururken yararlandığım [Kaynak](https://medium.com/@dennissmink/laravel-echo-server-how-to-24d5778ece8b){:target="_blank"}

---