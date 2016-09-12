define(["require", "d3", "ZoomSequenceSunburst"], 
function(require, d3, ZoomSequenceSunburst) {
	
	var zSeqSunburst = new ZoomSequenceSunburst("#chart", {
		width: 750,
		height: 600,
		breadCrumb: {
			w: 75, h: 30, s: 3, t: 10
		}
	});

	// Use d3.text and d3.csv.parseRows so that we do not need to have a header
	// row, and can receive the csv as an array of arrays.
	d3.text("/fiori/d3/visit-sequences.csv", function(text) {
	  var csv = d3.csvParseRows(text);
	  var json = buildHierarchy(csv);
	  zSeqSunburst.create(json);
	});


	// Take a 2-column CSV and transform it into a hierarchical structure suitable
	// for a partition layout. The first column is a sequence of step names, from
	// root to leaf, separated by hyphens. The second column is a count of how 
	// often that sequence occurred.
	function buildHierarchy(csv) {
	  var root = {"name": "root", "children": []};
	  for (var i = 0; i < csv.length; i++) {
	    var sequence = csv[i][0];
	    var size = +csv[i][1];
	    if (isNaN(size)) { // e.g. if this is a header row
	      continue;
	    }
	    var parts = sequence.split("-");
	    var currentNode = root;
	    for (var j = 0; j < parts.length; j++) {
	      var children = currentNode["children"];
	      var nodeName = parts[j];
	      var childNode;
	      if (j + 1 < parts.length) {
	   // Not yet at the end of the sequence; move down the tree.
	 	var foundChild = false;
	 	for (var k = 0; k < children.length; k++) {
	 	  if (children[k]["name"] == nodeName) {
	 	    childNode = children[k];
	 	    foundChild = true;
	 	    break;
	 	  }
	 	}
	  // If we don't already have a child node for this branch, create it.
	 	if (!foundChild) {
	 	  childNode = {"name": nodeName, "children": []};
	 	  children.push(childNode);
	 	}
	 	currentNode = childNode;
	      } else {
	 	// Reached the end of the sequence; create a leaf node.
	 	childNode = {"name": nodeName, "size": size};
	 	children.push(childNode);
	      }
	    }
	  }
	  return root;
	}
});
