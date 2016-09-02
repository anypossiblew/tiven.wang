jQuery.sap.require("sap/ui/thirdparty/d3");
jQuery.sap.require("sap/d3/d3LayoutCloud");

/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2016 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global', 'sap/ui/core/Control'], function(q, C) {
 	'use strict';

 	var wordCloud = C.extend('sap.d3.WordCloud', {
 		metadata: {
 			properties: {
 				"width" : {type : "int", defaultValue : "400"},
        		"height" : {type : "int", defaultValue : "400"},
        		"words": {type: "Object", defaultValue: [{key: "No Data", value: "1"}]}
 			},
 			aggregations: {},  
 			events: {
 			}
 		}
 	});

 	wordCloud.prototype.onAfterRendering = function() {

 		var containerId = this.getId();

 		var fill = d3.scale.category20b();

		var width = this.getWidth(),
		    height = this.getHeight();

		var max, fontSize;

		var layout = d3.layout.cloud()
		        .timeInterval(Infinity)
		        .size([width, height])
		        .fontSize(function(d) {
		            return fontSize(+d.value);
		        })
		        .text(function(d) {
		            return d.key;
		        })
		        .on("end", draw);

		var svg = d3.select("#"+containerId).append("svg")
		        .attr("width", width)
		        .attr("height", height);

		var vis = svg.append("g").attr("transform", "translate(" + [width >> 1, height >> 1] + ")");

		update(this.getWords());

		window.onresize = function(event) {
		    update();
		};

		function draw(data, bounds) {
		    var w = width,
		        h = height;

		    svg.attr("width", w).attr("height", h);

		    var scale = bounds ? Math.min(
		            w / Math.abs(bounds[1].x - w / 2),
		            w / Math.abs(bounds[0].x - w / 2),
		            h / Math.abs(bounds[1].y - h / 2),
		            h / Math.abs(bounds[0].y - h / 2)) / 2 : 1;

		    var text = vis.selectAll("text")
		            .data(data, function(d) {
		                return d.text.toLowerCase();
		            });
		    text.transition()
		            .duration(1000)
		            .attr("transform", function(d) {
		                return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
		            })
		            .style("font-size", function(d) {
		                return d.size + "px";
		            });
		    text.enter().append("text")
		            .attr("text-anchor", "middle")
		            .attr("transform", function(d) {
		                return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
		            })
		            .style("font-size", function(d) {
		                return d.size + "px";
		            })
		            .style("opacity", 1e-6)
		            .transition()
		            .duration(1000)
		            .style("opacity", .7);
		    text.style("font-family", function(d) {
		                return d.font;
		            })
		            .style("fill", function(d) {
		                return fill(d.text.toLowerCase());
		            })
		            .text(function(d) {
		                return d.text;
		            });
		    text.on("mouseover", function(d,i) {
		                d3.select(this)
		                    .style("cursor", function(d) { return 'pointer'; })
		                    .style("z-index", function(d) { return '1000'; })
		                    .transition()
		                    .duration(300)
		                    .attr("transform", function(d) {
		                        return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")scale(2)";
		                    })
		                    .style("opacity", 1);
		                    
		            })
		            .on("mouseout", function(d,i) {
		                d3.select(this).transition()
		                    .style("z-index", function(d) { return '1'; })
		                    .duration(200)
		                    .attr("transform", function(d) {
		                        return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")scale(1)";
		                    })
		                    .style("opacity", .7);
		            });

		    vis.transition().attr("transform", "translate(" + [w >> 1, h >> 1] + ")scale(" + scale + ")");
		}

		function update(tags) {
		    layout.font('impact').spiral('archimedean');
		    fontSize = d3.scale['sqrt']().range([10, 100]);
		    if (tags.length){
		        fontSize.domain([+tags[tags.length - 1].value || 1, +tags[0].value]);
		    }
		    layout.stop().words(tags).start();
		}
 	};

 	return wordCloud;
}, true);