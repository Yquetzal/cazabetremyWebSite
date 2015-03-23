//take a list of dots defined by r,cx,cy
function drawDots(anSvg,listOfCoordinate,color,name) {
    console.log("will draw "+listOfCoordinate.length+" dots:"+name);
    anSvg.selectAll(name)
    .data(listOfCoordinate)
    .enter().append("circle")
    .style("fill",color)
    .attr("r",function(d){return d.r})
    .attr("cx",function(d){return d.cx})
    .attr("cy",function(d){return d.cy})
}

//shapes must be composed of elements xInit,xEnd,sizeInit,sizeEnd
function convertToTrapezoid(baseY,xInit,xEnd,sizeInit,sizeEnd){
    listOfPoints = [];
    
    listOfPoints.push([xInit,sizeInit+baseY]);
    listOfPoints.push([xEnd,sizeEnd+baseY]);
    listOfPoints.push([xEnd,-sizeEnd+baseY]);
    listOfPoints.push([xInit,-sizeInit+baseY]);
    listOfPoints.push([xInit,sizeInit+baseY]);

    return listOfPoints;

}

function drawShapes(listOfSequencesOfPoints,name,colorr,pointerEvents){
    console.log("will draw "+listOfSequencesOfPoints.length+"elements "+name);

 svg.selectAll(name)
   // .data([aShape])
   .data(listOfSequencesOfPoints)
    .enter().append("path")
    .style("fill",function (d){return d.color = colorr; })
    .attr("pointer-events",function(d){ if(pointerEvents){return ""}else{return "none"}})


    .attr("class","area")
    .attr("d", function(d) { return d3.svg.area()(d)})

}

function drawLines(listOfSequencesOfPoints,name,strokeColorr,pointerEvents){
    console.log("will draw "+listOfSequencesOfPoints.length+"elements "+name);

 svg.selectAll(name)
   .data(listOfSequencesOfPoints)
    .enter().append("path")
    .style("fill",function (d){return d.color = "rgba(0,0,0,0.0)"; })
    .style("stroke",function (d){return d.color = strokeColorr; })
    .attr("pointer-events",function(d){ if(pointerEvents){return ""}else{return "none"}})

    .attr("class","area")
    .attr("d", function(d) { return d3.svg.line()(d)})

}

function shapeFromValues(values){
  var shapeToReturn = [];
  mirror = [];
  impliedX = 0;
  
  values.forEach(function(el){
    shapeToReturn.push([impliedX,el]);
   // console.log(el);
    mirror.push([impliedX,el*-1]);
    impliedX+=howManyPixelsForAValue;
  });
  

  mirror.reverse();
  
  shapeToReturn = shapeToReturn.concat(mirror);
  shapeToReturn.push([shapeToReturn[0][0],shapeToReturn[0][1]]);
  //shape.push(shapeToReturn[0]);


  return shapeToReturn;
}