(function ( root, factory ) {
    if ( typeof exports === 'object' ) {
        // CommonJS
        exports = factory( root, require('d3') );
    } else if ( typeof define === 'function' && define.amd ) {
        // AMD. Register as an anonymous module.
        define( ['exports', 'd3'], factory);
    } else {
        // Browser globals
        factory( root, root.d3 );
    }
}(this, function ( module, d3 ) {

    function ZoomSequenceSunburst(container, options, data) {
        this.container = container;
        this.options = options || {
        };

        var radius = this.radius = Math.min(this.options.width, this.options.height) / 2;

        this.totalSize = 0;

        this.vis = d3.select(container).append("svg:svg")
        .attr("width", this.options.width)
        .attr("height", this.options.height)
        .append("svg:g")
        .attr("id", "container")
        .attr("transform", "translate(" + this.options.width / 2 + "," + this.options.height / 2 + ")");

        this.partition = d3.partition()
            .size([2 * Math.PI, radius * radius]);
            // .value(function(d) { return d.size; });

        this.arc = d3.arc()
            .startAngle(function(d) { return d.x0; })
            .endAngle(function(d) { return d.x1; })
            .innerRadius(function(d) { return Math.sqrt(d.y0); })
            .outerRadius(function(d) { return Math.sqrt(d.y1); })
            .padAngle(function(d) {return .1;})
            .padRadius(function(d) {return 0.1;});

        this.colors = {
          "home": "#5687d1",
          "product": "#7b615c",
          "search": "#de783b",
          "account": "#6ab975",
          "other": "#a173d1",
          "end": "#bbbbbb"
        };
        return this;
    }

    ZoomSequenceSunburst.prototype.create = function(json) {
        var colors = this.colors;
        // Basic setup of page elements.
      this._initializeBreadcrumbTrail();
      this._drawLegend();
      d3.select("#togglelegend").on("click", this.toggleLegend.bind(this));

      // Bounding circle underneath the sunburst, to make it easier to detect
      // when the mouse leaves the parent g.
      this.vis.append("svg:circle")
          .attr("r", this.radius)
          .style("opacity", 0);

      // For efficiency, filter nodes to keep only those large enough to see.
      var nodes = this.partition(d3.hierarchy(json).sum(function(d) { return d.size; })
            .each(function(d) {
                d.color = colors[d.data.name];
            })).descendants();
          // .filter(function(d) {
          // return (d.dx > 0.005); // 0.005 radians = 0.29 degrees
          // });

      var path = this.vis.selectAll("path")
          .data(nodes)
          .enter().append("svg:path")
          .attr("display", function(d) { return d.depth ? null : "none"; })
          .attr("d", this.arc)
          .attr("fill-rule", "evenodd")
          .style("fill", function(d) { return colors[d.data.name]; })
          .style("opacity", 1)
          .on("mouseover", this._mouseover.bind(this));

      // Add the mouseleave handler to the bounding circle.
      d3.select("#container").on("mouseleave", this._mouseleave.bind(this));

      // Get total size of the tree = value of root node from partition.
      this.totalSize = path.node().__data__.value;
    };

    ZoomSequenceSunburst.prototype._mouseover = function(d) {
        var percentage = (100 * d.value / this.totalSize).toPrecision(3);
      var percentageString = percentage + "%";
      if (percentage < 0.1) {
        percentageString = "< 0.1%";
      }

      d3.select("#percentage")
          .text(percentageString);

      d3.select("#explanation")
          .style("visibility", "");

      var sequenceArray = this._getAncestors(d);
      this._updateBreadcrumbs(sequenceArray, percentageString);

      // Fade all the segments.
      d3.selectAll("path")
          .style("opacity", 0.3);

      // Then highlight only those that are an ancestor of the current segment.
      this.vis.selectAll("path")
          .filter(function(node) {
                    return (sequenceArray.indexOf(node) >= 0);
                  })
          .style("opacity", 1);
    };

    ZoomSequenceSunburst.prototype._mouseleave = function(d) {

        var that = this;
      // Hide the breadcrumb trail
      d3.select("#trail")
          .style("visibility", "hidden");

      // Deactivate all segments during transition.
      d3.selectAll("path").on("mouseover", null);

      // Transition each segment to full opacity and then reactivate it.
      d3.selectAll("path")
          .transition()
          .duration(1000)
          .style("opacity", 1)
          .each(function() {
                  d3.select(this).on("mouseover", that._mouseover.bind(that));
                });

      d3.select("#explanation")
          .style("visibility", "hidden");
    };

    ZoomSequenceSunburst.prototype._initializeBreadcrumbTrail = function() {
      // Add the svg area.
      var trail = d3.select("#sequence").append("svg:svg")
          .attr("width", this.options.width)
          .attr("height", 50)
          .attr("id", "trail");
      // Add the label at the end, for the percentage.
      trail.append("svg:text")
        .attr("id", "endlabel")
        .style("fill", "#000");
    };

    // Update the breadcrumb trail to show the current sequence and percentage.
    ZoomSequenceSunburst.prototype._updateBreadcrumbs = function(nodeArray, percentageString) {
        var that = this;
        var b = this.options.breadCrumb;
      // Data join; key function combines name and depth (= position in sequence).
      var g = d3.select("#trail")
          .selectAll("g")
          .data(nodeArray, function(d) { return d.data.name + d.depth; });

      // Add breadcrumb and label for entering nodes.
      var entering = g.enter().append("svg:g");

      entering.append("svg:polygon")
          .attr("points", this.breadcrumbPoints.bind(this))
          .style("fill", function(d) { return that.colors[d.data.name]; });

      entering.append("svg:text")
          .attr("x", (b.w + b.t) / 2)
          .attr("y", b.h / 2)
          .attr("dy", "0.35em")
          .attr("text-anchor", "middle")
          .text(function(d) { return d.data.name; });

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

    // Generate a string that describes the points of a breadcrumb polygon.
    ZoomSequenceSunburst.prototype.breadcrumbPoints = function(d, i) {
        var b = this.options.breadCrumb;
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
    };

    ZoomSequenceSunburst.prototype._drawLegend = function() {

      // Dimensions of legend item: width, height, spacing, radius of rounded rect.
      var li = {
        w: 75, h: 30, s: 3, r: 3
      };

      var legend = d3.select("#legend").append("svg:svg")
          .attr("width", li.w)
          .attr("height", d3.keys(this.colors).length * (li.h + li.s));

      var g = legend.selectAll("g")
          .data(d3.entries(this.colors))
          .enter().append("svg:g")
          .attr("transform", function(d, i) {
                  return "translate(0," + i * (li.h + li.s) + ")";
               });

      g.append("svg:rect")
          .attr("rx", li.r)
          .attr("ry", li.r)
          .attr("width", li.w)
          .attr("height", li.h)
          .style("fill", function(d) { return d.value; });

      g.append("svg:text")
          .attr("x", li.w / 2)
          .attr("y", li.h / 2)
          .attr("dy", "0.35em")
          .attr("text-anchor", "middle")
          .text(function(d) { return d.key; });
    };

    ZoomSequenceSunburst.prototype.toggleLegend = function() {
      var legend = d3.select("#legend");
      if (legend.style("visibility") == "hidden") {
        legend.style("visibility", "");
      } else {
        legend.style("visibility", "hidden");
      }
    };

    // Given a node in a partition layout, return an array of all of its ancestor
    // nodes, highest first, but excluding the root.
     ZoomSequenceSunburst.prototype._getAncestors = function(node) {
      var path = [];
      var current = node;
      while (current.parent) {
        path.unshift(current);
        current = current.parent;
      }
      return path;
    };

    return module.ZoomSequenceSunburst = ZoomSequenceSunburst;
}));