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
		bigPartyTemplate: $('#bigPartyTemplate').html(),
		bigPartyOpen: function () {
			$('body').append(this.bigPartyTemplate);
			$('body').find('.js-bigPartyModal, .js-bigPartyOverlay').fadeIn('fast');
		},
		bigPartyClose: function () {
			$('body').find('.js-bigPartyModal, .js-bigPartyOverlay').fadeOut('fast', function () {
				$('body').find('.js-bigPartyModal, .js-bigPartyOverlay').remove();
				$.pep.toggleAll(true);
			});
		},
		initialize: function () {
			var self = this;
			$('body').on('click touchend', '.js-bigPartyCloseBtn, .js-bigPartyOverlay', function () {
				self.bigPartyClose();
			});
		}
	});

	// Drop view
	App.Views.Drop = Backbone.View.extend({
		el: '.js-drop',
		events: {
			'click .js-avatarClose': 'closeAvatar',
			'click .js-addBtn': 'addItem',
			'click .js-removeBtn': 'removeItem',
			'mouseup .js-dropItem:not(.pep-start)': 'click',
			'touchend .js-dropItem:not(.pep-start)': 'click',
			'submit #friendsForm': 'sendFriends'
		},
		touch: function () {
			alert('tap');
		},
		sendFriends: function (e) {
			e.preventDefault();

			var $form = $(e.currentTarget),
				dataArray = $form.serializeArray(),
				url = $form.attr('action');

			$.ajax({
				url: url,
				type: 'POST',
				data: dataArray,
			})
				.done(function () {
					console.log("success");
				})
				.fail(function () {
					console.log("error");
				})
				.always(function () {
					console.log("complete");
				});

		},
		addItem: function (e) {
			var $currentTarget = $(e.currentTarget),
				id = $currentTarget.data('id'),
				$selectedItem = dragView.$el.find('#dragItem-' + id);

			// Hide selected drop item
			$selectedItem.css({
				poacity: 0,
				visibility: 'hidden'
			});
			// Save drag selected item
			dragView.saveSelectedItem($selectedItem);
			// Close big avatar
			this.closeAvatar();
		},
		removeItem: function (e) {
			var $currentTarget = $(e.currentTarget),
				id = $currentTarget.data('id'),
				$selectedItem = this.$el.find('#dropItem-' + id),
				$dragItem = dragView.$el.find('#dragItem-' + id);

			// Remove selected item
			$selectedItem.remove();
			// Close big avatar
			this.closeAvatar();
			// Remove model from collection
			dragView.removeSelectedItem($dragItem);
			// Show drag item
			$dragItem.css({
				opacity: 1,
				visibility: 'visible'
			});

			// Hide short info if no models
			if (this.collection.models.length === 0) {
				appView.$el.find('.js-shortInfo').hide();
			}
		},
		click: function (e) {
			var $target = $(e.currentTarget),
				infoAvatarTemplate = $('#selectedItemAvatarTemplate').html(),
				infoTemplate = $('#infoTemplate').html(),
				currentItem = this.collection.findWhere({
					id: $target.data('id')
				}),
				renderedAvatar = Mustache.render(infoAvatarTemplate, currentItem.toJSON()),
				renderedInfo = Mustache.render(infoTemplate, currentItem.toJSON());

			$('.js-itemInfo').html(renderedInfo);

			this.$el.find('.js-avatar').remove();

			this.$el.append(renderedAvatar);
			this.$el.find('.js-addBtn').hide();
			this.$el.find('.js-removeBtn').show();
		},
		closeAvatar: function () {
			// Change buttons add/remove
			$('.js-dragItem').removeClass('active');
			// Clear big avatar
			this.$el.find('.js-avatar').remove();
			// Clear info
			appView.$el.find('.js-itemInfo').html('');
			appView.$el.find('.js-selectedItemName').html('&nbsp;');
		},
		initialize: function () {
			this.collection.on('add remove', function () {
				this.render();
			}, this);
		},
		render: function () {
			var self = this,
				emailText = '';

			// Show short info
			appView.$el.find('.js-shortInfo').show();
			// Clear short info
			appView.$el.find('.js-selected').html('');
			// Clear drop area
			this.$el.find('.js-selectedItems').html('');

			this.collection.each(function (dropItem, index) {
				var dropItemView = new App.Views.DropItem({
					model: dropItem
				});
				if (index + 1 === self.collection.models.length) {
					emailText += dropItem.get('title');
				} else {
					emailText += dropItem.get('title') + ', ';
				}

				this.$el.find('.js-selectedItems').append(dropItemView.$el.data('serviceName', dropItem.get('name')));

				// Render short info
				$('.js-selected').append('<li>' + dropItem.get('title') + '</li>');
			}, this);


			appView.$el.find('#servicesList').val(emailText);

			// Drag init
			$('.js-dropItem').pep({
				droppable: '.js-dragEmpty',
				drag: function (event, object) {
					appView.$el.find('.js-selectedItems').addClass('dragging');
				},
				stop: function (event, object) {
					var $item = $(object.el),
						intersected = this.activeDropRegions.length,
						id = $item.data('id');

					if (intersected) {
						// Remove item
						dragView.removeSelectedItem($item);
						// Show item in drag area
						dragView.$el.find('#dragItem-' + id).css({
							visibility: 'visible',
							opacity: 1
						});
						// Hide short info if no models
						if (self.collection.models.length === 0) {
							appView.$el.find('.js-shortInfo').hide();
						}
					}

					// Remove dragging class
					appView.$el.find('.js-selectedItems').removeClass('dragging');
				},
				revert: true,
				debug: false,
				place: false
			});
		}
	});
	// Drop item view
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
			this.$el.addClass('services__item_' + this.model.get('custom_fields').icon);
			this.$el.addClass('active');
			this.$el.attr('id', 'dropItem-' + this.model.get('id'));
			this.$el.data('id', this.model.get('id'));
			return this;
		}
	});

	// Available drag view
	App.Views.Drag = Backbone.View.extend({
		el: '.js-drag',
		events: {
			'mouseup .js-dragItem:not(.pep-start)': 'click',
			'touchend .js-dragItem:not(.pep-start)': 'click'
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
				infoAvatarTemplate = $('#selectedItemAvatarTemplate').html(),
				infoTemplate = $('#infoTemplate').html(),
				currentItem = this.collection.findWhere({
					id: $target.data('id')
				}),
				renderedAvatar = Mustache.render(infoAvatarTemplate, currentItem.toJSON()),
				renderedInfo = Mustache.render(infoTemplate, currentItem.toJSON());

			$('.js-itemInfo').html(renderedInfo);

			// Change title
			appView.$el.find('.js-selectedItemName').html(currentItem.get('title'));

			$('.js-drop').find('.js-avatar').remove();
			$('.js-dragItem').removeClass('active');
			$target.addClass('active');
			$('.js-drop').append(renderedAvatar);
			$('.js-drop').find('.js-removeBtn').hide();
			$('.js-drop').find('.js-addBtn').show();

		},
		saveSelectedItem: function ($item) {
			var itemId = $item.data('id'),
				currentItem = this.collection.findWhere({
					id: itemId
				});

			$item.css({
				opacity: 0,
				visibility: 'hidden'
			});
			dropItems.push(currentItem);
		},
		removeSelectedItem: function ($item) {
			var itemId = $item.data('id'),
				currentItem = this.collection.findWhere({
					id: itemId
				});

			dropItems.remove(currentItem);
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
				droppable: '.js-drop',
				drag: function () {

				},
				stop: function (event, object) {
					var $item = $(object.el),
						intersected = this.activeDropRegions.length;

					// Check max models count
					if (dropView.collection.models.length === 9) {
						$.pep.toggleAll(false);
						appView.bigPartyOpen();
						return false;
					}

					if (intersected) {
						self.saveSelectedItem($item);

						// Close avatar
						dropView.closeAvatar();
					}

				},
				revert: true,
				debug: false,
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
			this.$el.addClass('services__item_' + this.model.get('custom_fields').icon);
			this.$el.attr('id', 'dragItem-' + this.model.get('id'));
			this.$el.data('id', this.model.get('id'));
			return this;
		}
	});
	// Avatar view
	App.Views.Avatar = Backbone.View.extend({
		el: '.js-avatar',
		events: {
			'click .js-addBtn': 'ч'
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
		parse: function (response) {
			return response.posts;
		},
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
