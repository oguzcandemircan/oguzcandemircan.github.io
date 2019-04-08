---
layout: post
title: "Vue Js  ile  Express Kullanarak Serverside Rendering (SSR) Nasıl Yapılır ?"
description: "Bu makalede vue js ' ile express kullanarak serveride rendering (ssr) yapacağız."
keywords: 
image: /assets/posts/6/vuejs-ssr.jpg
tags: [vue js, 'ssr']
categories: ['Vue Js']
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
Gerekli paketleri kuralım.
```bash
npm install vue vue-server-renderer express --save
```
{% raw %}
index.js ismiyle dosya oluşturalım ve içerisine aşağıdaki kodları yerleştirelim.
```js
const Vue = require('vue')
const server = require('express')()
const renderer = require('vue-server-renderer').createRenderer()

server.get('*', (req, res) => {
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

  renderer.renderToString(app, (err, html) => {
    if (err) {
        console.log(err);
      res.status(500).end('Internal Server Error')
      return
    }
    res.end(`
      <!DOCTYPE html>
      <html lang="en">
        <head><title>Hello</title></head>
        <body>${html}</body>
      </html>
    `)
  })
})

server.listen(8000)

```
{% endraw %}
index.js dosyasını çalıştıralım.
```bash
node index.js
```
Tarayıcımızdan `http://localhost:8000/` adresine gidelim ve kaynak kodunu görüntülüyelim.
![Vuejs server side rendering örneği](/assets/posts/6/vue-ssr-ornegi.png)