WTF - UAH
=======

**W**eb **T**imeout **F**riend for **UAH**!

Strike back against *hapless bullshit*! This firefox extension nullifies the mere minutes-long session for UAH's banner service. Go get actual work done without being logged out for absolutely no reason \o/

### To Install

Right now you must download wtf_uah.xpi and install manually; to do so:

* Download wtf_uah.xpi
* Type 'about:addons' into the URL bar, hit enter
* At the top of the add-ons page, click menu -> "Install add-on from file"
* Select wtf_uah.xpi, restart firefox, go get werk done!

### FAQ

###### I lied, nobody asks me anything, much less *frequently*.

#### Why not just ask UAH to fix these glaring issues?

Because I'm confident that UAH either won't or can't. Most of the web services are purchased with squandered funds, which means that students are locked from making valuable contributions to the source code. This is typicall of most schools, I suppose, but that does not make such bullshit OK.

There's *also* the small problem: UAH should already be aware. I'm not going to insult them be asking why student's are punished for their poor decisions. And consider this: if someone at UAH asks the company that writes Banner to fix the issue, and banner (because it's still shit, but with a longer session life now to brute force) gets owned, won't it look like my fault?

#### Why is your app complete shit?

You know what? I really considered making a beautiful javascript application. I was going to listen for log in, log out, and appropriately match keepalive calls to make the session persist. Then I realised that fighting bullshit with fire, while smelly, is way more fun. This program doesn't care if you're currently logged in or not, it will contact UAH every few minutes with a keep alive request regardless.

#### What if I want to make your app *not* complete shit?

Pull requests welcome. You may also email me at csb0019@uah.edu, the more people who use this app, the more likely I am to actually maintain it.











