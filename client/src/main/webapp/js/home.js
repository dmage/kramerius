/* global _, K5 */

K5.eventsHandler.addHandler(function(type, data) {
    
    if (type === "api/feed/newest") {
        K5.gui.home.fillFooter("#app-footerbar-newest div.home-thumbs", K5.api.ctx.feed.newest.data);
    }

    if (type === "api/feed/mostdesirable") {
        K5.gui.home.fillFooter("#app-footerbar-favorite div.home-thumbs", K5.api.ctx.feed.mostdesirable.data);
    }

    if (type === "api/feed/cool") {
        
        K5.gui.home.fillFooter("#app-footerbar-choosen div.home-thumbs", K5.api.ctx.feed.cool.data);
        if (K5.gui.home) {
            K5.gui.home.displayBackground();
        }
    }

    if (type === "application/init/end") {
        /* if (K5.authentication.ctx["profile"] && K5.authentication.ctx.profile["favorites"]) {
                var mapped = _.map(K5.authentication.ctx.profile.favorites, function(pid) { 
                        var obj = {};
                        obj["pid"] = pid;                       
                        obj["title"] = 'title';                       
                        return  obj; 
                });
                var data = {'data':mapped};
                K5.gui.currasels["profilefavorites"] = new Carousel("#yearRows>div.profilefavorites", {"json": data}, true);
                K5.gui.currasels["profilefavorites"].setName("profilefavorites");
        }  
        */
        K5.gui.home = new HomeEffects(K5);
    }
    if (type === "i18n/dictionary") {
        if(!K5.gui.home){
            K5.gui.home = new HomeEffects(K5);
        }
        K5.gui.home.getDocs();
    }
});



function HomeEffects(application) {
    this.application = application;
    this._init();
    this.backgroundDisplayed = false;
}

HomeEffects.prototype = {
    ctx: {},
    _init: function() {
        
        this.hasFacets = false;
        
        this.setSizes();
        this.infoHidden = false;
        if (isTouchDevice()) {
            $("#buttons").swipe({
                swipeUp: function(event, direction, distance, duration, fingerCount) {
                    $("#band").animate({'bottom': 20}, 200);
                },
                threshold: 2
            });
        }
        
        //podle #153 mame otevrene "vybrane" a po 5 sec schovame
        $("#band").animate({'bottom': 41}, 200);
        setTimeout(function() {
            $("#band").animate({'bottom': -147}, 200);
            $('#buttons>div.button').removeClass('sel');
        }.bind(this), 5000);
        
        this.addContextButtons();
    },
    
    addContextButtons: function(){
        var text = $("#item_menu").html();
        $("#contextbuttons").html(text);
    },
    
    showInfo: function() {
        $("#home>div.infobox").animate({'opacity': '1.0', 'left': '105px'}, 500);
        this.infoHidden = false;
    },
    
    hideInfo: function() {
        $("#home>div.infobox").animate({'opacity': '0.2'}, 500, _.bind(function() {
            this.infoHidden = true;
        }, this));
        
    },
    displayBackground: function() {
        if (this.backgroundDisplayed) return;
        var image = new Image();

        var srcs = [];
        if (K5.api.ctx["feed"] &&  K5.api.ctx.feed["cool"] && K5.api.ctx.feed.cool["data"]) {
                //srcs = K5.cool.coolData.data;
                srcs = K5.api.ctx.feed.cool["data"];
        }
	if (srcs.length == 0) return;

        var index = Math.floor(Math.random() * (srcs.length - 1));
        var pid = srcs[index].pid;
        var src = 'api/item/' + pid + '/full';

        image.onload = _.bind(function() {
            

            this.backgroundDisplayed = true;
            $("body").css("background-image", "url(" + src + ")");
            this.showInfo();
            $("body").animate({'backgroundPosition': '50%'}, 600);
            
            
            var a = $("<a/>");
            if(srcs[index].root_title !== srcs[index].title){
                a.text(srcs[index].root_title + " [" + srcs[index].title + "]");
            }else{
                a.text(srcs[index].root_title);
            }
            
            a.attr("href", "");
            
            a.click(function(){
                K5.api.gotoDisplayingItemPage(pid);
            });
            $("#pidinfo").append(a);
            $("#pidinfo").show();
            
//            $("#pidinfo").append(a);
//            if(srcs[index].author){
//                $("#pidinfo").append('<div class="details">' + srcs[index].author + '</div>');
//            }
            
            /* Komentovane podle issue 199
             * 
            
            this.hiddingInfo = setTimeout(function() {
                this.hideInfo();
            }.bind(this), 3000);
            
            */
        }, this);

        image.onerror = _.bind(function() {
            this.displayBackground();
            this.backgroundDisplayed = false;
        }, this);
        image.src = src;
    },
    selBand: function(obj) {
        $('#buttons>div.button').removeClass('sel');

        $("#yearRows>div.row").hide();
        $(obj).addClass('sel');
        var div = $(obj).data("row");
        $("#yearRows>div." + div).show();
    },
    setSizes: function(){
        $("#home div.container").show();
        var h = window.innerHeight - $('#header').height() - $('#footer').height() - $('#buttons').height();
        
        $('#facets').css('top', 0);
        $('#facets').css('overflow', 'auto');
        $('#facets').css('left', 0);
        $('#home div.container').css('height', h); //30 = 2x15 padding 

        $('#facets').css('height', "100%");
        
    },
    getDocs: function() {
        if(this.hasFacets){
            return;
        }
        
        $.get("raw_results.vm?page=home", _.bind(function(data) {
            var json = jQuery.parseJSON(data);
            K5.eventsHandler.trigger("results/loaded", json);
            
            this.hasFacets = true;
            //this.fillFacets(json.facet_counts.facet_fields);
        }, this));
    },
    fillFooter: function(elem, docs){
        var c = $(elem);
        var t = c.find("span").clone();
        c.empty();
        for(var i=0; i<docs.length; i++){
            var thumb = $(t).clone();
            var pid = docs[i].pid;
            var imgsrc = "api/item/" + pid + "/thumb";
            var title = docs[i].title;
            
            var img = thumb.find("img");
            img.attr("src", imgsrc);
            var a = thumb.find("a");
            a.attr("title", title);
            img.data("pid", pid);
            
            
            img.click(function(){
                K5.api.gotoDisplayingItemPage($(this).data('pid'));
            });
            c.append(thumb);
        }
    }
    
};
