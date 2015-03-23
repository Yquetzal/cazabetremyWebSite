var firstDateScaling;
var lastDateScaling;
var scaleScalingFromDate = d3.scale.linear(); //.range //.domain
var nbStepsForTools = 10;

function findMaxGlobalDate(){
    var max = 0 ;
    for(key in network){
        if  (network[key].date>max){
            max = network[key].date;
        }
    }
    
    return max;
}

function initializeScale(minVal,maxVal){
    //console.log("initializing scale ");

    scaleScalingFromDate.domain([minVal,maxVal])
    scaleScalingFromDate.range([0,nbStepsForTools]);
    //console.log("scale initialized"+" "+minVal+" "+maxVal);
}

//return the list of all nodes sorted by their number of total citations
function getListNodesRefsSorted(){
    var netCopy = [];
      for(key in network){
        netCopy.push(network[key]);
    }
    
    //found the 5 most influential works
    netCopy.sort(function(a,b){return b.refBy.length-a.refBy.length;})
    //console.log("netCopy")
    //console.log(netCopy);
    return netCopy;

}
function computeMetricDiversityTop(){
  
    refs = getListNodesRefsSorted();
    return refs[0].refBy.length/refs.length;
}

function computeMetricDiversityTops(topPercent){
  
    listOfAllNodes = {};
    refs = getListNodesRefsSorted();
    nbinTopPercent = Math.floor(refs.length/100*topPercent)+1;
    combinedValOfTop = 0;
    for( var i = 0 ; i < nbinTopPercent; i++){
        for(var j = 0 ; j < refs[i].refBy.length;j++){
            listOfAllNodes[refs[i].refBy[j].id]=true;
        }
        //combinedValOfTop+=refs[i].refBy.length;
    }
    
    
    
    return Object.keys(listOfAllNodes).length/refs.length;
}

function computeSustainRate(){
    var cleanLevels = {};
    var videosByLevel = getNbVideosByLevel();
    for(key in videosByLevel){
        var thisLevel = videosByLevel[key].time;
        if (!cleanLevels.hasOwnProperty(thisLevel)) {
            cleanLevels[thisLevel]={"count":0};
        }
        cleanLevels[thisLevel].count+=videosByLevel[key].val;
    }
    
    var sustainRate = 0;
    var count = 0;
    for(var i = 2; cleanLevels.hasOwnProperty(i);i++){
        sustainRate+=cleanLevels[i-1].count*(cleanLevels[i].count/cleanLevels[i-1].count);
        count+=cleanLevels[i-1].count;
    }
    
    sustainRate=sustainRate/count;
    
    return sustainRate;
}

function getNbVideosByLevel(){
        tempWithId = {};

   
    for(key in network){
        var identifier = network[key].catN+"_"+network[key].step;
        if (!tempWithId.hasOwnProperty(identifier)) {
            tempWithId[identifier]={"serie":network[key].catN,"level":network[key].step,"val":0};
        }
        tempWithId[identifier].val++;
    }
    toReturn = [];
    
    for(key in tempWithId){
        toReturn.push(tempWithId[key]); 
    }
    
    //console.log("finished to compute stat by Step");
    //console.log(toReturn);

    
    return toReturn;
}
function computeCombinationRatio(){
  
  countCombiners = 0 ;
    for(key in network){
        if (network[key].refTo.length>1) {
            countCombiners++;
        }
    }
    
    
    return countCombiners/Object.keys(network).length;
}

//function which return a list of
function getNodesByImpact() {
    
    //console.log("begin compute values for stacked chart");

    var nbTopElts = 5;
    listOfRelativeImportances = [];
    
    netCopy = getListNodesRefsSorted();
    var fiveMostInfluential = [];
    //found the 5 most influential works
    var mostInfluential = netCopy.slice(0,nbTopElts);
    
    //init everything to 0
    for(var i = 0 ; i < nbTopElts+1; i ++){
        listOfRelativeImportances.push([]);
        
        for(var j = 0;j < nbStepsForTools+1; j++){
            listOfRelativeImportances[i].push(0);
        }
    }
        
    var listOfnodesAlreadyDone = [];
    //for each of the top influential node
    for(var el = 0 ; el < mostInfluential.length; el++){
        var nodeStudied = mostInfluential[el];
        for(var fol = 0 ; fol < nodeStudied.refBy.length;fol++){
            var folNode = nodeStudied.refBy[fol];
            var indexToIncrement = Math.round(scaleScalingFromDate(folNode.date));
            
            listOfRelativeImportances[el][indexToIncrement]++;
            listOfnodesAlreadyDone.push(folNode);
        }
    }
        //console.log("topNodesValues added");

    for(key in network){
        var thisNode = network[key];
        if (listOfnodesAlreadyDone.indexOf(thisNode)==-1) {
            var indexToIncrement = Math.round(scaleScalingFromDate(thisNode.date));
            listOfRelativeImportances[listOfRelativeImportances.length-1][indexToIncrement]++;
        }
        
    }
    
   // console.log("finished to compute values for stack");

  //  console.log(listOfRelativeImportances);

    return listOfRelativeImportances;
   
}