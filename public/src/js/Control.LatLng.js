/**
 * 	Provide a control to change the center of the map to a certain LatLng.
 		Modification of the leaflet plugin Leaflet.latlngcontrol
 		Github: https://github.com/jieter/Leaflet.latlngcontrol
 */
L.Control.LatLng = L.Control.extend({
	options: {
		position: 'topright',
		editable: true,
		precision: 5
	},

	onAdd: function (map) {
		var className = 'leaflet-bar leaflet-control-latlng',
			container = L.DomUtil.create('div', className);

		this._latLbl = L.DomUtil.create('label', 'lat-control-label', container);
		this._lat = L.DomUtil.create('input', 'leaflet-control-lat', container);
		this._lngLbl = L.DomUtil.create('label', 'lng-control-label', container);
		this._lng = L.DomUtil.create('input', 'leaflet-control-lng', container);
		this._zoomLbl = L.DomUtil.create('label', 'zoom-control-label', container);
		this._zoom = L.DomUtil.create('input', 'leaflet-control-zoom', container);



		if (!L.Browser.touch) {
			L.DomEvent
				.disableClickPropagation(container)
				.disableScrollPropagation(container);
		} else {
			L.DomEvent.on(container, 'click', L.DomEvent.stopPropagation);
		}

		// Update map after change in input.
		L.DomEvent
			.on(this._lat, 'change', this._updateMap, this)
			.on(this._lng, 'change', this._updateMap, this)
			.on(this._zoom, 'change', this._zoomMap, this);

		// Update control after view changes
		L.DomEvent.on(map, 'viewreset moveend drag', this._updateControl, this);

		if (!this.options.editable) {
			this._lat.disabled = "disabled";
			this._lng.disabled = "disabled";
			this._zoom.disabled = "disabled";
		}

		return container;
	},

	getValue: function () {
		return [this._lat.value, this._lng.value, this._zoom.value];
	},

	_updateControl: function (init) {
		if (this._map && this._map._loaded) {
			var center = this._map.getCenter();
			this._lat.value = L.Util.formatNum(center.lat, this.options.precision);
			this._lng.value = L.Util.formatNum(center.lng, this.options.precision);
			this._zoom.value = this._map.getZoom();
		}
	},

	_updateMap: function () {
		if (this._map) {
			this._map.panTo(this.getValue())
		}
	},
	_zoomMap: function () {
		if(this._map) {
			console.log(this.getValue());
			this._map.setZoom(this.getValue()[2]);
		}
	}
});

L.control.latLng = function (options) {
	return new L.Control.LatLng(options);
};

L.Map.mergeOptions({
	latLngControl: true
});

L.Map.addInitHook(function () {
	if (this.options.latLngControl) {
		this.latLngControl = L.control.latLng().addTo(this);
		// this.addControl(this.latLngControl);
	}
});
