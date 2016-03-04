(function( $ ){
	if( !$ ){
		throw new Error( 'jQuery is required.' );
	}

	l = function(){
		console.log( arguments[0] );
	};


	/**
	 * Modal Constructor
	 * @constructor
	 */
	var Modal = function( elem, settings ){
		this.isVisible = false;
		elem = $( '<div></div>' ).append( elem );
		this.elem = $( elem );
		this.elem.unwrap();
		this.modalID = Modal.getNewId();
		this.settings = $.extend( {}, Modal.defaults, settings );
	};

	Modal.defaults = {
		zIndexStart            : 100,
		size                   : 'md',    // Small, Medium or Large
		position               : 'fixed', // Fixed or Absolute
		allowClose             : true,
		autoClose              : false,
		overlayDisplayAnimation: {
			opacity: 'show'
		},
		modalContainerCssClass : 'simple-modal-container',
		modalCssClass          : 'modal-box'
	};

	/**
	 * Returns new instance of modal
	 * @param elem
	 * @param settings
	 * @returns {Modal}
	 */
	Modal.new = function( elem, settings ){
		return new Modal( elem, typeof settings === 'object' ? settings : {} );
	};

	/**
	 * Generates new zIndex for modal
	 * @returns {number}
	 */
	Modal.getNewZIndex = function(){
		if( typeof Modal.currentZIndex === 'undefined' ){
			return Modal.currentZIndex = Modal.defaults.zIndexStart;
		}
		return ++Modal.currentZIndex;
	};

	/**
	 * Generates new ID for modal
	 * @returns {number}
	 */
	Modal.getNewId = function(){
		if( typeof Modal.modalLastId === 'undefined' ){
			return Modal.modalLastId = 1;
		}
		return ++Modal.modalLastId;
	};

	Modal.attachEventHandlers = function(){
		// Close Modal Event Handlers
		$( document ).on( 'click', function( event ){
			var $target = $( event.target ), modal;

			if( $target.is( '.' + Modal.defaults.modalContainerCssClass.split( ' ' )[0] ) ){
				modal = $target;
			}
			else if( $target.is( "[data-role='close-modal']" ) ){
				modal = $target.closest( '.' + Modal.defaults.modalContainerCssClass.split( ' ' )[0] );
			}

			if( modal && modal.data( 'simple-modal' ) ){
				modal.data( 'simple-modal' ).close();
				event.preventDefault();
			}
		} );

		// Open Modal Event Handlers
		$( document ).on( 'click', '[data-toggle="simple-modal"]', function( event ){
			var $this = $( this );
			if( $this.data( 'target' ) ){
				var modal = Modal.new( $( $this.data( 'target' ) ).html(), Modal.generateSettingsFromAttributes($this) );
				modal.open();
			}
			event.preventDefault();
		} );
	};

	Modal.generateSettingsFromAttributes = function(elem){
		l(elem);
		return {};
	};

	/**
	 * Globalize the modal
	 * @type {Modal}
	 */
	$.modal = Modal;
	$.modal.attachEventHandlers();

	/////////////////////////////////////////////
	/**
	 * Creates modal DOM
	 */
	Modal.prototype.getModal = function(){
		if( typeof this.modalDOM === 'undefined' ){
			var modal = $( '<div></div>' ), modalInner, $body = $( 'body' );
			modal.addClass( this.settings.modalContainerCssClass );
			modal.attr( 'id', 'simple-modal-' + this.modalID );

			modalInner = $( '<div></div>' );
			modalInner.addClass( this.settings.modalCssClass );
			modalInner.addClass( 'simple-modal' );

			modalInner.append( this.elem );

			modal.append( modalInner );

			modal.data( 'simple-modal', this );
			this.modalDOM = modal;
			$body.append( modal );

			switch( this.settings.size ){
				case 'sm':
				case 'md':
				case 'lg':
					modalInner.addClass( 'modal-' + this.settings.size );
					break;
				default:
					modalInner.css( 'width', this.settings.size );
					break;
			}

			if( this.settings.position === 'fixed' ){
				$body.data( '_default_overflow', $body.css( 'overflow' ) );
				$body.css( 'overflow', 'hidden' );
			}
		}
		return this.modalDOM;
	};


	/**
	 * Opens the modal
	 */
	Modal.prototype.open = function(){
		var that = this;
		this.isVisible = true;
		var modal = this.getModal();

		modal.css( 'z-index', Modal.getNewZIndex() );

		modal.fadeIn();
		modal.addClass( 'active' );

		if( this.settings.autoClose ){
			setTimeout( function(){
				that.close();
			}, this.settings.autoClose );
		}
	};

	/**
	 * Closes the modal
	 */
	Modal.prototype.close = function( forceClose ){
		var that = this, modal = this.getModal();

		if( !this.settings.allowClose && !forceClose ){
			modal.addClass( 'invalid' );
			setTimeout( function(){
				modal.removeClass( 'invalid' );
			}, 900 );

			return false;
		}

		this.isVisible = false;


		modal.removeClass( 'active' );
		modal.fadeOut( function(){
			that.destroy();
		} );
	};


	/**
	 * Destroys modal
	 */
	Modal.prototype.destroy = function(){

		this.getModal().remove();

		var $body = $( 'body' );

		if( this.settings.position === 'fixed' ){
			$body.css( 'overflow', $body.data( '_default_overflow' ) );
		}

		return this;
	};


	/**
	 * Brings modal to front (updates modal z-index)
	 */
	Modal.prototype.bringToFront = function(){
		this.getModal().css( 'z-index', Modal.getNewZIndex() );

		return this;
	};


	/**
	 * Toggle displays the modal
	 */
	Modal.prototype.toggleShow = function(){
		if( this.isVisible ){
			this.close();
		}
		else{
			this.open();
		}
	};


	//jQuery( function( $ ){
	//	setTimeout( function(){
	//		var modal = $.modal.new( '<p>:D</p><a href="#" data-role="close-modal">Close Modal</a>', {
	//			allowClose: false,
	//		} );
	//		modal.open();
	//		setTimeout( function(){
	//			//var modal = $.modal.new( '<p>Another</p>' );
	//			//modal.open();
	//
	//		}, 2000 );
	//
	//	}, 1000 );
	//} );

})( jQuery );