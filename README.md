WTF - UAH
=======

**W**eb **T**imeout **F**riend for **UAH**!

Strike back against *hapless bullshit*! This firefox extension nullifies the mere minutes-long session for UAH's *Banner* and *Canvas* services. Go get actual work done without being logged out for absolutely no reason \o/

### Usage

This browser extension keeps you logged in to register.uah.edu and canvas.uah.edu for as long as your browser is open. Now you may do real work (like read a pdf on ~~Angel~~ I mean, Canvas?) without being logged out due to inactivity.

This app doesn't work if your browser is closed or you put your computer into standby, sorry.

### Install

*Update:*
You may now get the add-on from mozilla's site! (I think...)
https://addons.mozilla.org/en-US/firefox/addon/wtf-uah/

To install manually:

* Download wtf_uah.xpi (you may ignore all other files in this git)
* Type 'about:addons' into the URL bar, hit enter
* At the top of the add-ons page, click menu -> "Install add-on from file"
* Select wtf_uah.xpi, restart firefox, go get werk done!

### FAQ

###### I lied, nobody asks me anything, much less *frequently*.

#### Why not just ask UAH to fix these glaring issues?

Because I'm confident that UAH either won't or can't. Most of the web services are purchased with squandered funds, which means that students are locked from making valuable contributions to the source code. This is typical of most schools, I suppose, but idiocy en masse is still not OK.

*Also*, UAH should already be aware. I'm not going to insult them be asking why students are punished for poor decisions. And consider this: if someone at UAH asks the company that *"maintains"* Banner to fix the issue, and Banner (because its still shit, but with a longer session life now to brute force) gets pwned, won't it look like my fault?

#### Wait, all this does is extend my session?

Erm, well, for now: yes. Being logged out while studying has got to be the most inconsiderate nonsense I can imagine. Unfotunately, I'm late in creating this program, as the closed-source Angel software is decrepit and has 'forced' the university to pay more money for a new system, called "Canvas". And while I hope this newfangled "Canvas" improves the already-quite-low bar, it's a shame to see money wasted like this. I fully intend to bake my extension into Canvas later on.

If the app is found useful, I'm considering including some other features, such as registration code autocompletion, revamped CSS, and maybe tie the whole thing into my other UAH bullshit-away software: Chevaline Delta.

#### Watch out for multiple browser gridlock

*Log out after you're done with Banner, or it'll bite you.*

This isn't a problem with my Firefox extension (surprise surprise). In fact, you can test it right now, without wtf-uah. Go to a computer and log in to banner, this is an "authentic" access, right? Go to another computer and log into banner again. Refresh both pages and watch the system take a shit. On your original, "authentic" machine, you've been logged out with an error "ERMAGERD, PIRATESES!" The supposedly malicious computer is still logged in though, with complete access to your account.... Schwing! (Honestly, this pales in comparison to much more grevious actions against students, such as storing your A# on the Charger Card magstripe, or using the same A# as a default password...)

The real problem is that both computers had authentic access, and this is inexcusable.

*Update: Canvas doesn't pull this shit, it appears you may log in (with my app installed as well) to multiple sessions.*

#### Why is your addon written like a five year old made it?

Stupid is as stupid does. Why put a lot of effort into elegantly resolving a problem that never should have existed?

~~You know what? I really considered making a beautiful javascript application. I was going to listen for log in, log out, and appropriately match keepalive calls to make the session persist. Then I realised that fighting bullshit with fire, while smelly, is way more fun. This program doesn't care if you're currently logged in or not, it will contact UAH every few minutes with a keep alive request regardless.~~

#### What if I want to make your app *not* complete shit?

Pull requests welcome. You may also email me or get in contact some other way, the more people who use this app, the more likely I am to actually maintain it.


### Unrelated

Note to self: curent Banner logout period: 60 minutes. That's at **least** 1,380 minutes too short.






