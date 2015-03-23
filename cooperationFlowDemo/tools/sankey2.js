var network = {}; // the network defined as an associative list id:node  : node.refBy node.refTo

var totalInformationdisplayed = 0;

d3.sankey = function() {

var nbSteps = 0;

  var sankey = {},
      nodeWidth = 24,
      nodePadding = 8,
      size = [1, 1],
      nodes = [],
      links = [];

  sankey.nodeWidth = function(_) {
    if (!arguments.length) return nodeWidth;
    nodeWidth = +_;
    return sankey;
  };

  sankey.nodePadding = function(_) {
    if (!arguments.length) return nodePadding;
    nodePadding = +_;
    return sankey;
  };

  sankey.nodes = function(_) {
    if (!arguments.length) return nodes;
    nodes = _;
    return sankey;
  };
  
  
   sankey.selectedNodes = function(number) {
    var nodesS = [];
    var sortedNodes = nodes.slice(0);
    sortedNodes.sort(function(a,b){return b.importance - a.importance;})
    sortedNodes = sortedNodes.slice(0,number);
   
   //console.log("nodes to display selected")
   //console.log(sortedNodes)
    return sortedNodes;
  };
  
  
  sankey.getLinks = function(){
    return links;
  }
  
    sankey.getNodes = function(){
    return nodes;
  }
  

  sankey.links = function(_) {
    if (!arguments.length) return links;
    links = _;

    return sankey;
  };

  sankey.size = function(_) {
    if (!arguments.length) return size;
    size = _;
    return sankey;
  };

  sankey.layout = function(iterations) {
    computeNodeLinks();
    computeByStep();

    
    attributeImportanceToAllNodes();
    //be careful with that ?
    cleanNodesAndLinks();


    
    computeNodeValues();
    computeNodeBreadths();
    
    sankey.setStepAsX();

    
     nodes.forEach(function(node) {
	//  link.dy = link.value * ky;
	  node.alreadyPloted = false;
	});
     
    computeNodeDepths(nodes);
    
          //console.log("test");

    computeLinkDepths();
    
    //console.log("finished to display");
    
    computeTotalInformation();
    return sankey;
  };

  
  sankey.getHighestDateValue = function(){
    var highest = {};
    highest.xDate = Number.NEGATIVE_INFINITY;
    highest.xStep = Number.NEGATIVE_INFINITY;

     nodes.forEach(function(node) {
    
	    node.xDate = node.date;
	    node.xStep = node.step;
	    node.dx = nodeWidth;
    
	    if (node.xDate > highest.xDate) highest.xDate = node.xDate;
	    if (node.xStep > highest.xStep) highest.xStep = node.xStep;
	});
    return highest;
  }

  sankey.relayout = function() {
    computeLinkDepths();
    return sankey;
  };
  
  sankey.link = function() {
    //var curvature = 0.5;

   // console.log("---------------links");
    function link(d) {
      var x0 = d.source.x, //+ d.source.dx,
          x1 = d.target.x,
         // xi = d3.interpolateNumber(x0, x1),
          y0 = d.source.y ,//+ d.sy + d.dy / 2,
          y1 = d.target.y ;//+ d.ty + d.dy / 2;
	  	  
      if (d.target.targetLinks.length>1) {
	return "M" + x0 + "," + y0
           + "L" + x1 + "," + y1;
      }
      
	  
	 // yt = d3.interpolateNumber(y0, y1);
      return "M" + x0 + "," + y0
           + "C" + x0 + "," + y1
           + " " + x0 + "," + y1
           + " " + x1 + "," + y1;
    }

   

    return link;
  };



  // Populate the sourceLinks and targetLinks for each node.
  // Also, if the source and target are not objects, assume they are indices.
  
  function computeNodeLinks() {
    nodes.forEach(function(node) {
      node.sourceLinks = [];
      node.targetLinks = [];
    });
    links.forEach(function(link) {
      var source = link.source,
          target = link.target;
	  
	  //the link.source think is to update the source and target to point directly to objects
      if (typeof source === "number") source = link.source = nodes[link.source];
      if (typeof target === "number") target = link.target = nodes[link.target];
      
      //for the source, put in "sourcelinks" the link in which it is a source. 
      source.sourceLinks.push(link);
       //same for target
      target.targetLinks.push(link);
    });
    
    //compute network in my fashion
    network= {};
    nodes.forEach(function(node) {
      node.refBy = [];
      node.refTo = [];
      network[node.id]=node;
    });
    
     links.forEach(function(link) {

      link.source.refBy.push(link.target);
      link.target.refTo.push(link.source);
    });
    console.log("the network is computed ");

    //console.log(network);
  }
  
  
  sankey.setDateAsX = function (){
    for(n in nodes){
      theNode = nodes[n];
      theNode.x =theNode.xDate;
    }
  }
  sankey.setStepAsX = function (){
    for(n in nodes){
      theNode = nodes[n];
      theNode.x =theNode.xStep;
      //console.log("x:"+theNode.x);
    }
  }
  
  var bySTEP = true;
  
  function attributeImportanceToAllNodes(){
    nodes.forEach(function(node){
      node.importance=0;
    });
    
    	   // console.log("--------- compute -----------");

    for(level=nbSteps;level>=0;level--){
      nodes.forEach(function(node){
	if (node.step==level) {
	  node.targetLinks.forEach(function(referenced){
	    referenced.source.importance=referenced.source.importance+node.importance+1;
	  });
	}
      });
    }
    
    
  }
  
  //function to replace real dates by the step in the hierarchy
  function computeByStep(){
    //console.log("compute STEP")
    step0 = [];
    for(n in nodes){
      theNode = nodes[n];
      //console.log(theNode);
      	theNode.dateSaved = theNode.date;

	
      if(theNode.targetLinks.length==0){
	//console.log("source = "+theNode.name)
	theNode.step = 0;
	step0.push(theNode);
      }
    }
    //console.log("STEP roots initialized")
    nodesToDo = step0;
    while(nodesToDo.length>0){
      n = nodesToDo.shift();
      for(link in n.sourceLinks){
	n.sourceLinks[link].target.step = n.step+1;
	nodesToDo.push(n.sourceLinks[link].target);
	nbSteps = Math.max(nbSteps,n.step+1);
	//console.log(n.name+" "+n.step+1);
      }
    }
    
    
  }
  

 //function leaf which return the number of leafs of each category
 //new version, take into account the visible nodes or not
  function leafs(nodee,displayedNodes){
    
    var toReturn = [];
    
    // getAll
    //var listOfLinksPotentialLeaf = nodee.sourceLinks.slice(0);
    var listOfPotentialLeafs = network[nodee.id].refBy.slice(0,network[nodee.id].refBy.length-1);

    var allDifferentNodes = {};
    
    while(listOfPotentialLeafs.length>0){
       // pick the first node and remove it
      nodo=listOfPotentialLeafs[0];
      listOfPotentialLeafs.splice(0,1);
      
      first = true;//boolean to check if the node is the first of his category
      
      //if the node is not displayed
      if (displayedNodes.indexOf(nodo)==-1) {
	//increment the number of leaves of this category
	for(i =0;i<toReturn.length;i++){
	  if (toReturn[i].catName == nodo.catN) {
	    toReturn[i].val = toReturn[i].val+1;
	    
	    first = false;
	    
	    //memorize that this node has already been memorized
	    allDifferentNodes[nodo.id]=true;
	  }
	}
	
	//if this node is the first one this category
	if (first == true) {
	  first = false;
	  
	  //add a new initialized entry to the list of categories
	  var newI = toReturn.length;
	  toReturn[newI]={"catName":nodo.catN,"val":1};
	  allDifferentNodes[nodo.id]=true;
	}
	
	listOfPotentialLeafs = listOfPotentialLeafs.concat(nodo.refBy);
      }
  
     }
//     if (nodee.id=="542631") {
//      console.log("fjdkojfdklsjfklads;jfkdljfklsajfdklfjlksd;;")
//      for(k in Object.keys(allDifferentNodes)){
//	console.log(Object.keys(allDifferentNodes)[k]);
//	console.log(network[Object.keys(allDifferentNodes)[k]])
//      }
//     }
     
    for(i = 0; i < toReturn.length;i++){
      toReturn[i].totalSize = Object.keys(allDifferentNodes).length;
      toReturn[i].sizeIn = sizeFromPopularity(nodee.popularity)+ 2;
      toReturn[i].sizeOut = sizeFromPopularity(nodee.popularity)+ Math.sqrt(toReturn[i].totalSize)+2;
  }
  
  
  return toReturn;
}
  
  
  //function leaf which return the number of leafs of each category
 //new version, take into account the visible nodes or not
//  function leafs(nodee,displayedNodes){
//    
//    var toReturn = [];    
//    var listOfLinksPotentialLeaf = nodee.sourceLinks.slice(0);
//
//    var allDifferentNodes = {};
//    
//    while(listOfLinksPotentialLeaf.length>0){
//      link = listOfLinksPotentialLeaf[0];
//      listOfLinksPotentialLeaf.splice(0,1);
//      first = true;
//      nodo = link.target;
//      if (displayedNodes.indexOf(nodo)==-1) {
//	for(i =0;i<toReturn.length;i++){
//	  if (toReturn[i].name == nodo.catN) {
//	    toReturn[i].val = toReturn[i].val+1;
//	    first = false;
//	     //totalSize++;
//		allDifferentNodes[nodo.name]=true;
//	  }
//	}
//	if (first == true) {
//	  first = false;
//	  var newI = toReturn.length;
//	  toReturn[newI]={"name":nodo.catN,"val":1};
//	allDifferentNodes[nodo.name]=true;
//	  //totalSize++;
//	}
//	
//	listOfLinksPotentialLeaf = listOfLinksPotentialLeaf.concat(nodo.sourceLinks);
//      }
//  
//     }
//          console.log("all diff nodes");
//
//     console.log(allDifferentNodes);
//    for(i = 0; i < toReturn.length;i++){
//      toReturn[i].totalSize = Object.keys(allDifferentNodes).length;
//      toReturn[i].sizeIn = sizeFromPopularity(nodee.popularity)+ 2;
//      toReturn[i].sizeOut = sizeFromPopularity(nodee.popularity)+ Math.sqrt(toReturn[i].totalSize)+2;
//  }
//  
//  
//  return toReturn;
//}
//  
  function cleanNodesAndLinks() {
    
    
    var nodesT = sankey.selectedNodes(howManyNodesWeWantToDisplay);
    
    //console.log("cleaned nodes:"+nodesT.length);

    
    nodesT.forEach(function(node) {
      //compute the leafs before modifying the links
      node.leafs = leafs(node,nodesT);
      
      
      
      //remove all links to leaf nodes (popularity under 100000 and not source)
       node.targetLinks = node.targetLinks.filter(function(el){
	
	//return el.target.popularity>minimumPopularity || el.target.sourceLinks.length>0;
	//return el.target.importance>minimalImportanceToBeKept;
	return nodesT.indexOf(el.target)>-1;
      });
       
      node.sourceLinks = node.sourceLinks.filter(function(el){
	
	//return el.target.popularity>minimumPopularity || el.target.sourceLinks.length>0;
	//return el.target.importance>minimalImportanceToBeKept ;
	return nodesT.indexOf(el.target)>-1;
      });
      
     
      
    });
    var countEdges = 0 ;
    var linksT = [];
    for(var i = 0 ; i < nodesT.length; i ++){
      linksT = linksT.concat(nodesT[i].sourceLinks);
      countEdges+=(nodesT[i].sourceLinks.length+nodesT[i].targetLinks.length)/2;
    }
        //console.log("cleaned edges:"+countEdges);

  nodes = nodesT;
  links = linksT;
    


    
  }

  // Compute the value (size) of each node by summing the associated links.
  function computeNodeValues() {
    nodes.forEach(function(node) {
	node.value = sizeFromPopularity(node.popularity);
    });
  }





  // Iteratively assign the breadth (x-position) for each node.
  // Nodes are assigned the maximum breadth of incoming neighbors plus one;
  // nodes with no incoming links are assigned breadth zero, while
  // nodes with no outgoing links are assigned the maximum breadth.
  function computeNodeBreadths() {

	var highest = sankey.getHighestDateValue();

	scaleNodeBreadths((size[0] - nodeWidth) / highest.xDate, (size[0] - nodeWidth) / highest.xStep);

   
  }

  function scaleNodeBreadths(kxDate,kxStep) {
    nodes.forEach(function(node) {
      node.xDate *= kxDate;
      node.xStep *= kxStep;
    });
  }

var currenty =30;
  
  function getNodeListFromLinkList_Target(linkList) {
    nodelist = [];
    
    linkList.forEach(function(link){
      nodelist.push(link.target);
    });
    
    return nodelist;
  }
  

function computeNodeDepths(nodes, minimumDy) {
          ////console.log("compute node depths 1");
	  nodes.sort(function(a,b){
	    return a.date-b.date;
	  });


	initializeNodeDepth(minimumDy);
	
	centerNodeDepth();
	centerNodeDepth();

	centerNodeDepth();
	centerNodeDepth();

  
	function compare(a,b){
	  //return a.dy-b.dy;
	  return a.value-b.value;
	  //return b.value-a.value;
	}


function initializeNodeDepth(minimumDy) {

	var ky = 2;
	
	sumdy=[];
	
      nodes.forEach(function(node) {


          if (!node.alreadyPloted) {

	    node.alreadyPloted=true;
	    
	    //fix the dy value
	     if ( node.leafs.length>0) {

		node.dy = node.leafs[0].sizeOut * 2;
	      }
	      else{

		/////node.dy = sizeFromPopularity(node.popularity)*2;
		node.dy = sizeFromPopularity(node.popularity)*2+2;
	      }

	      
	    //if this node is not a leaf, plot its subtree first
	    if (node.sourceLinks.length>0) {


	      node.y = currenty+node.dy/2;
	      computeNodeDepths(getNodeListFromLinkList_Target(node.sourceLinks),currenty+node.dy);
	    }
	    else{
	      
	     //if this node is a leaf, just plot it
	      
	      if(node.targetLinks.length>0)
		{
		  node.y = currenty+node.dy/2;
		  currenty+=node.dy;
		}
	      else{
		  node.y=-1;
		}
	      
	    
	    }
	  }

      });
      
      if (currenty<minimumDy) {
	currenty = minimumDy;
      }
      
      links.forEach(function(link) {
      link.dy = 2;
      });
      
    }
    
    function centerNodeDepth() {
      nodes.forEach(function(node) {
	if (node.sourceLinks.length>0) {
	  sumY = 0;
	  nbY = 0;
	  smallestY = 100000;
	  	     
	  node.sourceLinks.forEach(function(link){
	     
	    referencingNode = link.target;
	    if (referencingNode.y!=null && referencingNode.y>-1 && referencingNode.targetLinks.length==1) {
	      if (referencingNode.y<smallestY) {
		smallestY=referencingNode.y;
		nodeWithLowestY=referencingNode;
	      }
	     nbY++;
	     sumY+=referencingNode.y;
	    }
	  });
	  
	  //find the child with lower y
	  if (sumY/nbY>node.y)
	  {
	    node.y = sumY/nbY;
	  }
	  
	  
	}
      });
    }
    
    
     function centerAggregators() {
      nodes.forEach(function(node) {
	if (node.targetLinks.length>1) {
	  sumY = 0;
	  nbY = 0;
	  smallestY = 100000;
	  	     
	  node.targetLinks.forEach(function(link){
	     
	    referencedNode = link.source;
	    if (referencedNode.y!=null && referencedNode.y>-1) {
	      if (referencedNode.y<smallestY) {
		smallestY=referencedNode.y;
		nodeWithLowestY=referencedNode;
	      }
	     nbY++;
	     sumY+=referencedNode.y;
	    }
	  });
	  
	  //find the child with lower y
	  if (sumY/nbY>node.y)
	  {
	    node.y = sumY/nbY;
	    node.x = node.x-2;
	    //console.log();
	  }
	}
      });
    }
    


    function relaxLeftToRight(alpha) {
      nodesByBreadth.forEach(function(nodes, breadth) {
        nodes.forEach(function(node) {
          if (node.targetLinks.length) {
            var y = d3.sum(node.targetLinks, weightedSource) / d3.sum(node.targetLinks, value);
            node.y += (y - center(node)) * alpha;
          }
        });
      });

      function weightedSource(link) {
        return center(link.source) * link.value;
      }
    }

    function relaxRightToLeft(alpha) {
      nodesByBreadth.slice().reverse().forEach(function(nodes) {
        nodes.forEach(function(node) {
          if (node.sourceLinks.length) {
            var y = d3.sum(node.sourceLinks, weightedTarget) / d3.sum(node.sourceLinks, value);
            node.y += (y - center(node)) * alpha;
          }
        });
      });

      function weightedTarget(link) {
        return center(link.target) * link.value;
      }
    }


    function ascendingDepth(a, b) {
      return a.y - b.y;
    }
  }

  function computeLinkDepths() {
    nodes.forEach(function(node) {
      node.sourceLinks.sort(ascendingTargetDepth);
      node.targetLinks.sort(ascendingSourceDepth);
    });
    nodes.forEach(function(node) {
      var sy = 0, ty = 0;
      node.sourceLinks.forEach(function(link) {
        link.sy = sy;
        //sy += link.dy;
      });
      node.targetLinks.forEach(function(link) {
        link.ty = ty;
        ty += link.dy;
      });
    });

    function ascendingSourceDepth(a, b) {
      return a.source.y - b.source.y;
    }

    function ascendingTargetDepth(a, b) {
      return a.target.y - b.target.y;
    }
  }

  function center(node) {
    return node.y + node.dy / 2;
  }

  function value(link) {
    return link.value;
  }

  
   function computeTotalInformation(){
    totalInformationdisplayed = 0;
    for(var i = 0; i <nodes.length;i++){
      nodee = nodes[i];
      
      var listOfSuccessors = [];
      listOfSuccessors = listOfSuccessors.concat(nodee.sourceLinks);
      totalInformationdisplayed+=listOfSuccessors.length;

      if (nodee.hasOwnProperty("leafs") && nodee.leafs.length>0) {
	totalInformationdisplayed+=nodee.leafs[0].totalSize;

      }

      while(listOfSuccessors.length>0){
	link = listOfSuccessors[0];
	listOfSuccessors.splice(0,1);
	nodo = link.target;
	if (nodo.hasOwnProperty("leafs") && nodo.leafs.length>0) {
	  totalInformationdisplayed+=nodo.leafs[0].totalSize;
  
	}
	totalInformationdisplayed+=nodo.sourceLinks.length;
	listOfSuccessors = listOfSuccessors.concat(nodo.sourceLinks);
    
      }
    }
    
   // console.log("total information in the network: "+totalInformationdisplayed);
    
          var countRefedNodes = 0;

    for(var aK in Object.keys(network)){

      nodee = network[Object.keys(network)[aK]];

      if (nodee.refBy.length>0) {
	countRefedNodes++;
      }
    }
    //console.log("tot nbNodes:"+Object.keys(network).length+" nodesWithSucc"+countRefedNodes)
    
  }
  return sankey;

  
 
  
  
  
};
