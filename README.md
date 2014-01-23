#Zeichen.js

Dead simple<sup>*</sup> JS notifications.

<sub>* Easy to use out of the box, but the customization options are extensive</sub>

##Dependencies

1. jQuery >= 1.7
2. A Modern Browser (not tested on IE. This uses a TON of css3 transitions)

##Demo

There is an html file in the repository with some test buttons. Better documentation will come eventually.

##Features

* Very easy to use if you just want to pop a notification
* Customization options down to the templates and template engine used for generating markup and styles
* Almost all of the internal css selectors are attribute selectors, so no polluting your class or ID space
* Somewhat simple "framework" for creating different animation sets.

##Basic Usage

Include zeichen.css, compiled.css from the animations directory of your choice, and zeichen.js

```javascript
zeichen.success('You get a gold star!');
```

##Advanced Usage

The first parameter of the message methods (error(), success(), warning(), info()) can either be a string or an object. If an object is used, the parameters will be mapped to a template.

```javascript
//assuming we have a template with {{heading}} and {{body}} placeholders
zeichen.success({heading:'Congrats!', body:'You get a gold star!'});
```

The second parameter of the message methods is an override for the options object for ONLY that message. This parameter will override the global options ONLY for the instance of that message.

```javascript
zeichen.success('You get a gold star!', {autoDismiss: false});
```

Additionally, the global options of Zeichen can be manipulated. Again, options passed as the second parameter in a notification call will override these.

```javascript
zeichen.options.autoDismiss = true;
```


##All Options

```javascript

var opts = {
    autoDismiss: false, // bool : dismiss notification after listItemLifetime
    tapDismiss: true, // bool : dismiss notification on click/tap 
    hoverRecover: true, // bool : hovering over a notification while it is dismissing, restore it
    iconAutoCenter: true, // bool: use JS to vertically center the icon in data-zeichen-content-wrapper
    iconShow: true, // bool : show the status icon
    closeShow: true, // bool : show the close icon
    drawCallback: function(message, $listItem){}, // function : callback that fires after the notification is added to dom
    container: 'body', // string : css selector in which the notification container will be added
    listPosition: 'fixed', // string : css position of a notification container
    listPlacement: 'tr', // string : default placement bl: bottom left, tm: top middle, etc
    listZIndex: 100, // string/int : css z-index value for the notification container
    listItemWidth: '100%', // string : css width value for the listItem
    listItemActionTrigger: 'click', // string : jquery action to which listItemCallback is bound
    listItemActionCallback: function($listItem){}, // function : callback that fires on listItemActionTrigger
    listItemLifetime: 7000, // int : time in ms before the contentWrapper hide animation begins
    listItemShowDuration: 500, // int : time in ms for listItem to animate before the contentWrapper show animation begins
    listItemHideDuration: 500, // int : time in ms for listItem to animate before the listItem is removed from dom
    contentWrapperHideDuration: 500, // int : time in ms for contentWrapper to animate before listItem hide animation starts
    
    /* TEMPLATE OPTS */
    templateEngine: QuickEngine, // object : the templating engine. Used like content = opts.templateEngine.compile(template).render(context)
    listTpl: listTpl, // string : template for data-zeichen-list
    listItemTpl: listItemTpl, // string : template for data-zeichen-list-item. Should nest data-zeichen-content-wrapper
    iconTpl: iconTpl, // string : template for data-zeichen-icon
    closeTpl: closeTpl, // string : template for data-zeichen-close
    contentTpl: contentTpl, // string : template for data-zeichen-content
    messageTpl: messageTpl, //string: template for the message
    
    /* CONTENT OPTS */
    successIconText: '&#10004;', // string : html for the success icon
    warningIconText: '&#x2206;', // string : html for the warning icon
    errorIconText: '!', // string : html for the error icon
    infoIconText: '&#x00BB;', // string : html for the info icon
    closeText: '&times;', // string : html for the close icon
    
    /* CLASS OPTS */
    showingClass: showingClass, // class used to apply showing animations
    hidingClass: hidingClass, // class used to apply hiding animations
    
    /* first section here exists for the concept of a "primary" class for each element */
    listClass: listClass, 
    listItemClass: listItemClass,
    contentWrapperClass: contentWrapperClass,
    iconClass: iconClass,
    contentClass: contentClass,
    closeClass: closeClass,
    
    /* additional css appended after the above classes. Ex: class="{{listClass}} {{listClassExt}}" */
    listClassExt: listClassExt,
    listItemClassExt: listItemClassExt,
    contentWrapperClassExt: contentWrapperClassExt,
    iconClassExt: iconClassExt,
    contentClassExt: contentClassExt,
    closeClassExt: closeClassExt,
};
```
