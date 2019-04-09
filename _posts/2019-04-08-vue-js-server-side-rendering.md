---
layout: post
title: "Vue Js  ile  Express Kullanarak Server Side Rendering (SSR) Nasıl Yapılır ?"
description: "Bu makalede vue js ' ile express kullanarak serveride rendering (ssr) yapacağız. Server side sendering ve client side rendering nedir ? vb. sorulara cevap arıyacağız."
keywords: vue js ile server side rendering nasıl yapılır ?, vue js, server side rendering, ssr, express, vue server renderer, client side rendering
image: /assets/posts/6/vuejs-ssr.jpg
tags: [vue js, server side rendering, ssr, express, vue server renderer, client side rendering,]
categories: [vue js, server side rendering]
---

#### Client Side Rendering (CSR) Nedir ?
Client side rendering de sunucumuz tarayıcıya basit düz bir html sayfası döner. Daha sonra sunucumuzun döndüğü html sayfası kullanıcının tarayıcısında 
javascript ile derlenerek anlamlı bir html çıktısı elde edilir. Elde edilen html çıktısıda tarayıcı tarafından derlenerek kullanıcının kullanımına sunulur.

---

#### Server Side Rendering (SSR) Nedir ?
Server side rendering de ise ana içerik sunucumuzda derlenir ve tarayıcıya bitmiş bir html sayfası dönülür.

---

#### Örnek Uygulama yapalım.
Öncelikle **npm** kuralım
```bash
sudo apt install npm -y
```

Daha sonra vue-ssr ismiyle klasöür oluşturup içerisine girelim.
```bash
mkdir vue-ssr
cd vue-ssr
```

Yeni bir proje oluşturalım.
```bash
npm init
```
vue, express ve Vue Js ile server side rendering yapmak için `vue-server-renderer` paketlerini kuralım.
```bash
npm install vue vue-server-renderer express --save
```
{% raw %}
index.js ismiyle dosya oluşturalım ve içerisine aşağıdaki kodları yerleştirelim.
```js
// Gerekli tanımlamaları yapıyoruz.
const Vue = require('vue')
const server = require('express')()
const renderer = require('vue-server-renderer').createRenderer()

// " * " işareti ile tüm istekleri tek bir yerde topluyoruz.
server.get('*', (req, res) => {
  // Vue tanımlaması yapıyoruz.
  const app = new Vue({
    data: {
      languages: [ 'javascript', 'java', 'python', 'php'],
    },
    template:
    `
        <div>
            <ul>
                <li v-for="(language, index) in languages" v-bind:key="index">{{ language }}</li>
            </ul>
        </div>
    `
  })
  // renderToString fonksiyonuna tanımladığımız vue yu gönderiyoruz.
  renderer.renderToString(app, (err, html) => {
    // renderToString fonkisyonundan dönen html verisini ekrana yazdırıyoruz.
    res.end(`
      <!DOCTYPE html>
      <html lang="en">
        <head><title>Vue Js - Server Side Rendering(SSR) Örneği</title></head>
        <body>${html}</body>
      </html>
    `)
  })
})
// 8000 portundan websitemizi yayınlıyoruz.
server.listen(8000)
```
{% endraw %}

Yukarıdaki kodları biraz açıklamak gerekirse. Npm ile yüklediğimiz paketleri kullanabilmek için gerekli tanımlamaları yapıyoruz. Express ile tüm istekleri tek bir yerde topluyoruz (yönlendiriyoruz). İçerisinde programlama dillerini içeren bir dizi barındıran ve bu diziyi ekrana yazdıran basit bir vue tanımlaması yapıyoruz. `vue-server-renderer` paketi içerisinde yer alan `renderToString` fonksiyonuna tanımladığımız vue örneğini (instance) ve isimsiz bir fonksiyon gönderiyoruz. `renderToString` fonksiyonu gönderdiğimiz `Vue` örneğini (instance) renderlayıp bize **html** dönüyor. Dönen html verisini ekrana yazdırıyoruz ve 8000 portundan websitemizi yayınlıyoruz.

Okadar anlattık şimdi index.js dosyasını çalıştırıp sonucu görelim.
```bash
node index.js
```
Tarayıcımızdan `http://localhost:8000/` adresine gidelim ve kaynak kodunu görüntülüyelim.
![Vuejs server side rendering örneği](/assets/posts/6/vue-ssr-ornegi.png)

Kaynak kodunda `data-server-rendered="true"` etiketini görüyorsak **Vue JS ile server side rendering** işlemimiz başarı ile gerçekleşmiştir.