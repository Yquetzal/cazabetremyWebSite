var countNUMBER = 0;
//definition of object "timeSerieStats"
function timeSerieStats(timeSerie,yOffset,id) {
    this.timeSerie =timeSerie;
    this.sumElements=0;
    this.officialStart=0;
    this.officialEnd=0;
    this.centroid=0;
    this.basicStructure="flat";
    this.basicStructureProperties;
    this.smoothed=[];
    this.yOffset=yOffset;
    this.id=id;


   // var mathInst = mathjs();
    
    
    this.indexOfBiggestValue;
        
    //this.
    this.computeStats = computeStats;
    function computeStats(){
        
    
    
       // var timeSerieStats = {};
        this.computeBasicStats();
        this.computeOfficialStartAndEnd();
        this.computeCentroid();
        this.analyzeMainStructure();
        this.computeSmoothed();
        this.computeBasicStructureProperties();
        
        
    }
    
    this.computeBasicStats = computeBasicStats;
    function computeBasicStats(){
          //var sumValues = 0;
        //compute sum of all elements
        var maxV = 0;
        for(i = 0; i<timeSerie.length;i++){
            this.sumElements+=timeSerie[i];
            if (timeSerie[i]>maxV) {
                maxV=timeSerie[i];
                this.indexOfBiggestValue=i;
            }
        }
    }


    this.computeOfficialStartAndEnd = computeOfficialStartAndEnd;
    
    function computeOfficialStartAndEnd(){  
    
        //find official start
        var elementsToremove = this.sumElements/100;
         for(i = 0; i<timeSerie.length && elementsToremove>timeSerie[i];i++){
            this.officialStart=i;
            elementsToremove-=timeSerie[i];
            //timeSerie[i] = 0;
        }
        
        var consecutiveValues = 0;
    
        for(var i = timeSerie.length-1; i>=this.officialStart && consecutiveValues<3;i--){
            this.officialEnd=i;
            //console.log("officialEnd : "+this.officialEnd);
        
            if (timeSerie[i]>=2) {
                consecutiveValues++;
            }
            else{
                consecutiveValues=0;
            }
        }
        this.officialEnd+=2;
	if (this.officialEnd>this.timeSerie.length-1) {
	    this.officialEnd = this.timeSerie.length-1;
	}
	
	this.sumElements = 0;
	for(var i = this.officialStart; i <= this.officialEnd ; i++){
	    this.sumElements+= this.timeSerie[i];
	}
       
    }


    this.computeCentroid = computeCentroid;

    function computeCentroid(){
        centroidReached=false;
        valueForCentroid = this.sumElements/2;
        var sumValues = timeSerie[this.officialStart];
        this.centroid = this.officialStart;
        
         for(i = this.officialStart+1; i<this.officialEnd && sumValues < valueForCentroid;i++){
            sumValues+=timeSerie[i];
            this.centroid = i;
        }
        
      
    }
    
     this.analyzeMainStructure = analyzeMainStructure;
    function analyzeMainStructure(){
        //console.log(this.centroid+" "+(this.officialEnd-this.officialStart)/2);
        if (this.centroid-this.officialStart<=(this.officialEnd-this.officialStart)/2.5) {
            this.basicStructure="shrinking";
        }
        if (this.centroid-this.officialStart>=(this.officialEnd-this.officialStart)/3*2) {
            this.basicStructure="growing";
        }
    }
    
    
    this.computeBasicStructureProperties = function computeBasicStructureProperties(){
        if (this.basicStructure=="shrinking") {
            p1 = {};
            p1.x=this.indexOfBiggestValue;
            p1.y=this.timeSerie[this.indexOfBiggestValue];
            
            averageValue = this.sumElements/(this.officialEnd-this.officialStart);
            for(id=this.indexOfBiggestValue;id-this.officialStart<this.smoothed.length && this.smoothed[id-this.officialStart]>averageValue;id++);
            //for(id=this.indexOfBiggestValue;id<this.timeSerie.length && this.timeSerie[id]>averageValue;id++);

            //id = endpoint
            p2 = {};
            p2.x=id;
            p2.y=averageValue;
            this.basicStructureProperties={"p1":p1,"p2":p2};

        }
        
        if (this.basicStructure=="growing") {
            p2 = {};
            p2.x=this.indexOfBiggestValue;
            p2.y=this.timeSerie[this.indexOfBiggestValue];
            averageValue= this.getAverage();
            for(id=this.indexOfBiggestValue;id>this.officialStart && this.smoothed[id-this.officialStart]>averageValue;id--);
            //for(id=this.indexOfBiggestValue;id<this.timeSerie.length && this.timeSerie[id]>averageValue;id++);

            //id = endpoint
            p1 = {};
            p1.x=id;
            p1.y=averageValue;
            this.basicStructureProperties={"p1":p1,"p2":p2};

        }
       
    }
    
    this.computeSmoothed = function() {
        this.smoothed=[];
      //  for(var i=0;i<this.officialStart;i++){
        //    this.smoothed.push(0);
        //}
        this.smoothed.push((this.timeSerie[this.officialStart]+this.timeSerie[this.officialStart+1])/2);
        
        for(var iS=this.officialStart+1;iS<this.officialEnd;iS++){
            this.smoothed.push((this.timeSerie[iS-1]+this.timeSerie[iS]+this.timeSerie[iS+1])/3)
        }
        
        this.smoothed.push((this.timeSerie[this.officialEnd-1]+this.timeSerie[this.officialEnd])/2);
        
        // for(var i=this.officialEnd;i<this.timeSerie.length;i++){
          //  this.smoothed.push(0);
        //}
    }
    
    this.getAverage = function(){
        return (this.sumElements/(this.officialEnd-this.officialStart+1));
    }
    
    this.getBurstThreashold = function() {
        var avg = getAverageFromNumArr(this.smoothed,4);
        var stdev = getStandardDeviation(this.smoothed,4);

	return Math.abs(this.getMedianOf(this.smoothed)-avg)*2+avg;
    }
    
    this.computeStatTree = function (list){

	 for(var el2 =0;el2<list.length;el2++){

	    //var newEl={};
	    list[el2].statPercent=0

	    list[el2].statNominal=0

		iPrevious = el2-1;
		iNext = el2+1;
		
		//if previous element not defined
		if (iPrevious<0) {
		    iPrevious = iNext;
		}
		if (iNext==list.length) {
		    iNext = iPrevious;
		}

		//if the other elements are defined
		if (iNext <list.length && iPrevious>=0 && list[iPrevious].iDeb>=this.officialStart && list[iNext].iEnd<=this.officialEnd) {


		    //averageAround = ((list[iPrevious].val+list[iNext].val)/2+1); //+1 for the problem of zero
		    maxAround = Math.max(list[iPrevious].val,list[iNext].val);

		    //list[el2].stat = (list[el2].val-averageAround)/(averageAround);
		    list[el2].statPercent = (list[el2].val-maxAround)/(maxAround);
		    list[el2].statNominal = (list[el2].val-maxAround)/(list[el2].iEnd-list[el2].iDeb+1);


		}
	    //}
	 }
	 return list;
    }
    
    //new version using the tree
    this.getBurstsIndices = function(){
	console.log("---------BEGIN TO COMPUTE BURSTS------------");

	var allCases = [];
	var firstLevel = [];

           //initialize a list with zeros
	 listOfBursts = [];
	 for(var i = 0; i < this.timeSerie.length;i++){
	    listOfBursts.push(0);
	 }
          
        //prepare the first level and compute at the first level
	var dataToUseForValues = this.smoothed;
	 for(var el =0;el<dataToUseForValues.length;el++){
	    //firstLevel.push({val:this.timeSerie[el],iDeb:el,iEnd:el});
	    firstLevel.push({val:dataToUseForValues[el],iDeb:(el+this.officialStart),iEnd:(el+this.officialStart)});
	    
	 }
	this.computeStatTree(firstLevel);
	 
	 //compute the local typical variation
        //compute average diff after first level
	 //create an array to compute the average
	 tempListPercent = [];
	 tempListNominal = [];
	 for(var i = 0; i < firstLevel.length;i++){
	    tempListPercent.push(Math.abs(firstLevel[i].statPercent));
	    tempListNominal.push(Math.abs(firstLevel[i].statNominal));

	 }
	 typicalVariationPercent = this.getMedianOf( tempListPercent );
	 typicalVariationNominal = this.getMedianOf( tempListNominal );
	 
        this.completeTheBursts(firstLevel,listOfBursts,typicalVariationPercent,typicalVariationNominal);
	 
	 //console.log("---------FIRST LEVEL DONE------------");
         
	 //createTheSecondLevel (we must keep this step because it creates the shift)
	 var secondLevel = [];
	 for(var i = 0 ; i<Math.floor(firstLevel.length/2);i++){
	    
	    secondLevel.push({val:firstLevel[i*2].val+firstLevel[i*2+1].val,iDeb:firstLevel[i*2].iDeb,iEnd:firstLevel[i*2+1].iEnd});
	 }
    	 this.computeStatTree(secondLevel);
        this.completeTheBursts(secondLevel,listOfBursts,typicalVariationPercent,typicalVariationNominal);

         
	 
	  //secondLevelShifted
	var secondLevelS = [];
	 for(var i = 0 ; i<Math.floor((firstLevel.length-1)/2);i++){
	    
	    secondLevelS.push({val:firstLevel[i*2+1].val+firstLevel[i*2+2].val,iDeb:firstLevel[i*2+1].iDeb,iEnd:firstLevel[i*2+2].iEnd});
	 }

        this.computeStatTree(secondLevelS);
        this.completeTheBursts(secondLevelS,listOfBursts,typicalVariationPercent,typicalVariationNominal);	 
	//////console.log("---------SECOND LEVEL DONE ------------");
	
	//other levels
        
        //case even
	var previousLevel=secondLevel;        
        while(previousLevel.length>=8){ //we dont want to find bursts in series with only 4 values
         var newLevel = [];
	 for(var i = 0 ; i<Math.floor(previousLevel.length/2);i++){
	    
	    newLevel.push({val:previousLevel[i*2].val+previousLevel[i*2+1].val,iDeb:previousLevel[i*2].iDeb,iEnd:previousLevel[i*2+1].iEnd});
	 }
        this.computeStatTree(newLevel);
        this.completeTheBursts(newLevel,listOfBursts,typicalVariationPercent,typicalVariationNominal);         
         previousLevel = newLevel;
	
        }
        
        //case shifted
        previousLevel=secondLevelS;        
        while(previousLevel.length>=8){ //we dont want to find bursts in series with only 4 values
            var newLevel = [];
	 for(var i = 0 ; i<Math.floor(previousLevel.length/2);i++){
	    
	    newLevel.push({val:previousLevel[i*2].val+previousLevel[i*2+1].val,iDeb:previousLevel[i*2].iDeb,iEnd:previousLevel[i*2+1].iEnd});
	 }
    	 this.computeStatTree(newLevel);
        this.completeTheBursts(newLevel,listOfBursts,typicalVariationPercent,typicalVariationNominal);         

         previousLevel = newLevel;
	
        }

	
	 
	 
	 
         
	 return listOfBursts;
	 
    }

    this.completeTheBursts = function (lsitOfPotentialBursts, listOfPreviousBursts, typicalVariationPercent,typicalVariationNominal){
        var threasholdIncrease = 5;
        var averageValue = getAverageFromNumArr(this.smoothed,2);
         
        //add the bursting elements
	  for(var i = 0; i < lsitOfPotentialBursts.length;i++){
	    var totalAverageValue = lsitOfPotentialBursts[i].val /( lsitOfPotentialBursts[i].iEnd - lsitOfPotentialBursts[i].iDeb+1);
	    if (lsitOfPotentialBursts[i].statPercent>typicalVariationPercent*threasholdIncrease && totalAverageValue>=10) { //  &&  totalAverageValue>=averageValue && allCases[i].statNominal>typicalVariationNominal*5
		//console.log("BOUM "+lsitOfPotentialBursts[i].iDeb+" "+lsitOfPotentialBursts[i].iEnd);
                for(var j= lsitOfPotentialBursts[i].iDeb;j<=lsitOfPotentialBursts[i].iEnd;j++){
		    listOfPreviousBursts[j]=this.getLongFormatSmoothed()[j];
		}
	    }
	 }
         
          if (this.id.indexOf("PHS")!=-1) {

          //if (listOfBursts.length>0 && this.smoothed.length>5) {
            countNUMBER++;
	    //console.log("---------TYPICAL VARIATION------------"+typicalVariationPercent+" "+typicalVariationNominal);
	}
    }

    this.getMedianOf = function(aList){
	var orderedSmoothed = [];
	orderedSmoothed = aList.slice(0);
	orderedSmoothed.sort(function(a,b){return a-b});
	//console.log(orderedSmoothed);
	//console.log("median : "+orderedSmoothed.length+" "+Math.round(orderedSmoothed.length/2)+" "+orderedSmoothed[Math.round(orderedSmoothed.length/2)]);

	return orderedSmoothed[Math.floor(orderedSmoothed.length/2)];
    }
    
    
    this.getLongFormatSmoothed = function(){
	var longSmoothed=[];
	for(var i = 0 ; i < this.timeSerie.length;i++){
	    if (i>=this.officialStart && i<=this.officialEnd) {
		longSmoothed.push(this.smoothed[i-this.officialStart]);
	    }
	    else{
		longSmoothed.push(0);
	    }
	}
	return longSmoothed;
    }
    
    //return list of burst objects, containing a start and end elements
    this.getBursts = function(){
	var allBursts = [];
	var aBurst = {};
	var burstIndices = this.getBurstsIndices();
	var stateInBurst = false;
	for(var ind=0; ind<burstIndices.length;ind++){
	    if (burstIndices[ind]!=0) {
		if (!stateInBurst) {
		    aBurst={start:ind,end:-1};
		    stateInBurst=true;
		}
		
	    }
	    else{
		if (stateInBurst) {
		    aBurst.end=ind-1;
		    allBursts.push(aBurst);
		    stateInBurst=false;
		}
	    }
	}
	//if there is a final burst
	if (stateInBurst) {
	    aBurst.end=burstIndices.length-1;
	    allBursts.push(aBurst);

	}
	return allBursts;
    }
    
    this.getBurstsPositions = function(nbFractions){
	var fractionLength = this.smoothed.length/nbFractions;
	//initialize
	var fractionTab = [];
	for (var i = 0 ; i < nbFractions;i++) {
	    fractionTab.push(0);
	}
	
	//getBursts
	var allBursts = this.getBursts();

	for(var i = 0 ; i < allBursts.length;i++){
	    
	    var currentFraction = Math.floor((allBursts[i].start-this.officialStart)/(fractionLength));
	    fractionTab[currentFraction]=1;
	    currentFraction = Math.floor((allBursts[i].end-this.officialStart)/(fractionLength));
	    fractionTab[currentFraction]=1;


	}
	
	return fractionTab;
    }
    
    this.getPeriodicBursts = function(){

	var allBursts = this.getBursts();
	if (allBursts.length<3) {
	    return -1;
	}
	else{
	    //compute the center of each burst
	    var burstsCenters = [];
	    for(var i = 0; i <allBursts.length;i++){
		burstsCenters.push(Math.round((allBursts[i].end+allBursts[i].start)/2));
	    }

	    var gapsList = [];
	    for(var i = 0 ; i<burstsCenters.length-1;i++){
		gapsList.push(burstsCenters[i+1]-burstsCenters[i]);

	    }
	    //var averageGap = getAverageFromNumArr(gapsList,2);
	    var validatedGaps = {};
	    for(var i = 0 ; i<gapsList.length;i++){
		var testedValue = gapsList[i];
		var identified = false;
		for(val in validatedGaps){
		    var valAsNumber = parseInt(val);
		    if (!identified && valAsNumber-(valAsNumber*0.2)<testedValue && (valAsNumber+(valAsNumber*0.2))>testedValue) {
			var newAverageGap = Math.round((valAsNumber*validatedGaps[val]+testedValue)/(validatedGaps[val]+1));
			var newCount = validatedGaps[val]+1;
			delete validatedGaps[val];
			validatedGaps[newAverageGap] = newCount;
			identified=true;
		    }
		  
		}
		  if (!identified) {
			validatedGaps[testedValue]=1;
		    }
	    }

	 for(val in validatedGaps){
	    var valAsNumber = parseInt(val);
	    if (validatedGaps[val]>=2 && validatedGaps[val]*valAsNumber>this.smoothed.length/2){
		return val;
	    }
	}
	return -1;
    }
    }
  
}


getNumWithSetDec = function( num, numOfDec ){
	var pow10s = Math.pow( 10, numOfDec || 0 );
	return ( numOfDec ) ? Math.round( pow10s * num ) / pow10s : num;
},
getAverageFromNumArr = function( numArr, numOfDec ){
	var i = numArr.length, 
		sum = 0;
	while( i-- ){
		sum += numArr[ i ];
	}
	return getNumWithSetDec( (sum / numArr.length ), numOfDec );
},
getVariance = function( numArr, numOfDec ){
	var avg = getAverageFromNumArr( numArr, numOfDec ), 
		i = numArr.length,
		v = 0;
 
	while( i-- ){
		v += Math.pow( (numArr[ i ] - avg), 2 );
	}
	v /= numArr.length;
	return getNumWithSetDec( v, numOfDec );
},
getStandardDeviation = function( numArr, numOfDec ){
	var stdDev = Math.sqrt( getVariance( numArr, numOfDec ) );
	return getNumWithSetDec( stdDev, numOfDec );
};