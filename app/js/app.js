$(function(){var e={};e.Collections={},e.Models={},e.Views={},e.Views.App=Backbone.View.extend({el:".js-services",initialize:function(){}}),e.Views.Drop=Backbone.View.extend({el:".js-drop",events:{"click .js-avatarClose":"closeAvatar","click .js-addBtn":"addItem","click .js-removeBtn":"removeItem","mousedown .js-dropItem":"mousedown","mouseup .js-dropItem:not(.pep-start)":"click","mouseout .js-dropItem":"mouseout"},test:function(){console.log("test")},addItem:function(e){var t=$(e.currentTarget),i=t.data("id"),s=n.$el.find("#dragItem-"+i);s.css({poacity:0,visibility:"hidden"}),n.saveSelectedItem(s),this.closeAvatar()},removeItem:function(e){var t=$(e.currentTarget),i=t.data("id"),a=this.$el.find("#dropItem-"+i),o=n.$el.find("#dragItem-"+i);a.remove(),this.closeAvatar(),n.removeSelectedItem(o),o.css({opacity:1,visibility:"visible"}),0===this.collection.models.length&&s.$el.find(".js-shortInfo").hide()},mousedown:function(e){$(e.currentTarget)},mouseup:function(e){$(e.currentTarget)},click:function(e){var t=$(e.currentTarget),i=$("#selectedItemAvatarTemplate").html(),s=$("#infoTemplate").html(),n=this.collection.findWhere({id:t.data("id")}),a=Mustache.render(i,n.toJSON()),o=Mustache.render(s,n.toJSON());$(".js-itemInfo").html(o),this.$el.find(".js-avatar").remove(),this.$el.append(a),this.$el.find(".js-addBtn").hide(),this.$el.find(".js-removeBtn").show()},closeAvatar:function(){$(".js-dragItem").removeClass("active"),this.$el.find(".js-avatar").remove(),s.$el.find(".js-itemInfo").html(""),s.$el.find(".js-selectedItemName").html("&nbsp;")},initialize:function(){this.collection.on("add remove",function(){this.render()},this)},render:function(){s.$el.find(".js-shortInfo").show(),s.$el.find(".js-selected").html(""),this.$el.find(".js-selectedItems").html(""),this.collection.each(function(t){var i=new e.Views.DropItem({model:t});this.$el.find(".js-selectedItems").append(i.$el.data("serviceName",t.get("name"))),$(".js-selected").append("<li>"+t.get("title")+"</li>")},this),$(".js-dropItem").pep({droppable:".js-drag",stop:function(e,t){var i=$(t.el),s=this.activeDropRegions.length,a=i.data("id");s&&(n.removeSelectedItem(i),n.$el.find("#dragItem-"+a).css({visibility:"visible",opacity:1}))},revert:!0,debug:!1,place:!1})}}),e.Views.DropItem=Backbone.View.extend({template:$("#dragItemTemplate").html(),tagName:"li",className:"services__item js-dropItem",initialize:function(){this.render()},render:function(){var e=Mustache.render(this.template,this.model.toJSON());return this.$el.html(e),this.$el.addClass("services__item_"+this.model.get("custom_fields").icon),this.$el.addClass("active"),this.$el.attr("id","dropItem-"+this.model.get("id")),this.$el.data("id",this.model.get("id")),this}}),e.Views.Drag=Backbone.View.extend({el:".js-drag",events:{"mousedown .js-dragItem":"mousedown","mouseup .js-dragItem:not(.pep-start)":"click","mouseout .js-dragItem":"mouseout"},initialize:function(){this.collection.on("reset",function(){this.render()},this)},mousedown:function(e){$(e.currentTarget)},mouseup:function(e){$(e.currentTarget)},click:function(e){var t=$(e.currentTarget),i=$("#selectedItemAvatarTemplate").html(),n=$("#infoTemplate").html(),a=this.collection.findWhere({id:t.data("id")}),o=Mustache.render(i,a.toJSON()),l=Mustache.render(n,a.toJSON());$(".js-itemInfo").html(l),s.$el.find(".js-selectedItemName").html(a.get("title")),$(".js-drop").find(".js-avatar").remove(),$(".js-dragItem").removeClass("active"),t.addClass("active"),$(".js-drop").append(o),$(".js-drop").find(".js-removeBtn").hide(),$(".js-drop").find(".js-addBtn").show()},saveSelectedItem:function(e){var t=e.data("id"),s=this.collection.findWhere({id:t});e.css({opacity:0,visibility:"hidden"}),i.push(s)},removeSelectedItem:function(e){var t=e.data("id"),s=this.collection.findWhere({id:t});i.remove(s)},render:function(){var t=this,i=$(".js-dragEmpty");this.$el.html(""),i.html(""),this.collection.each(function(t){var s=new e.Views.DragItem({model:t});this.$el.append(s.$el.data("serviceName",t.get("name"))),i.append('<li class="services__empty-item"></li>')},this),$(".js-dragItem").pep({droppable:".js-drop",stop:function(e,i){var s=$(i.el),n=this.activeDropRegions.length;n&&t.saveSelectedItem(s)},revert:!0,debug:!1,place:!1})}}),e.Views.DragItem=Backbone.View.extend({template:$("#dragItemTemplate").html(),tagName:"li",className:"services__item js-dragItem",initialize:function(){this.render()},render:function(){var e=Mustache.render(this.template,this.model.toJSON());return this.$el.html(e),this.$el.addClass("services__item_"+this.model.get("custom_fields").icon),this.$el.attr("id","dragItem-"+this.model.get("id")),this.$el.data("id",this.model.get("id")),this}}),e.Views.Avatar=Backbone.View.extend({el:".js-avatar",events:{"click .js-addBtn":"ч"}}),e.Collections.AvailableItems=Backbone.Collection.extend({url:$("#dragItemTemplate").data("url"),parse:function(e){return e.posts},initialize:function(){this.fetch({reset:!0})}}),e.Collections.SelectedItems=Backbone.Collection.extend({});{var t=new e.Collections.AvailableItems,i=new e.Collections.SelectedItems,s=new e.Views.App,n=new e.Views.Drag({collection:t});new e.Views.Drop({collection:i})}});
//# sourceMappingURL=../js/app.js.map