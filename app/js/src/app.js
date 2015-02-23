$(function () {
	var App = {};
	App.Collections = {};
	App.Models = {};
	App.Views = {};

	/*****************
	 *
	 *  Views
	 *
	 ******************/

	// Main view
	App.Views.App = Backbone.View.extend({
		el: '.js-services',
		initialize: function () {

		}
	});

	// Drag view
	App.Views.Drop = Backbone.View.extend({
		el: '.js-drop',
		events: {
			'click .js-avatarClose': 'closeAvatar',
			'click .js-dropItem': 'click'
		},
		click: function (e) {
			var $target = $(e.currentTarget),
				infoTemplate = $('#selectedItemAvatarTemplate').html(),
				currentItem = this.collection.findWhere({
					id: $target.data('id')
				});
			rendered = Mustache.render(infoTemplate, currentItem.toJSON());
			this.$el.find('.js-avatar').remove();
			$('.js-dropItem').removeClass('active');
			$target.addClass('active');
			this.$el.append(rendered);
			this.$el.find('.js-addBtn').hide();
			this.$el.find('.js-removeBtn').show();
		},
		closeAvatar: function () {
			$('.js-dragItem').removeClass('active');
			$('.js-dropItem').removeClass('active');
			this.$el.find('.js-avatar').remove();
		},
		initialize: function () {
			this.collection.on('add', function () {
				this.render();
			}, this);
		},
		render: function () {
			var self = this;

			this.$el.find('.js-selectedItems').html('');
			this.collection.each(function (dropItem, index) {
				var dropItemView = new App.Views.DropItem({
					model: dropItem
				});
				this.$el.find('.js-selectedItems').append(dropItemView.$el.data('serviceName', dropItem.get('name')));
			}, this);

			// Drag init
			$('.js-dragItem').pep({
				initiate: function () {
					// console.log('initiate');
				},
				droppable: '.js-drop',
				stop: function (event, object) {
					var $item = $(object.el),
						intersected = this.activeDropRegions.length;


					if (intersected) {
						self.saveSelectedItem($item);
					}
				},
				revert: true,
				debug: true,
				place: false
			});
		}
	});
	// Drag item view
	App.Views.DropItem = Backbone.View.extend({
		template: $('#dragItemTemplate').html(),
		tagName: 'li',
		className: 'services__item js-dropItem',
		initialize: function () {
			this.render();
		},
		render: function () {
			var rendered = Mustache.render(this.template, this.model.toJSON());
			this.$el.html(rendered);
			this.$el.addClass('services__item_' + this.model.get('icon'));
			this.$el.attr('id', 'dropItem-' + this.model.get('id'));
			this.$el.data('id', this.model.get('id'));
			return this;
		}
	});

	// Available drag view
	App.Views.Drag = Backbone.View.extend({
		el: '.js-drag',
		events: {
			'mousedown .js-dragItem': 'mousedown',
			'mouseup .js-dragItem:not(.pep-start)': 'click',
			'mouseout .js-dragItem': 'mouseout'
		},
		initialize: function () {
			this.collection.on('reset', function () {
				this.render();
			}, this);
		},
		mousedown: function (e) {
			var $target = $(e.currentTarget);
		},
		mouseup: function (e) {
			var $target = $(e.currentTarget);
		},
		click: function (e) {
			var $target = $(e.currentTarget),
				infoTemplate = $('#selectedItemAvatarTemplate').html(),
				currentItem = this.collection.findWhere({
					id: $target.data('id')
				}),
				rendered = Mustache.render(infoTemplate, currentItem.toJSON());

			$('.js-drop').find('.js-avatar').remove();
			$('.js-dragItem').removeClass('active');
			$target.addClass('active');
			$('.js-drop').append(rendered);
			$('.js-drop').find('.js-removeBtn').hide();
			$('.js-drop').find('.js-addBtn').show();

		},
		saveSelectedItem: function ($item) {
			var itemId = $item.data('id'),
				currentItem = this.collection.findWhere({
					id: itemId
				});

			$item.css({
				visibility: 'hidden'
			});
			dropItems.push(currentItem);

			$('.js-selected').html('');
			dropItems.each(function (item) {
				$('.js-selected').append('<li>' + item.get('role') + ' ' + item.get('name') + '</li>');
			});
		},
		removeSelectedItem: function () {

		},
		render: function () {
			var self = this,
				$empty = $('.js-dragEmpty');

			this.$el.html('');
			$empty.html('');
			this.collection.each(function (availableItem, index) {
				var dragItem = new App.Views.DragItem({
					model: availableItem
				});
				this.$el.append(dragItem.$el.data('serviceName', availableItem.get('name')));
				$empty.append('<li class="services__empty-item"></li>');
			}, this);

			// Drag init
			$('.js-dragItem').pep({
				initiate: function () {
					// console.log('initiate');
				},
				droppable: '.js-drop',
				stop: function (event, object) {
					var $item = $(object.el),
						intersected = this.activeDropRegions.length;


					if (intersected) {
						self.saveSelectedItem($item);
					}

				},
				revert: true,
				debug: true,
				place: false
			});
		}
	});
	// Available drag item view
	App.Views.DragItem = Backbone.View.extend({
		template: $('#dragItemTemplate').html(),
		tagName: 'li',
		className: 'services__item js-dragItem',
		initialize: function () {
			this.render();
		},
		render: function () {
			var rendered = Mustache.render(this.template, this.model.toJSON());
			this.$el.html(rendered);
			this.$el.addClass('services__item_' + this.model.get('icon'));
			this.$el.attr('id', 'dragItem-' + this.model.get('id'));
			this.$el.data('id', this.model.get('id'));
			return this;
		}
	});


	/*****************
	 *
	 *  Collections
	 *
	 ******************/

	// Available items
	App.Collections.AvailableItems = Backbone.Collection.extend({
		url: $('#dragItemTemplate').data('url'),
		initialize: function () {
			this.fetch({
				reset: true
			});
		}
	});
	// Selected items
	App.Collections.SelectedItems = Backbone.Collection.extend({});


	/*****************
	 *
	 *  Initialize
	 *
	 ******************/
	var dragItems = new App.Collections.AvailableItems(),
		dropItems = new App.Collections.SelectedItems();

	var appView = new App.Views.App(),
		dragView = new App.Views.Drag({
			collection: dragItems
		}),
		dropView = new App.Views.Drop({
			collection: dropItems
		});
});
