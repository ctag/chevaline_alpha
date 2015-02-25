Chevaline Alpha
=======

By Students. For Students.

This addon works to expand the capabilities of UAH's network services.

### Usage

This app doesn't work if your browser is closed or you put your computer into standby, sorry.

### Install

You may now get the add-on from mozilla's site! (I think...)
https://addons.mozilla.org/en-US/firefox/addon/chevaline/

To install manually:

* Download chevaline.xpi (you may ignore all other files in this git)
* Type 'about:addons' into the URL bar, hit enter
* At the top of the add-ons page, click menu -> "Install add-on from file"
* Select chevaline.xpi, restart firefox, go get werk done!

### FAQ

###### I lied, nobody asks me anything, much less *frequently*.


### Notes

So, I'm arriving at the notion that hosting the addon on AMO (Addons.Mozilla.Org) may not be the best idea:

1. I'm not looking to generate profit.

2. I have a very, very specific audience.

3. I suck at javascript, and the addon was rejected.

4. I want to package the .xpi with /all/ of the developement files so that end users can dig around the source. This is discouraged on AMO.

Instead, it looks like I can host the .xpi somewhere with HTTPS (even github?) and manually setup my own auto-updates. The only difference is that I don't think I can make the "install addon" button like on AMO. Instead, users have to download the .xpi and drag it over firefox to install.

#### Development References

##### Hosting manually

http://soledadpenades.com/2014/11/28/publishing-a-firefox-add-on-without-using-addons-mozilla-org/

https://developer.mozilla.org/en-US/Add-ons/Install_Manifests


##### General development

http://adodson.com/hello.js/#hellojs

https://canvas.instructure.com/doc/api/conversations.html

https://github.com/mykmelez/menuitems-jplib/blob/master/docs/menuitems.md

http://semver.org/