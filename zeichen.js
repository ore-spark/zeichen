; (function (init){
    init({},
         function($){
             return (function(){
                 
                 //Quick and dirty template engine
                 var QuickEngine = {
                     compile: function(template) {
                         return {
                             render: function(context) {
                                 return template.replace(/\{\{(\w+)\}\}/g, function (match,p1) { return context[p1]; });
                             }
                         };
                     }
                 };
                 
                 var showingClass           = 'showing'; //class added for the showing animation trigger
                 var hidingClass            = 'hiding'; //class added for the hiding animation trigger
                 var listClass              = 'zeichen-list';
                 var listClassExt           = '';
                 var listItemClass          = 'zeichen-list-item';
                 var listItemClassExt       = '';
                 var contentWrapperClass    = 'zeichen-content-wrapper';
                 var contentWrapperClassExt = '';
                 var iconClass              = 'zeichen-icon';
                 var iconClassExt           = '';
                 var contentClass           = 'zeichen-content';
                 var contentClassExt        = '';
                 var closeClass             = 'zeichen-close';
                 var closeClassExt          = '';                 

                 /**
                  * List Template
                  * 
                  */
                 var listTpl = '' +
                     '<div class="{{listClass}} {{listClassExt}} " data-zeichen-list="{{listPlacement}}"></div>';
                 
                 /**
                  * List Item Template
                  * This is the li added to the list
                  * *[data-zeichen-list-item] is required, and used as a jquery selector to add animation classes
                  * *[data-zeichen-content-wrapper] is required, and used as a jquery selector to add animation classes
                  * Good advice would be to not mess with the nesting of data-zeichen-content-wrapper inside data-zeichen-list-item
                  */
                 var listItemTpl = '' +
                     '<div class="{{listItemClass}} {{listItemClassExt}}" data-zeichen-list-item>' +
                     '  <div class="{{contentWrapperClass}} {{type}} {{contentWrapperClassExt}}" data-zeichen-content-wrapper>' +
                     '    {{iconTplRender}}' +
                     '    {{closeTplRender}}' +
                     '    {{contentTplRender}}' +
                     '  </div>' +
                     '</div>';                                  
                 
                 /**
                  * Close Template
                  * - Container, classes, and html for the close icon. We listen for *[data-zeichen-close] for our close handler
                  */
                 var closeTpl = '<a href="#" class="{{closeClass}} {{closeClassExt}} " data-zeichen-close>{{closeText}}</a>';

                 /**
                  * Icon Template
                  * - Container, classes, and HTML that makes up the icon area
                  * *[data-zeichen-icon] is required, and used as a jquery selector to auto center the icon
                  */
                 var iconTpl = '<div class="{{iconClass}} {{iconClassExt}} " data-zeichen-icon>{{iconText}}</div>';

                 /**
                  * Contents Template
                  * - Template that houses the rendered message
                  */
                 var contentTpl = '<div class="{{contentClass}} {{type}} {{contentClassExt}} ">{{messageRender}}</div>';

                 //Message template for custom content layouts
                 /**
                  * Message Template
                  * - Template that defines the structure of the message
                  * - Only used if the first parameter of our public functions is an object
                  */
                 var messageTpl = '<h3>{{heading}}</h3><p>{{body}}</p>';                 
                 
                 
                 //default options
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
                 
                 var zeichen = {
                     options: opts,
                     success: success,
                     error: error,
                     warning: warning,
                     info: info,
                     clear: clear,
                 };
                 
                 return zeichen;
                 
                 /**
                  * PUBLIC FUNCTIONS
                  * 
                  */
                 function info(message, exOptions){
                     var $instance = initListItem(message, 'info', exOptions);
                     return $instance;
                 }
                 function success(message, exOptions){
                     var $instance = initListItem(message, 'success', exOptions);
                     return $instance;
                 }
                 function warning(message, exOptions){
                     var $instance = initListItem(message, 'warning', exOptions);
                     return $instance;
                 }
                 function error(message, exOptions){
                     var $instance = initListItem(message, 'error', exOptions);
                     return $instance;
                 }
                 function clear(exOptions){
                     var opts = $.extend({}, zeichen.options, exOptions);
                     var $contentWrappers = $('*[data-zeichen-content-wrapper]');
                     var $listItems = $('*[data-zeichen-list-item]');
                     $contentWrappers.removeClass(opts.showingClass).addClass(opts.hidingClass);
                     //fire the listItem animation after contentWrapper has finished
                     setTimeout(function(){
                         $listItems.removeClass(opts.showingClass).addClass(opts.hidingClass);
                         //fire the removal after listItem has finished animating
                         setTimeout(function(){
                             $listItems.remove();
                         }, opts.listItemHideDuration);
                     }, opts.contentWrapperHideDuration);
                 }
                 
                 /**
                  * INTERNAL FUNCTIONS
                  *
                  */                 
                 function initList(placement, opts){
                     var selector = '*[data-zeichen-list="'+placement+'"]';
                     var $list = $(selector);
                     
                     if($list.length === 0){
                         $list = $(opts.templateEngine.compile(opts.listTpl).render({
                             listClass: opts.listClass, 
                             listClassExt: opts.listClassExt, 
                             listPlacement: placement,
                         }));
                         $list.css({
                             position: opts.listPosition,
                             'z-index':opts.listZIndex
                         });
                         $(opts.container).append($list);
                     }
                     
                     return $list;
                 }
                 
                 //return the alert object to be rendered
                 function initListItem(message, type, exOptions){
                     var opts = $.extend({}, zeichen.options, exOptions);                    
                     
                     var iconText = type === 'success' ? 
                         opts.successIconText
                         : (type === 'warning' ? 
                            opts.warningIconText
                            : (type === 'error' ? 
                               opts.errorIconText
                               : opts.infoIconText
                              )
                           );
                     
                     //render the close input                
                     var closeTplRender = opts.closeShow ? opts.templateEngine.compile(opts.closeTpl).render({
                         closeClass: opts.closeClass, 
                         closeClassExt: opts.closeClassExt, 
                         closeText: opts.closeText
                     })
                     : '';
                     
                     //render the icon
                     var iconTplRender = opts.iconShow ? opts.templateEngine.compile(opts.iconTpl).render({
                         iconClass: opts.iconClass,
                         iconClassExt: opts.iconClassExt,
                         iconText: iconText,
                     })
                     : '';
                     
                     //render the message template, or just use text
                     var messageRender = typeof message === 'object' ? 
                         opts.templateEngine.compile(opts.messageTpl).render(message)
                         : message;


                     //render the content area
                     var contentTplRender = opts.templateEngine.compile(opts.contentTpl).render({
                         type: type, 
                         contentClass: opts.contentClass, 
                         contentClassExt: opts.contentClassExt,
                         messageRender: messageRender,
                     });

                     //initialize the outer container
                     var $listItem = $(opts.templateEngine.compile(opts.listItemTpl).render({
                         listItemClass: opts.listItemClass,
                         listItemClassExt: opts.listItemClassExt,
                         contentWrapperClass: opts.contentWrapperClass,
                         type: type,
                         contentWrapperClassExt: opts.contentWrapperClassExt,
                         closeTplRender: closeTplRender,
                         iconTplRender: iconTplRender,
                         contentTplRender: contentTplRender,
                     }));

                     var $list = initList(opts.listPlacement, opts);
                     var $messageInstance = showAlert($list, $listItem, message, opts);
                     return $messageInstance;
                 }
                 
                 //draw the alert to dom, trigger fade in and fade out animation timers
                 function showAlert($list, $listItem, message, opts){
                     //append inner
                     if(opts.listPlacement.match(/t/g))
                         $listItem.prependTo($list);
                     if(opts.listPlacement.match(/b/g))
                         $listItem.appendTo($list);                     

                     opts.drawCallback(message, $listItem);
                     
                     //compute top offset for the icon so it always lands in the middle
                     var iconSelector = '.'+opts.iconClass;
                     
                     var $icon = $listItem.find(iconSelector);
                     var $wrapper = $icon.closest('[data-zeichen-content-wrapper]');
                     
                     var wrapper_height = $wrapper.innerHeight();
                     var icon_height =  $icon.innerHeight();
                     
                     if(opts.iconAutoCenter){
                         var icon_top = (wrapper_height/2) - (icon_height/2);
                         $icon.css({top: icon_top+'px'});
                     }
                     
                     // Accurately set max height so our animations dont look like shit.
                     $listItem.css({
                         'max-height': wrapper_height+'px',
                         'width': opts.listItemWidth,
                     });

                     
                     //1 ms timer before starting the show on the
                     //list item due to the dom being so recently updated
                     setTimeout(function(){
                         $listItem.addClass(opts.showingClass);
                         //fire contentWrapper animation after listItem is finished animating
                         setTimeout(function(){
                             $wrapper.addClass(opts.showingClass);
                         }, opts.listItemShowDuration);
                     }, 1);
                     
                     var contentWrapperTimer = null;
                     var listItemTimer = null; 
                     var listItemRemoveTimer = null; 
                     
                     //if we set autoDismiss: true, run the auto dismiss triggers
                     if(opts.autoDismiss){
                         //wait for our listItemLifetime until we start animating things
                         contentWrapperTimer = setTimeout(function(){
                             //start the contentWrapper animation
                             $wrapper.removeClass(opts.showingClass).addClass(opts.hidingClass);
                             //fire the listItem animation after contentWrapper has finished
                             listItemTimer = setTimeout(function(){
                                 $listItem.removeClass(opts.showingClass).addClass(opts.hidingClass);
                                 //fire the removal after listItem has finished animating
                                 listItemRemoveTimer = setTimeout(function(){
                                     $listItem.remove();
                                 }, opts.listItemHideDuration);
                             }, opts.contentWrapperHideDuration);
                         }, opts.listItemLifetime);
                         
                         //register the mouseenter event for interrupting the removal and fade timer.
                         $listItem.on('mouseenter', function(){
                             clearTimeout(contentWrapperTimer);
                             if((listItemRemoveTimer || listItemTimer) && opts.hoverRecover){
                                 clearTimeout(listItemRemoveTimer);
                                 clearTimeout(listItemTimer);
                                 $listItem.addClass(opts.showingClass).removeClass(opts.hidingClass);
                                 setTimeout(function(){
                                     $wrapper.addClass(opts.showingClass).removeClass(opts.hidingClass);
                                 }, opts.listItemShowDuration);
                             }
                         });
                         
                         //register the mouseleave event for restarting the timers
                         $listItem.on('mouseleave', function(){
                             contentWrapperTimer = setTimeout(function(){
                                 //start the contentWrapper animation
                                 $wrapper.removeClass(opts.showingClass).addClass(opts.hidingClass);
                                 //fire the listItem animation after contentWrapper has finished
                                 listItemTimer = setTimeout(function(){
                                     $listItem.removeClass(opts.showingClass).addClass(opts.hidingClass);
                                     //fire the removal after listItem has finished animating
                                     listItemRemoveTimer = setTimeout(function(){
                                         $listItem.remove();
                                     }, opts.listItemHideDuration);
                                 }, opts.contentWrapperHideDuration);
                             }, opts.listItemLifetime);
                         });
                     }
                     
                     //bind listener for close click
                     $listItem.on('click', '*[data-zeichen-close]', function(e){
                         e.preventDefault();
                         e.stopPropagation();
                         $listItem.unbind('mouseenter');
                         $listItem.unbind('mouseleave');
                         clearTimeout(contentWrapperTimer);
                         clearTimeout(listItemRemoveTimer);
                         clearTimeout(listItemTimer);
                         
                         //start the contentWrapper animation
                         $wrapper.removeClass(opts.showingClass).addClass(opts.hidingClass);
                         //fire the listItem animation after contentWrapper has finished
                         setTimeout(function(){
                             $listItem.removeClass(opts.showingClass).addClass(opts.hidingClass);
                             //fire the removal after listItem has finished animating
                             setTimeout(function(){
                                 $listItem.remove();
                             }, opts.listItemHideDuration);
                         }, opts.contentWrapperHideDuration);
                     });

                     //bind listener for action callback
                     $listItem.on(opts.listItemActionTrigger, function(e){
                         e.preventDefault();
                         opts.listItemActionCallback($(this));
                     });

                     //bind the tap/click dismiss listener if set
                     if(opts.tapDismiss){
                         $listItem.css({cursor: 'pointer'});
                         $listItem.on('click', function(e){
                             e.preventDefault();
                             $listItem.unbind('mouseenter');
                             $listItem.unbind('mouseleave');
                             clearTimeout(contentWrapperTimer);
                             clearTimeout(listItemRemoveTimer);
                             clearTimeout(listItemTimer);

                             //start the contentWrapper animation
                             $wrapper.removeClass(opts.showingClass).addClass(opts.hidingClass);
                             //fire the listItem animation after contentWrapper has finished
                             setTimeout(function(){
                                 $listItem.removeClass(opts.showingClass).addClass(opts.hidingClass);
                                 //fire the removal after listItem has finished animating
                                 setTimeout(function(){
                                     $listItem.remove();
                                 }, opts.listItemHideDuration);
                             }, opts.contentWrapperHideDuration);
                         });
                     }                                                              
                     return $listItem;
                 }                 
             })();
         }
        );
})(function(deps, factory){
    var zeichen = factory(window.jQuery);
    window.zeichen = zeichen;
});
