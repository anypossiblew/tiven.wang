(function ( root, factory ) {
    if ( typeof exports === 'object' ) {
        // CommonJS
        exports = factory( root, require('leaflet') );
    } else if ( typeof define === 'function' && define.amd ) {
        // AMD. Register as an anonymous module.
        define( ['exports', 'leaflet'], factory);
    } else {
        // Browser globals
        factory( root, root.L );
    }
}(this, function ( module, lfDumy ) {

return module.LegendControl = L.control.LegendControl = L.Control.extend({
 
  options: {
    position: 'topleft',
    collapse: false
  },
 
  onAdd: function (map) {
    var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-legend');
 
    container.style.backgroundColor = 'white';

    var div = L.DomUtil.create('div', '', container);

    var toggle = L.DomUtil.create('a', 'leaflet-control-zoom-in', container);
    toggle.text = '▆';
    toggle.href = '#';
    if(!this.options.collapse) {
    	toggle.style.display = "none";
    }
    
    var labels = this.options.labels;

    this.options.colors.forEach(function(color, i) {
    	var legend = L.DomUtil.create('div', 'legend-item', div);

 		legend.innerHTML = '<span style="color:'+color+';">▆</span><span class="legend-label">'+labels[i]+'</span>';
    });

    if(this.options.collapse) {
    	div.style.display = "none";
    }

    L.DomEvent.addListener(container, 'click', function(event) {
        event.preventDefault();
        event.stopPropagation();
        if(this.options.collapse) {
            div.style.display = "block";
            toggle.style.display = "none";
            this.options.collapse = false;
        }else {
            div.style.display = "none";
            toggle.style.display = "block";
            this.options.collapse = true;
        }
    }.bind(this));
    
    return container;
  },
 
});

}));