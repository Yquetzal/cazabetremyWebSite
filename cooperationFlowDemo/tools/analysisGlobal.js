function computeDistributionOfCentroid(listOfStats){
    var statsOnCentroid = [];
    for(i = 0 ; i<11;i++){
        statsOnCentroid[i]={"location(norm)":i,val:0};
    }
    for(i = 0; i<listOfStats.length;i++){
          aStat = listOfStats[i];
        if (aStat.officialEnd-aStat.officialStart>5) {
           
            centroidPerc = (aStat.centroid-aStat.officialStart)/(aStat.officialEnd-aStat.officialStart);
            statsOnCentroid[Math.round(centroidPerc*10)].val++;
        }
       
    }
    return statsOnCentroid;
}

function computeDistributionOfLength(listOfStats){
    var allLength=[];
    var min=100000,max=-1;

    for(i = 0; i<listOfStats.length;i++){
        aStat = listOfStats[i];
        lengthVal = aStat.officialEnd-aStat.officialStart;
        if (lengthVal>max) {
            max = lengthVal;
        }
         if (lengthVal<min) {
            min = lengthVal;
        }

        allLength.push(lengthVal);
    }
    var statsOnLength = [];
    unitDecile =(max-min)/10;
    for(i = 0 ; i<11;i++){
        statsOnLength[i]={time:Math.round(min+unitDecile*i),val:0};
    }
    
     for(i = 0; i<allLength.length;i++){
        statsOnLength[Math.round((allLength[i]-min)/unitDecile)].val++;
    }
       
    
    return statsOnLength;
}