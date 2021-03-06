/* global requirejs cprequire cpdefine chilipeppr THREE */
// Defining the globals above helps Cloud9 not show warnings for those variables

// ChiliPeppr Widget/Element Javascript

requirejs.config({
    /*
    Dependencies can be defined here. ChiliPeppr uses require.js so
    please refer to http://requirejs.org/docs/api.html for info.
    
    Most widgets will not need to define Javascript dependencies.
    
    Make sure all URLs are https and http accessible. Try to use URLs
    that start with // rather than http:// or https:// so they simply
    use whatever method the main page uses.
    
    Also, please make sure you are not loading dependencies from different
    URLs that other widgets may already load like jquery, bootstrap,
    three.js, etc.
    
    You may slingshot content through ChiliPeppr's proxy URL if you desire
    to enable SSL for non-SSL URL's. ChiliPeppr's SSL URL is
    https://i2dcui.appspot.com which is the SSL equivalent for
    http://chilipeppr.com
    */
    paths: {
        // Example of how to define the key (you make up the key) and the URL
        // Make sure you DO NOT put the .js at the end of the URL
        // SmoothieCharts: '//smoothiecharts.org/smoothie',
    },
    shim: {
        // See require.js docs for how to define dependencies that
        // should be loaded before your script/widget.
    }
});

cprequire_test(["inline:com-chilipeppr-widget-editbootscript"], function(myWidget) {

    // Test this element. This code is auto-removed by the chilipeppr.load()
    // when using this widget in production. So use the cpquire_test to do things
    // you only want to have happen during testing, like loading other widgets or
    // doing unit tests. Don't remove end_test at the end or auto-remove will fail.

    // Please note that if you are working on multiple widgets at the same time
    // you may need to use the ?forcerefresh=true technique in the URL of
    // your test widget to force the underlying chilipeppr.load() statements
    // to referesh the cache. For example, if you are working on an Add-On
    // widget to the Eagle BRD widget, but also working on the Eagle BRD widget
    // at the same time you will have to make ample use of this technique to
    // get changes to load correctly. If you keep wondering why you're not seeing
    // your changes, try ?forcerefresh=true as a get parameter in your URL.

    console.log("Running Edit Boot Javascript Widget");
    editboot.init();
    //editboot.doFork();
    console.log("initted");

} /*end_test*/ );

cpdefine('inline:com-chilipeppr-widget-editbootscript', ['chilipeppr_ready'], function () {

    return {

        id: 'com-chilipeppr-widget-editbootscript',
        url: "(auto fill by runme.js)",       // The final URL of the working widget as a single HTML file with CSS and Javascript inlined. You can let runme.js auto fill this if you are using Cloud9.
        fiddleurl: "(auto fill by runme.js)", // The edit URL. This can be auto-filled by runme.js in Cloud9 if you'd like, or just define it on your own to help people know where they can edit/fork your widget
        githuburl: "(auto fill by runme.js)", // The backing github repo
        testurl: "(auto fill by runme.js)",   // The standalone working widget so can view it working by itself
        name: "Widget / Edit Boot Javascript",
        desc: "This widget lets you define your base Javascript that gets executed when your URL is entered. The root panel is loaded first by ChiliPeppr and then you can load your own content in the body area. Your code is only executed once the root panel is loaded.",
        publish: [''],
        subscribe: [''],
        isForkMode: false,

        init: function () {
            this.isForkMode = false;
            this.urlSetup();
            this.formSetup();
            var url = this.extractUrl();
            var forkDom = $('#com-chilipeppr-widget-editbootscript-body #forking-panel');
            forkDom.addClass("hidden");
            //if (!url) url = "asdf";
            if (url) {
                // perform submit
                this.urlSubmit();
            } else {
                // this is root
                var that = this;
                this.urlSubmit(null, function() {
                    if (!that.isForkMode) {
                        var warningDom = $('#com-chilipeppr-widget-editbootscript-body .alert');
                        warningDom.text("This is the root URL. You may not edit it, but you may copy the Javascript for your own Hardware Fiddle. It would be best to fork the workspace in JSFiddle and modify your boot script to reference your new fork.");
                    }
                });
            }                
                
        },
        doFork: function() {
            console.log("entering fork mode");
            this.isForkMode = true;
            // we're letting the user pick a new url, but copying the javascript
            // from the current page
            var forkDom = $('#com-chilipeppr-widget-editbootscript-body #forking-panel');
            forkDom.removeClass("hidden");
            forkDom.text("We are going to fork this current boot script for you. Please pick a new URL for your workspace, keep or edit the Javascript, and then hit Save Changes. The Base Boot Javascript contains the code for the current page " + this.extractUrl("(root)") + " that you are on. You'll notice the base Javascript loads an external URL (which is most likely a JSFiddle). You should navigate directly to that URL in another tab and fork it. Then place a URL to your new code in this boot script."); 
        },
        extractUrl: function(ifNullStr) {
            // read the window.location to extract the url for this fiddle
            console.log("window.location", window.location.pathname);
            var path = window.location.pathname;
            if (path == "/_display/") {
                // we're inside jsfiddle, so ignore
                //return "(inside jsfiddle)";
                path = null;
            } else {
                path = path.replace(/^\//, "");
                path = path.replace(/\/$/, "");
                //return path;
            }
            if (ifNullStr && path == null) path = ifNullStr;
            return path;
        },
        copyExampleJscript: function() {
            var jscriptDom = $('#com-chilipeppr-widget-editbootscript-inputScript');
            var jscriptExampleDom = $('#com-chilipeppr-widget-editbootscript-inputScriptExample');
            jscriptDom.val(jscriptExampleDom.text());
        },
        urlSetup: function () {
            var that = this;
            $('#com-chilipeppr-widget-editbootscript-inputUrl').blur(function(e) { 
                that.urlSubmit(e); 
            });
            var url = this.extractUrl();
            console.log("url for this fiddle", url);
            if (url) {
                $('#com-chilipeppr-widget-editbootscript-inputUrl').val(url);
            }
        },
        urlSubmit: function (e, callback) {
            var that = this;
            if (e) e.preventDefault();
            console.log("url submit. e:", e, " isForkMode:", this.isForkMode);
            var warningDom = $('#com-chilipeppr-widget-editbootscript-body .alert');
            var jscriptDom = $('#com-chilipeppr-widget-editbootscript-inputScript');
            var jscriptExampleDom = $('#com-chilipeppr-widget-editbootscript-inputScriptExample');
            warningDom.removeClass("hidden");
            warningDom.text("Checking URL availability...");
            var userUrl = $('#com-chilipeppr-widget-editbootscript-inputUrl').val();
            console.log("user url:", userUrl);
            var jqxhr = $.ajax({
                url: "http://www.chilipeppr.com/dataget?key=userUrl:" + userUrl + "&callback=?",
                dataType: 'jsonp',
                jsonpCallback: 'editboot_datagetCallback',
                cache: true,
            }).done(function (data) {
                    console.log("got jsnop callback", data);
                    if (data.KeyExists != undefined && data.KeyExists == false) {
                        warningDom.removeClass("alert-warning");
                        warningDom.addClass("alert-info");
                        if (that.isForkMode) {
                            warningDom.text("URL is available for your use. Since we're in forking mode, the base boot Javascript is a copy of the script used on this page and you may keep it or edit it for your new workspace.");
                        } else {
                            warningDom.text("URL is available for your use. Showing you sample Javascript for your boot script.");
                            jscriptDom.val(jscriptExampleDom.text());
                        }
                    } else if (data.Error && data.Error == true) {
                        warningDom.removeClass("alert-info");
                        warningDom.addClass("alert-warning");
                        warningDom.text(data.Msg);
                    } else {
                        // this url is taken, but see if we own it
                        var jqxhr = $.getJSON("http://www.chilipeppr.com/datalogin?callback=?")
                        .done(function (logindata) {
                            console.log("logindata", logindata);
                            if (logindata.CurrentUser != undefined && logindata.CurrentUser != null) {
                                console.log("user logged in ", logindata.CurrentUser);
                                if (data.User == logindata.CurrentUser.Email) {
                                    warningDom.removeClass("alert-warning");
                                    warningDom.addClass("alert-info");
                                    warningDom.text("You own this URL, so you can edit the base boot Javascript.");
                                } else {
                                    warningDom.removeClass("alert-info");
                                    warningDom.addClass("alert-warning");
                                    warningDom.text("This URL is taken by another user already, so you may not use it.");
                                }
                            } else {
                                console.log("user NOT logged in");
                                warningDom.removeClass("alert-info");
                                warningDom.addClass("alert-warning");
                                warningDom.text("You must be logged in to create/edit a URL and edit the base boot Javascript.");
                            }
                            if (callback) callback.apply(null);
                        })
                        
                        //warningDom.text("URL is available. " + JSON.stringify(data));
                        // place jscript into box (everything is public)
                        jscriptDom.val(data.Value);
                    }
                })
                .fail(function (data) {
                    console.log("failed. data:", data);
                    warningDom.text("Failed to execute Ajax call. Huh?");
                })
        },
        formSetup: function() {
            $('#com-chilipeppr-widget-editbootscript-submitBtn').click(this.formSubmit);
            $('#com-chilipeppr-widget-editbootscript-body input,select').keypress(function(event) { return event.keyCode != 13; });
        },
        formSubmit: function (e) {
            console.log("e:", e);
            e.preventDefault();
            console.log("form submit");
            var warningDom = $('#com-chilipeppr-widget-editbootscript-body .alert');
            warningDom.text("Submitting form...");
            var userUrl = $('#com-chilipeppr-widget-editbootscript-inputUrl').val();
            var userScript = $('#com-chilipeppr-widget-editbootscript-inputScript').val();
            console.log("user url:", userUrl);
            console.log("user script:", userScript);
            /*
            var jqxhr = $.getJSON("http://www.chilipeppr.com/dataput?callback=?", { key: "userUrl:" + userUrl, val: userScript })
                .done(function (data) {
                console.log("got jsnop callback", data);
                if (data.Error && data.Error == true) {
                    warningDom.text(data.Msg);
                } else {
                    //warningDom.text("Successfully saved record. " + JSON.stringify(data));
                    warningDom.html("Successfully saved URL and base boot script. Navigate to your new workspace <a href=\"http://chilipeppr.com/" + userUrl + "\">http://chilipeppr.com/" + userUrl + "</a>");
                }
            })
                .fail(function (data) {
                console.log("failed. data:", data);
                warningDom.text("Failed to execute Ajax call. Huh?");
            });
            */
            
            $.ajax({
                url: "http://www.chilipeppr.com/dataput",
                type: "POST",
                crossDomain: true,
                xhrFields: {
                    withCredentials: true
                },
                data: { key: "userUrl:" + userUrl, val: userScript },
                dataType: "json",
                success:function(data){
                    console.log("got success", data);
                    if (data.Error && data.Error == true) {
                        warningDom.text(data.Msg);
                    } else {
                        //warningDom.text("Successfully saved record. " + JSON.stringify(data));
                        warningDom.html("Successfully saved URL and base boot script. Navigate to your new workspace <a href=\"http://chilipeppr.com/" + userUrl + "\">http://chilipeppr.com/" + userUrl + "</a>");
                    }
                },
                error:function(xhr,status,error){
                    console.log("failed. data:", data);
                    warningDom.text("Failed to execute Ajax call. Huh?");
                }
            });
            
        },
        checkLogin: function () {
            var jqxhr = $.getJSON("http://www.chilipeppr.com/datalogin?callback=?")
            .done(function (data) {
                console.log(data);
                if (data.CurrentUser != undefined && data.CurrentUser != null) {
                    console.log("user logged in ", data.CurrentUser);
                } else {
                    console.log("user NOT logged in");
                }
            })
            .fail(function () {
            })
        },
    }
});