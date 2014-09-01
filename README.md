# Tidio Chat API

Tidio Chat API library allows you to adjust Tidio Chat to fits your specific requirements.

##### Warning!!!
Tidio Chat API is integral part of Tidio Chat and it can be called only after adding the code on site, if you didn't use our Tidio Chat, then visit our site > https://www.tidiochat.com/signup <https://www.tidiochat.com/signup> to create new account.

----

##### API can be called in two different ways.
1. Add an Javascript code in code of our site, of course after loading Tidio Chat's library.
2. Log in to https://www.tidiochat.com/panel <https://www.tidiochat.com/panel> then go to "settings > Preferences" section and click on "open editor".

----

#### Methods

API methods can be called with function .method, for instance. **tidioChatApi.method(NAME_METHOD, ATTR1, ATTR2);**

* **setColorPallete** - set widget's color
```javascript
tidioChatApi.method('setColorPallete', '#ffffff', '#fff2222');
```
* **badgeShow** - shows widget's badge
```javascript
tidioChatApi.method('badgeShow');
```
* **badgeHide** - hides widget's badge
```javascript
tidioChatApi.method('badgeHide');
```
* **messageFromVisitor** - sends an message from user to operator.
```javascript
tidioChatApi.method('messageFromVisitor', 'Hi this is message from visitor :)');
```
* **messageFromOperator** - sends message from operator to user

```javascript
tidioChatApi.method('messageFromOperator', 'Hi this is message from operator :)');
```
* **popUpOpen** - shows chat's widget
```javascript

tidioChatApi.method('popUpOpen');
```
* **popUpHide** - hides chat's widget
```javascript
tidioChatApi.method('popUpHide');
```
* **chatDisplay** - show/hide chat, when chat will not be loaded but function will be called, then loading of chat will be postpone until the function with attribute "true" will be ran.
```javascript
tidioChatApi.method('chatDisplay', true);
```

----

#### Events

Events can be called with function .on, for instance. **tidioChatApi.on(NAME_DETHOD, [FUNCTION]);**

* **resize** - event is called when chat's widget change size
```javascript
tidioChatApi.on('resize', function(dimension){
console.log('resize', dimension); // output: resize {width: 300px, height: 100px};
});
```

* **popUpShow** - event is called when chat's popup will be open
```javascript
tidioChatApi.on('popUpShow', function(dimension){
alert('PopUp is showed!');
});
```

* **popUpHide** - event is called when chat's popup will be closed
```javascript
tidioChatApi.on('popUpShow', function(dimension){

alert('PopUp is hiden!');
});
```

----

If you're having any issues with our product, please don't hesitate to contact us on contact@tidio.net