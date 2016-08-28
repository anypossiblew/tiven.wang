jQuery.sap.require("sap/ui/thirdparty/d3");
//jQuery.sap.require("http://d3js.org/d3.v3.min.js");

/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2016 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
 sap.ui.define(['jquery.sap.global', 'sap/ui/core/Control'], function(q, C) {
 	'use strict';

 	var bilevelPartition = C.extend('sap.d3.BilevelPartition', {
 		metadata: {
 			properties: {
 				"zoom": {type: "int", defaultValue: "3"},
 				"width" : {type : "sap.ui.core.CSSSize", defaultValue : "100%"},
        		"height" : {type : "sap.ui.core.CSSSize", defaultValue : "400px"},
        		"breadcrumb": {type: "Object", defaultValue: {w: 115, h: 30, s: 3, t: 10}},
        		"partitionMargin": {type: "Object", defaultValue: {top: 200, right: 330, bottom: 200, left: 230}},
        		"partitionData": {type: "Object"},
        		"rendered":{type: "Boolean", defaultValue:false}
 			},
 			aggregations: {},  
 			events: {
 			}  
 		}
 	});

 	bilevelPartition.prototype.onBeforeRendering = function() {
 		this._detachEventListeners();
 	};

 	bilevelPartition.prototype.onAfterRendering = function() {
 		// if(this.getRendered()) {
 		// 	return;
 		// }
 		this.setProperty("rendered", true);

 		var containerId = this.getId();
 		var margin = this.getPartitionMargin();
      
		var radius = this.radius = Math.min(margin.top, margin.right, margin.bottom, margin.left) - 10;

		var svg = this.svg = d3.select("#"+containerId).append("svg")
			.attr("width", margin.left + margin.right)
			.attr("height", margin.top + margin.bottom)
			.append("g")
			.attr("id", "container")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		var partition = this.partition 
			= d3.layout.partition()
			.sort(function(a, b) { return d3.ascending(a.name, b.name); })
			.size([2 * Math.PI, radius]);

		var arc = this.arc = d3.svg.arc()
			.startAngle(function(d) { return d.x; })
			.endAngle(function(d) { return d.x + d.dx ; })
			//.padAngle(.01)
			//.padRadius(radius / 3)
			.innerRadius(function(d) { return radius / 3 * d.depth; })
			.outerRadius(function(d) { return radius / 3 * (d.depth + 1) - 1; });
		
		if (this.getPartitionData()) {
			this.createPartition();
		}
		
	};

	bilevelPartition.prototype.init = function() {
        //this.data('sap-ui-fastnavgroup', 'true', true);
    };

    bilevelPartition.prototype.exit = function() {
    	this._detachEventListeners();
    };

    bilevelPartition.prototype._attachEventListeners = function() {      
	},

	bilevelPartition.prototype._detachEventListeners = function() {    
	};

	bilevelPartition.prototype.setPartitionData = function(v, s) {
		if (this.getPartitionData() === v) {
            return this;
        }

        this.setProperty("partitionData", v);

        if(this.partition) {
        	this.createPartition();
        }
        
	};

	bilevelPartition.prototype.createPartition = function() {
		var partition = this.partition,
			arc = this.arc,
			radius = this.radius,
			that = this,
			data = this.getPartitionData();

		var hue = d3.scale.category10();
		var luminance = d3.scale.sqrt()
			.domain([0, 1e6])
			.clamp(true)
			.range([90, 20]);

		this._initializeBreadcrumbTrail();

		partition
			.value(function(d) { return d.size; })
			.nodes(data)
			.forEach(function(d) {
				d._children = d._children || d.children;
				d.sum = d.value;
				d.key = key(d);
				d.fill = fill(d);
			});

		partition
			.children(function(d, depth) { return depth < 2 ? d._children : null; })
			.value(function(d) { return d.sum; });

		var center = this.svg.append("circle")
			.attr("r", radius / 3)
			.on("click", zoomOut);

		center.append("title")
			.text("zoom out");

		var path = this.svg.selectAll("path")
			.data(partition.nodes(data).slice(1))
			.enter().append("path")
			.attr("d", arc)
			.style("fill", function(d) { return d.fill; })
			.each(function(d) { this._current = updateArc(d); })
			.on("click", zoomIn)
			.on("mouseover", function(d) {
				that._mouseover(d);
			});

		function key(d) {
			var k = [], p = d;
			while (p.depth) k.push(p.name), p = p.parent;
			return k.reverse().join(".");
		};

		function fill(d) {
			var p = d;
			while (p.depth > 1) p = p.parent;
			var c = d3.lab(hue(p.name));
			c.l = luminance(d.sum);
			return c;
		}

		function updateArc(d) {
			return {depth: d.depth, x: d.x, dx: d.dx};
		}

		function arcTween(b) {
		  var i = d3.interpolate(this._current, b);
		  this._current = i(0);
		  return function(t) {
		    return arc(i(t));
		  };
		}

		function zoomIn(p) {
			if (p.depth > 1) p = p.parent;
			if (!p.children) return;
			zoom(p, p);
		}

		function zoomOut(p) {
			if (!p || !p.parent) return;
			zoom(p.parent, p);
		}

		// Zoom to the specified new root.
		function zoom(root, p) {
		  	if (document.documentElement.__transition__) return;

		    // Rescale outside angles to match the new layout.
		    var enterArc,
		    exitArc,
		    outsideAngle = d3.scale.linear().domain([0, 2 * Math.PI]);

		    function insideArc(d) {
		    	return p.key > d.key
		    	? {depth: d.depth - 1, x: 0, dx: 0} : p.key < d.key
		    	? {depth: d.depth - 1, x: 2 * Math.PI, dx: 0}
		    	: {depth: 0, x: 0, dx: 2 * Math.PI};
		    }

		    function outsideArc(d) {
		    	return {depth: d.depth + 1, x: outsideAngle(d.x), dx: outsideAngle(d.x + d.dx) - outsideAngle(d.x)};
		    }

		    center.datum(root);

		    // When zooming in, arcs enter from the outside and exit to the inside.
		    // Entering outside arcs start from the old layout.
		    if (root === p) enterArc = outsideArc, exitArc = insideArc, outsideAngle.range([p.x, p.x + p.dx]);

		    path = path.data(partition.nodes(root).slice(1), function(d) { return d.key; });

		    // When zooming out, arcs enter from the inside and exit to the outside.
		    // Exiting outside arcs transition to the new layout.
		    if (root !== p) enterArc = insideArc, exitArc = outsideArc, outsideAngle.range([p.x, p.x + p.dx]);

		    d3.transition().duration(d3.event.altKey ? 7500 : 750).each(function() {
		    	path.exit().transition()
		    	.style("fill-opacity", function(d) { return d.depth === 1 + (root === p) ? 1 : 0; })
		    	.attrTween("d", function(d) { return arcTween.call(this, exitArc(d)); })
		    	.remove();

		    	path.enter().append("path")
		    	.style("fill-opacity", function(d) { return d.depth === 2 - (root === p) ? 1 : 0; })
		    	.style("fill", function(d) { return d.fill; })
		    	.on("click", zoomIn)
		    	.on("mouseover", function(d) { that._mouseover(d); })
		    	.each(function(d) { this._current = enterArc(d); });

		    	path.transition()
		    	.style("fill-opacity", 1)
		    	.attrTween("d", function(d) { return arcTween.call(this, updateArc(d)); });
		    });
		}
	};

	bilevelPartition.prototype._mouseover = function(d) {

		d3.select("#explanation")
		.text(d.name);

		d3.select("#explanation")
		.style("visibility", "");

		var sequenceArray = getAncestors(d);

	 	this._updateBreadcrumbs(sequenceArray, d.value);

	 		// Given a node in a partition layout, return an array of all of its ancestor
		// nodes, highest first, but excluding the root.
		function getAncestors(node) {
		  var path = [];
		  var current = node;
		  while (current.parent) {
		    path.unshift(current);
		    current = current.parent;
		  }
		  return path;
		}

	};

	bilevelPartition.prototype._initializeBreadcrumbTrail = function () {
		var margin = this.getPartitionMargin();
	  // Add the svg area.
	  var trail = d3.select("#sequence").append("svg:svg")
	      .attr("width", margin.left + margin.right)
	      .attr("height", 50)
	      .attr("id", "trail");
	  // Add the label at the end, for the percentage.
	  trail.append("svg:text")
	    .attr("id", "endlabel")
	    .style("fill", "#000");
	};

	// Update the breadcrumb trail to show the current sequence and percentage.
	bilevelPartition.prototype._updateBreadcrumbs= function (nodeArray, percentageString) {
		var b = this.getBreadcrumb();
			// Generate a string that describes the points of a breadcrumb polygon.
		function breadcrumbPoints(d, i) {
		  var points = [];
		  points.push("0,0");
		  points.push(b.w + ",0");
		  points.push(b.w + b.t + "," + (b.h / 2));
		  points.push(b.w + "," + b.h);
		  points.push("0," + b.h);
		  if (i > 0) { // Leftmost breadcrumb; don't include 6th vertex.
		    points.push(b.t + "," + (b.h / 2));
		  }
		  return points.join(" ");
		}


	  // Data join; key function combines name and depth (= position in sequence).
	  var g = d3.select("#trail")
	      .selectAll("g")
	      .data(nodeArray, function(d) { return d.name + d.depth; });

	  // Add breadcrumb and label for entering nodes.
	  var entering = g.enter().append("svg:g");

	  entering.append("svg:polygon")
	      .attr("points", breadcrumbPoints)
	      .style("fill", function(d) { return d.fill; });

	  entering.append("svg:text")
	      .attr("x", (b.w + b.t) / 2)
	      .attr("y", b.h / 2)
	      .attr("dy", "0.35em")
	      .attr("text-anchor", "middle")
	      .text(function(d) { return d.name; });

	  // Set position for entering and updating nodes.
	  g.attr("transform", function(d, i) {
	    return "translate(" + i * (b.w + b.s) + ", 0)";
	  });

	  // Remove exiting nodes.
	  g.exit().remove();

	  // Now move and update the percentage at the end.
	  d3.select("#trail").select("#endlabel")
	      .attr("x", (nodeArray.length + 0.5) * (b.w + b.s))
	      .attr("y", b.h / 2)
	      .attr("dy", "0.35em")
	      .attr("text-anchor", "middle")
	      .text(percentageString);

	  // Make the breadcrumb trail visible, if it's hidden.
	  d3.select("#trail")
	      .style("visibility", "");

	};

	return bilevelPartition;
}, true);
