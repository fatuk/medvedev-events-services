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
		template: $('#availableDragItemTemplate').html(),
		tagName: 'li',
		className: 'services__available-item js-dropItem',
		initialize: function () {
			this.render();
		},
		render: function () {
			var rendered = Mustache.render(this.template, this.model.toJSON());
			this.$el.html(rendered);
			this.$el.addClass('services__available-item_' + this.model.get('icon'));
			this.$el.attr('id', 'dropItem-' + this.model.get('id'));
			return this;
		}
	});

	// Available drag view
	App.Views.AvailableDrag = Backbone.View.extend({
		el: '.js-drag',
		initialize: function () {
			this.collection.on('reset', function () {
				this.render();
			}, this);
		},
		saveSelectedItem: function ($item) {
			$item.css({
				visibility: 'hidden'
			});
			selectedItems.push({
				serviceName: $item.data('serviceName')
			});
			console.log(selectedItems.models.length);
			$('.js-selected').html('');
			selectedItems.each(function (item) {
				$('.js-selected').append('<li>' + item.get('serviceName') + '</li>');
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
				var availableDragItem = new App.Views.AvailableDragItem({
					model: availableItem
				});
				this.$el.append(availableDragItem.$el.data('serviceName', availableItem.get('name')));
				$empty.append('<li class="services__available-empty-item"></li>');
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
	App.Views.AvailableDragItem = Backbone.View.extend({
		template: $('#availableDragItemTemplate').html(),
		tagName: 'li',
		className: 'services__available-item js-dragItem',
		initialize: function () {
			this.render();
		},
		render: function () {
			var rendered = Mustache.render(this.template, this.model.toJSON());
			this.$el.html(rendered);
			this.$el.addClass('services__available-item_' + this.model.get('icon'));
			this.$el.attr('id', 'dragItem-' + this.model.get('id'));
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
		url: $('#availableDragItemTemplate').data('url'),
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
	var availableItems = new App.Collections.AvailableItems(),
		selectedItems = new App.Collections.SelectedItems();

	var appView = new App.Views.App(),
		availableItemsView = new App.Views.AvailableDrag({
			collection: availableItems
		}),
		dropView = new App.Views.Drop({
			collection: selectedItems
		});
});
