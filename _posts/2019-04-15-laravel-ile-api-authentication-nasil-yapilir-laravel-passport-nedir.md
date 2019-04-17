---
layout: post
title:  "Laravel ile Api Authentication Nasıl Yapılır ? Laravel Passport Nedir ?"
description: "Bu makalede Laravel ile api kimlik doğrulaması (Authentication) nasıl yapılır ? Laravel Passport Nedir ? vb. sorulara cevap arıyacağız ve örnek bir uygulama yapacağız."
keywords: laravel, api, laravel Passport, authentication, kimlik doğrulama, laravel api authentication, postman, yazılım, software
image: /assets/posts/8/laravel-passpot-ile-authentication-nasil-yapilir.jpg
tags: [laravel, api, laravel Passport, authentication, kimlik doğrulama, laravel api authentication, postman, yazılım, software]
categories: [laravel, api, yazılım, software]
---

**Laravel ile api kimlik doğrulaması(authentication)** yapmak için bir çok farklı yöntem ve paket mevcut.
Bugün bu paketlerden, Laravel' in resmi paketi olan **Laravel Passport** paketi ile api kimlik doğrulama işlemini gerçekleştireceğiz.

Gereksinimler:
- Temel seviyede api bilgisi
- Temel seviyede php ve laravel bilgisi
- Php, Mysql ve Postman yüklü bilgisayar

*Apimizi test etmek için **Postman** kullanacağız. Eğer bilgisayarınızda Postman yoksa [burayı tıklayarak](https://www.getpostman.com/downloads/) indirebilirsiniz.*

---

<!-- #### Api Nedir ?
Günümüz projeleri, Masaüstü, Tarayıcı, Mobil vb. birden çok platforma çıkmakta. Her platforma ayrı özel uygulama geliştirmektense uygulamayı sunucu tarafı (server) ve kullanıcı tarafı (client) olarak 2 ye ayırıp. Tek bir sunucu taraflı uygulama (api) geliştirip diğer platformlara ise sadece kullanıcı taraflı uygulama geliştirerek bu sorunu çözmektedirler.

--- -->

#### Laravel Passport Nedir ?
Laravel ile yazdığımız apilerde kimlik doğrulaması(authentication) yapabilmemizi kolaylaştıran resmi laravel paketidir.

---

#### Laravel Passport Kullanarak Örnek Api Authentication Yapalım
Laravel kurulumunu gerçekleştirelim.
```bash
composer create-project --prefer-dist laravel/laravel api "5.8.*"
```
`Laravel Passport` paketinin kurulumunu yapalım.
```bash
composer require laravel/passport
```
> Not: Laravel 5.4 ve aşağısı için config/app.php providers kısmına " Laravel\Passport\PassportServiceProvider::class " ifadesini eklemeniz gerekmektedir. Laravel 5.5 ve üzeri sürümlerde buna gerek yoktur.

`.env` dosyasında veritabanı bağlantı ayarlarımızı yaptıktan sonra veritabanına tablolarımızı ekliyelim.
```bash
php artisan migrate
```

Uygulamamıza apiyi kullanacak kullanıcı (Client) ekliyelim.
```bash
php artisan passport:install
```
![php artisan passport:install komutu ile client ekleme örnek görüntüsü](/assets/posts/8/passport-install-client-ekleme.png)

**password grant** ile kimlik doğrulama işlemini gerçekleştireceğimiz için client id si 2 olan kullanıcı bilgilerini bir yere not edelim.


`App/User.php` içerisine `\Laravel\Passport\HasApiTokens` traitini ekliyoruz.
```php
use Laravel Passport HasApiTokens
```
`App/User.php` içeriği aşağıdaki gibi olmalıdır.
```php
#App/User.php 
namespace App;

use Illuminate\Notifications\Notifiable;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Passport\HasApiTokens;

class User extends Authenticatable
{
    use Notifiable, HasApiTokens;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'email', 'password',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];
}
```

`App/Providers/AuthServiceProvider.php` içerisinde ki `boot` methoduna `\Laravel\Passport\Passport::routes();` ifadesini ekliyoruz. 
Bu ifade ile **Laravel Passport** paketi içerisinde tanımlanan rotaları (route) uygulamamıza tanıtmış oluyoruz.

`config/auth.php` dosyasındaki api driver kısmını **passport** olarak ayarlıyoruz.

```php
    'guards' => [
        'web' => [
            'driver' => 'session',
            'provider' => 'users',
        ],
        'api' => [
            'driver' => 'passport',
            'provider' => 'users',
        ],
    ],
```
Laravel Tinker kullanarak uygulamamıza kullanıcı ekliyelim ve bilgilerini dilediğimiz bir yere not edelim.

Tinker ' a giriş yapalım.
```bash
php artisan tinker
```
Daha sonra aşağıdaki komut ile kullanıcı ekliyelim.

```php
App\User::create(['name' => 'deneme', 'email' => 'deneme@oguzcandemircan.com', 'password' => bcrypt('123456')]);
# exit komutunu kullanarak Tinker' dan çıkış yapabiliriz.
```

![Laravel Tinker kullanıcı ekleme örneği görütünsü](/assets/posts/8/tinker-ile-kullanici-ekleme.png)

Daha sonra postman ile **/oauth/token** adresine daha önceden not aldığımız bilgiler ile istek atalım. 
> Benim not aldığım bilgiler aşağıdaki tabloda ki gibidir. Sizde farklılık gösterebiliriz. Siz kendi not aldığınız bilgiler ile işlemi gerçekleştirin.

| Anahtar(Key) | Değer(Value) |
|----------|---------------|
| client_id |  2 |
| client_secret |    cenwr6FTzsnFRumMvuEuv2GMY3EeMVyZ2Hn0Pj9mSzAtered   |
| grant_type | password |
| username   | deneme@oguzcandemircan.com |
| password   | 123456

![postman oauth token isteği örnek görüntüsü](/assets/posts/8/postman-token-istegi.png)

Yukarıdaki resimde gördüğünüz gibi **/oauth/token** adresine istek attığımızda tipi **Bearer** olan bir **erişim anahtarı(access token)** döndü.

Bu erişim anahtarı ile **/api/user** adresine **Authorization** headerini ekleyip değerini de **Bearer {bir_önceki_istekten_dönen_erişim_anahtarı}** olarak ayarlayıp istek atalım.

![Laravel token ile kullanıcı bilgilerini getirme](/assets/posts/8/postman-token-ile-kullanici-bilgilerini-getirme.png)

Yukarıdaki resimde de gördüğümüz gibi **erişim anahtarı(access token)** ile **/api/user** adresine istek attığımızda kullanıcı bilgilerine eriştik.

---

Kaynaklar:
- [Laravel Passport](https://laravel.com/docs/5.8/passport){:target="_blank"}