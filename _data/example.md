Laravel Echo Server — How To
============================

[![Go to the profile of Dennis Smink](https://cdn-images-1.medium.com/fit/c/50/50/1*PGE6MrUIkLLqOM7S0ITr5w.jpeg)](https://medium.com/@dennissmink?source=post_header_lockup)

[Dennis Smink](https://medium.com/@dennissmink)BlockedUnblockFollowFollowing

Jun 6, 2018

In my opinion, real-time apps are the future. Socket servers usually were not that easy to setup, but Laravel Echo Server changes this.

In this article, I’ll briefly show you how to quickly whip up a working socket server and broadcast events over the server. ([https://github.com/tlaverdure/laravel-echo-server](https://github.com/tlaverdure/laravel-echo-server), supported by Laravel’s docs: [https://laravel.com/docs/5.6/broadcasting#driver-prerequisites](https://laravel.com/docs/5.6/broadcasting#driver-prerequisites))

This is completely free, you only have to run the socket server yourself. You can also use pusher which is also integrated with Laravel by default, only downside is that this comes with limits, whenever you reach a limit you will have to pay. I like to be independent and host these things myself if I get the chance.

#### **Requirements:**

*   Laravel framework (Version 5.6 was used in this tutorial)
*   Redis server
*   Basic Laravel knowledge

#### **Installing laravel-echo-server**

To begin, we have to install the laravel-echo-server package globally, you can do so by executing this in your terminal.

$ npm install -g laravel-echo-server

When this is done, open up your Laravel application, or install a new one by doing:

$ composer create-project --prefer-dist laravel/laravel echo-test

Also install the predis package to we can use this in our application:

```bash
$ composer require predis/predis
```

Now when thats done, we have to initialize the socket server, make sure you are in your projects **root** directory:

$ laravel-echo-server init

This command will start asking you some questions about the configuration of your socket server, fill these in according to your installation:

![](https://cdn-images-1.medium.com/freeze/max/30/1*HLAGzaMi4Iux9LEmQW4Y0g.png?q=20)

![](https://cdn-images-1.medium.com/max/800/1*HLAGzaMi4Iux9LEmQW4Y0g.png)

![](https://cdn-images-1.medium.com/max/800/1*HLAGzaMi4Iux9LEmQW4Y0g.png)

**Remember whenever you use this in production, make sure to put your development mode off.**

We’ll give the server a first run to see if everything is OK:

```bash
$ laravel-echo-server start
```

Output should be something like this:

![](https://cdn-images-1.medium.com/freeze/max/30/1*WpI2HCk6_XYwNZ7AH-BIlQ.png?q=20)

![](https://cdn-images-1.medium.com/max/800/1*WpI2HCk6_XYwNZ7AH-BIlQ.png)

![](https://cdn-images-1.medium.com/max/800/1*WpI2HCk6_XYwNZ7AH-BIlQ.png)

#### **Configuring Laravel to work with Laravel Echo Server**

Open up your `config/app.php` file and uncomment the `BroadcastServiceProvider` in the providers array:

App\\Providers\\BroadcastServiceProvider::class,

This provider will enable the Broadcasting routes (which you may have seen inside `routes/channels.php` file)

Open up the `.env` file and change `BROADCAST_DRIVER` to your selected driver which you defined in the laravel-echo-server initialization (redis or log). In this tutorial we will be using the redis driver.  
Also change the `QUEUE_DRIVER` to any queue driver you like, in this case you can easily change this to redis because you already have this up and running.

Now we have to install the socket.io client and the laravel-echo package, you can install this by doing:

    $ npm install --save socket.io-client$ 

(It might be necessary to run `npm install` before running this to install Laravel mix and dependencies)

Next open up the `resources/assets/js/bootstrap.js` file, or the JS file where you hold all the base JS code. (In case for Laravel 5.7 or higher, the file can be found here: `resources/js/bootstrap.js` )

Now we’re gonna add the code that holds the base code for the Echo server:

import Echo from 'laravel-echo'  
  
**_window_**.io = require('socket.io-client');

    window.Echo = new Echo({    broadcaster: 'socket.io',    host: window.location.hostname + ':6001'}); 

We are now ready to start listening on channels! I’ll explain open channels in this tutorial, lets get started with listening on our first channel:

**_window_**.Echo.channel('test-event')  
    .listen('ExampleEvent', (e) => {  
        **_console_**.log(e);  
    });

We telling the JS code here; subscribe on the channel named ‘test-event’, and listen for ‘ExampleEvent’ (this is the class name from the event, you can customize this if you want).

Lets create this event class:

$ php artisan make:event ExampleEvent

This will create a new event class inside `App/Events` , which is named `ExampleEvent.php`

Lets tweak this event class so it will work with our socket server, firstly make sure your the event class implements the `ShouldBroadcast` interface, like this;

class ExampleEvent implements ShouldBroadcast

Now scroll down and change the `broadcastOn` function so we broadcast on the correct channel:

public function broadcastOn()  
{  
    return new Channel('test-event');  
}

Lets add another function below this so we can have some example data:

public function broadcastWith()  
{  
    return \[  
        'data' => 'key'  
    \];  
}

This function is called when the event is called, its the data that it will return to your socket server.

Now lets try this! Open up your `routes/web.php` file and add a test route:

Route::get('test-broadcast', function(){  
    broadcast(new \\App\\Events\\ExampleEvent);  
});

(There are multiple ways to broadcast the `ExampleEvent` class, in this case I am using the `broadcast()` helper that Laravel provides, in my opinion this is the cleanest way)

Start up a queue listener:

$ php artisan queue:listen --tries=1

Open up 1 tab with the JS file included (this could just be the Laravel ‘welcome’ scaffold page), so you are subscribed to the socket server.

Then open another tab and visit the `/test-broadcast` route, this will return a white page, but it will broadcast your `ExampleEvent` class to your socket server. You can see this in your terminal (in the other tab with the welcome page):

![](https://cdn-images-1.medium.com/max/800/1*tFiwX0FJUFgxNDBugQPJ8Q.png)

As you can see, the data came in our client this way. You can pass any data to the `ExampleEvent` class so you can broadcast this, this can be news updates, page updates, total viewing and much more.

Because we have development mode in the laravel-echo-server configuration, you can see all the basic information that is happening on the server:

![](https://cdn-images-1.medium.com/max/800/1*XS74jJNxrzrUuaALJDCbeA.png)

You now have a basic setup running for a socket server! But this is not all, there’s way more that you can do, like Private channels with authentication for a single user. (Like when you want to broadcast a order update, or private message)

To do this I advise you to go to the Laravel docs and fiddle around with this. There is really a lot you can do with this subject that makes your application really awesome. You can find the documentation over here:

[**Broadcasting - Laravel - The PHP Framework For Web Artisans**  
_Laravel - The PHP framework for web artisans._laravel.com](https://laravel.com/docs/5.6/broadcasting "https://laravel.com/docs/5.6/broadcasting")[](https://laravel.com/docs/5.6/broadcasting)

#### **Extra: Running in production**

Like I said before, make sure you disable development mode inside the `laravel-echo-server.json` configuration file. You also might want to gitignore this file and init it on the server itself, because the host might differ from what you have locally.

You also need something to keep the socket server running on your production server, you could use Supervisor to do this, but what I usually do is use _PM2_ for this kind of things, it makes managing these servers really easy and fast. ([http://pm2.keymetrics.io/](http://pm2.keymetrics.io/))

I’ll share my really basic socket.sh script here to run with _PM2:_

**#!/usr/bin/env bash  
  
**_laravel-echo-server_ start

When you have installed _PM2_, you can just do `pm2 start socket.sh` , this will start the script and thus the socket server.

I hope this script was of any use for you, I have just written out the basics and I might continue in another article about the authenticated broadcast routes, and different broadcasting channels.

Thank you for reading!

_Note: please bare in mind that I am a Dutch developer, English is not my native language so this article could contain any grammatical errors._