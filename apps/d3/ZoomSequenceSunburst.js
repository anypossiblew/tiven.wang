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

  var hue = d3.scaleOrdinal(d3.schemeCategory10);

  var luminance = d3.scaleSqrt()
    .domain([0, 1e6])
    .clamp(true)
    .range([90, 20]);

  function ZoomSequenceSunburst(container, options, data) {
      this.container = container;
      /**
       * depth: the max depth of displayed hierarchy nodes
       * innerHeigh: 
       */
      this.options = options || {
      };
      // 当前显示的根node的depth
      this._depth = 0;
      // 全体数据的depth
      this.depth = 0;

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

      var that = this;
      this.arc = d3.arc()
          .startAngle(function(d) { return d.x0; })
          .endAngle(function(d) { return d.x1; })
          .innerRadius(function(d) { 
            return radius / (that.depth + (that.options.innerHeigh||1) + 1) *
             (d._depth + (that.options.innerHeigh||1) - 1); 
          })
          .outerRadius(function(d) { 
            return radius / (that.depth + (that.options.innerHeigh||1) + 1) *
             (d._depth + (that.options.innerHeigh||1)) - 1; 
          })
          .padAngle(function(d) {return .01;})
          .padRadius(function(d) {return radius / (that.depth + 2);});

      return this;
  }

  ZoomSequenceSunburst.prototype.fill = function(_fill) {
    this._fill = _fill;
    return this;
  };

  ZoomSequenceSunburst.prototype._fill = function(d) {
    var p = d;
    while (p.depth > 1) p = p.parent;
    var c = d3.lab(hue(p.data.name));
    c.l = luminance(d.value||0);
    return c;
  }

  ZoomSequenceSunburst.prototype.create = function(json) {
    var that = this;
      // Basic setup of page elements.
    this._initializeBreadcrumbTrail();
    // this._drawLegend();
    // d3.select("#togglelegend").on("click", this.toggleLegend.bind(this));

    // Bounding circle underneath the sunburst, to make it easier to detect
    // when the mouse leaves the parent g.
    this._center = this.vis.append("svg:circle")
        .attr("r", this.radius)
        .style("opacity", 0)
        .on("click", this._zoomOut.bind(this));

    var hierarchy = d3.hierarchy(json)
                      .sum(function(d) { 
                        return d.size; 
                      })
                      .each(function(d) {
                          d._children = d.children;
                          d._depth = d.depth;
                          d.key = that._key(d);
                          d.fill = that._fill(d);
                      });
    this.depth = that.options.depth || hierarchy.height;
    if(this.options.depth) {
      hierarchy.each(function(d) { 
        d._depth < that.options.depth ? null : d.children = null; 
      });
    }

    // For efficiency, filter nodes to keep only those large enough to see.
    var nodes = this.partition(hierarchy).descendants();

    this._path = this.vis.selectAll("path")
        .data(nodes)
        .enter().append("svg:path")
        .attr("display", function(d) { return d._depth ? null : "none"; })
        .attr("d", this.arc)
        .attr("fill-rule", "evenodd")
        .style("fill", function(d) { return d.fill; })
        .style("opacity", 1)
        .each(function(d) { this._current = that._updateArc(d); })
        .on("mouseover", this._mouseover.bind(this))
        .on("click", this._zoomIn.bind(this));

    // Add the mouseleave handler to the bounding circle.
    d3.select("#container").on("mouseleave", this._mouseleave.bind(this));

    // Get total size of the tree = value of root node from partition.
    this.totalSize = this._path.node().__data__.value;
  };

  ZoomSequenceSunburst.prototype._key = function(d) {
    var k = [], p = d;
    while (p.depth) k.push(p.data.name), p = p.parent;
    return k.reverse().join(".");
  }

  ZoomSequenceSunburst.prototype._zoomIn = function(d, i) {
    if (d._depth > 1) {
      d = d.parent;
    }
    if (!d.children) return;
    this._zoom(d, d);
  };

  ZoomSequenceSunburst.prototype._zoomOut = function(d, i) {
    if (!d || !d.parent) return;
      this._zoom(d.parent, d);
  };

  ZoomSequenceSunburst.prototype._zoom = function(root, p) {
    if (document.documentElement.__transition) return;

    this._depth = root.depth ;

    var that = this;

    // Rescale outside angles to match the new layout.
    var enterArc,
        exitArc,
        outsideAngle = d3.scaleLinear().domain([0, 2 * Math.PI]),
        arc = this.arc;

    function insideArc(d) {
      return p._depth > d._depth ?
        {_depth: d._depth - 1, x0: 0, x1: 0} : p._depth > d._depth ?
          {_depth: d._depth - 1, x0: 2 * Math.PI, x1: 2 * Math.PI}
          : {_depth: 0, x0: 0, x1: 2 * Math.PI};
      // return p.key > d.key
      //   ? {depth: d.depth - 1, x0: 0, x1: 0} : p.key < d.key
      //   ? {depth: d.depth - 1, x0: 2 * Math.PI, x1: 2 * Math.PI}
      //     : {depth: 0, x0: 0, x1: 2 * Math.PI};
    }

    function outsideArc(d) {
      return {
        _depth: d._depth + 1, 
        x0: outsideAngle(d.x0), 
        x1: outsideAngle(d.x1)
      };
    }

    this._center.datum(root);

    // When zooming in, arcs enter from the outside and exit to the inside.
    // Entering outside arcs start from the old layout.
    if (root === p) 
      enterArc = outsideArc, 
      exitArc = insideArc, 
      outsideAngle.range([p.x0, p.x1]);

    root.eachBefore(function(d) {
      d._depth = d.depth - that._depth;
      if(that.options.depth) {
        if(d._depth < that.options.depth ) {
          if(!d.children && d._children) {
            d.children = d._children;
          }
        }else {
          d.children = null;
        }
      }
    });
    var nodes = this.partition(root).descendants().slice(1);
    var path = this._path = this._path.data(nodes, function(d){return d.key;});
    
    // When zooming out, arcs enter from the inside and exit to the outside.
    // Exiting outside arcs transition to the new layout.
    if (root !== p) 
      enterArc = insideArc, 
      exitArc = outsideArc, 
      outsideAngle.range([p.x0, p.x1]);

    var t = d3.transition()
      .duration(500)
      .ease(d3.easeSinOut);

    path.exit().transition(t)
      .style("fill-opacity", function(d) { 
        return d._depth === 1 + (root === p) ? 1 : 0; 
      })
      .attrTween("d", function(d) { 
        return arcTween.call(this, exitArc(d)); 
      })
      .remove();

    this._path = path.enter().append("path")
      .style("fill-opacity", function(d) { 
        return 0; 
      })
      .attr("fill-rule", "evenodd")
      .style("fill", function(d) { return d.fill; })
      //.attr("d", this.arc)
      .on("click", this._zoomIn.bind(this))
      .on("mouseover", this._mouseover.bind(this))
      .each(function(d) { this._current = enterArc(d); })
    .merge(path);

    this._path.transition(t)
      .style("fill-opacity", function(d) { 
        return 1; 
      })
      .attrTween("d", function(d) { 
        return arcTween.call(this, that._updateArc(d)); 
      });

    function arcTween(b) {
      var i = d3.interpolate(this._current, b);
      this._current = i(0);
      return function(t) {
        return arc(i(t));
      };
    }
  };

  ZoomSequenceSunburst.prototype._updateArc = function(d) {
    return {
        _depth: d._depth, 
        x0: d.x0, 
        x1: d.x1
      };
  };

  ZoomSequenceSunburst.prototype.onMouseover= function(_onMouseover) {
    this._onMouseover = _onMouseover;
    return this;
  };

  ZoomSequenceSunburst.prototype._onMouseover = function(d){};

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

    this._onMouseover();

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

    if (document.documentElement.__transition) return;

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

  var sequence = "#sequence";

  ZoomSequenceSunburst.prototype._initializeBreadcrumbTrail = function() {
    // Add the svg area.
    var trail = d3.select(sequence).append("svg:svg")
        .attr("width", this.options.width)
        .attr("height", 50)
        .attr("id", "trail");
    // Add the label at the end, for the percentage.
    trail.append("svg:text")
      .attr("id", "endlabel")
      .style("fill", "#000");
  };

  ZoomSequenceSunburst.prototype.breadcrumbText= function(_breadcrumbText) {
    this._breadcrumbText = _breadcrumbText;
    return this;
  };

  ZoomSequenceSunburst.prototype._breadcrumbText= function(d) {
    return d.data.name;
  };

  // Update the breadcrumb trail to show the current sequence and percentage.
  ZoomSequenceSunburst.prototype._updateBreadcrumbs = function(nodeArray, percentageString) {
    var that = this;
    var b = this.options.breadCrumb;
    // Data join; key function combines name and depth (= position in sequence).
    var g = d3.select(sequence+ " #trail")
        .selectAll("g")
        .data(nodeArray, function(d) { return d.data.name + d.depth; });

    // Add breadcrumb and label for entering nodes.
    var entering = g.enter().append("svg:g");

    entering.append("svg:polygon")
        .attr("points", this.breadcrumbPoints.bind(this))
        .style("fill", function(d) { return d.fill; });

    entering.append("svg:text")
        .attr("x", (b.w + b.t) / 2)
        .attr("y", b.h / 2)
        .attr("dy", "0.35em")
        .attr("text-anchor", "middle")
        .text(this._breadcrumbText);

    // Set position for entering and updating nodes.
    entering.attr("transform", function(d, i) {
      return "translate(" + i * (b.w + b.s) + ", 0)";
    });

    // Remove exiting nodes.
    g.exit().remove();

    // Now move and update the percentage at the end.
    d3.select(sequence + " #trail").select("#endlabel")
        .attr("x", (nodeArray.length + 0.5) * (b.w + b.s))
        .attr("y", b.h / 2)
        .attr("dy", "0.35em")
        .attr("text-anchor", "middle")
        .text(percentageString);

    // Make the breadcrumb trail visible, if it's hidden.
    d3.select(sequence + " #trail")
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