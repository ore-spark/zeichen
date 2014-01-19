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
                 
                 var idPrefix               = 'zeichen'; //containers of messages will like {{idPrefix}}-tr
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
                     '<ul class="{{listClass}} {{listClassExt}} " id="{{idPrefix}}-{{listPlacement}}">' +
                     '</ul>';
                 
                 /**
                  * List Item Template
                  * This is the li added to the list
                  * The only default CSS rule used that matters here is setting the bg color on
                  * :hover of the close icon. We pretty much do <close element>:hover ~ <content element>
                  * in order to apply the hover effect to the content container, so it is wide to
                  * always have the close button render in the dom before the content
                  */
                 var listItemTpl = '' +
                     '<li class="{{listItemClass}} {{listItemClassExt}} ">' +
                     '  <div class="{{contentWrapperClass}} {{type}} {{contentWrapperClassExt}}">' +
                     '    {{iconTplRender}}' +
                     '    {{closeTplRender}}' +
                     '    {{contentTplRender}}' +
                     '  </div>' +
                     '</li>';                                  
                 
                 /**
                  * Close Template
                  * - Conatiner, classes, and html for the close icon. We listen for *[data-zeichen-close] for our close handler
                  */
                 var closeTpl = '<a href="#" class="{{closeClass}} {{closeClassExt}} " data-zeichen-close>{{closeText}}</a>';

                 /**
                  * Icon Template
                  * - Container, classes, and HTML that makes up the icon area
                  */
                 var iconTpl = '<div class="{{iconClass}} {{iconClassExt}} " data-zeichen-icon>{{iconText}}</div>';

                 //Message template for custom content layouts
                 /**
                  * Message Template
                  * - Template that defines the structure of the content.
                  * - Only used if the first parameter of our public functions is an object
                  */
                 var messageTpl = '<h3>{{heading}}</h3><p>{{body}}</p>';                 

                 /**
                  * Contents Wrapper Template
                  * - A wrapper for the contents panel so that we can animate the contents separately from it's li parent
                  */
                 var contentTpl = '<div class="{{contentClass}} {{type}} {{contentClassExt}} " data-zeichen-content>{{messageRender}}</div>';
                 
                 
                 //default options
                 var opts = {
                     autoDismiss: false, //automatically dismiss alerts
                     tapDismiss: true, //dismiss alert on click/tap of the content
                     hoverRecover: false, //hovering over an autodismissed message while its fading restores it
                     iconAutoCenter: true, //auto center the icon in the div
                     iconShow: true, //show/hide status icon
                     closeShow: true, //show/hide close input
                     container: 'body', //selector for the list containers
                     listPosition: 'fixed', //css position of the list
                     listPlacement: 'tr', //default placement bl: bottom left, tm: top middle, etc
                     listZIndex: 100, //z-index of the outer container
                     listItemActionTrigger: 'click', //trigger passed to jquery on method
                     listItemActionCallback: function(){}, //callback to fire on a user action
                     listItemLifetime: 7000, //time in ms until we start the fade/ removal animation steps
                     listItemShowDuration: 450, //time in ms for list item to animate before wrapper show begins
                     listItemHideDuration: 500, //time in ms for list item to animate before item is destroyed
                     contentWrapperHideDuration: 500, //time in ms for content to animate before list item hide starts
                     
                     /* TEMPLATE OPTS */
                     listTpl: listTpl,
                     listItemTpl: listItemTpl,
                     iconTpl: iconTpl,
                     closeTpl: closeTpl,
                     messageTpl: messageTpl,
                     contentTpl: contentTpl,                     
                     
                     /* CONTENT  OPTS */
                     successIconText: '&#10004;',
                     warningIconText: '&#x2206;',
                     errorIconText: '!',
                     infoIconText: '&#x00BB;',
                     closeText: '&times;',
                     
                     idPrefix: idPrefix,
                     showingClass: showingClass,
                     hidingClass: hidingClass,
                     
                     listClass: listClass,
                     listItemClass: listItemClass,
                     contentWrapperClass: contentWrapperClass,
                     iconClass: iconClass,
                     contentClass: contentClass,
                     closeClass: closeClass,
                     
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
                     initListItem(message, 'info', exOptions);
                 }
                 function success(message, exOptions){
                     initListItem(message, 'success', exOptions);
                 }
                 function warning(message, exOptions){
                     initListItem(message, 'warning', exOptions);
                 }
                 function error(message, exOptions){
                     initListItem(message, 'error', exOptions);
                 }
                 function clear(exOptions){
                     var opts = $.extend({}, zeichen.options, exOptions);
                     var $wrappers = $('.'+opts.contentWrapperClass);
                     var $listItems = $('.'+opts.listItemClass);
                     $wrappers.removeClass(opts.showingClass).addClass(opts.hidingClass);
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
                     var selector = '#'+opts.idPrefix+'-'+placement;
                     var $list = $(selector);
                     
                     if($list.length === 0){
                         $list = $(QuickEngine.compile(opts.listTpl).render({
                             idPrefix: opts.idPrefix, 
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
                     var closeTplRender = opts.closeShow ? QuickEngine.compile(opts.closeTpl).render({
                         closeClass: opts.closeClass, 
                         closeClassExt: opts.closeClassExt, 
                         closeText: opts.closeText
                     })
                     : '';
                     
                     //render the icon
                     var iconTplRender = opts.iconShow ? QuickEngine.compile(opts.iconTpl).render({
                         iconClass: opts.iconClass,
                         iconClassExt: opts.iconClassExt,
                         iconText: iconText,
                     })
                     : '';
                     
                     //render the message template, or just use text
                     var messageRender = typeof message === 'object' ? 
                         QuickEngine.compile(opts.messageTpl).render(message)
                         : message;


                     //render the content area
                     var contentTplRender = QuickEngine.compile(opts.contentTpl).render({
                         type: type, 
                         contentClass: opts.contentClass, 
                         contentClassExt: opts.contentClassExt,
                         messageRender: messageRender,
                     });

                     //initialize the outer container
                     var $listItem = $(QuickEngine.compile(opts.listItemTpl).render({
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
                     showAlert($list, $listItem, opts);
                 }
                 
                 //draw the alert to dom, trigger fade in and fade out animation timers
                 function showAlert($list, $listItem, opts){
                     //append inner
                     if(opts.listPlacement.match(/t/g))
                         $listItem.prependTo($list);
                     if(opts.listPlacement.match(/b/g))
                         $listItem.appendTo($list);
                     
                     //compute top offset for the icon so it always lands in the middle
                     var wrapperSelector = '.'+opts.contentWrapperClass;
                     var iconSelector = '.'+opts.iconClass;
                     
                     var $wrapper = $listItem.find(wrapperSelector);
                     var $icon = $listItem.find(iconSelector);
                     
                     var wrapper_height = $wrapper.innerHeight();
                     var icon_height =  $icon.innerHeight();
                     
                     if(opts.iconAutoCenter){
                         var icon_top = (wrapper_height/2) - (icon_height/2);
                         $icon.css({top: icon_top+'px'});
                     }
                     
                     // Accurately set max height so our animations dont look like shit.
                     $listItem.css({
                         'max-height': wrapper_height+'px'
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
                         opts.listItemActionCallback();
                     });

                     //bind the tap/click dismiss listener if set
                     if(opts.tapDismiss){
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
                     
                 }                 
             })();
         }
        );
})(function(deps, factory){
    var zeichen = factory(window['jQuery']);
    window['zeichen'] = zeichen;
});
