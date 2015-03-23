//function to draw a barchart.
//where is the name of the html element where we draw
//values is a list of objects, each of these objects contains a value for xAxisName and yAxisName

function drawAsBarChart(xSize,ySize,where,xAxisName,yAxisName,values,name,legendYN){
      var svgToDraw = createSvg(xSize,ySize,where,name);
      
      var chart = new dimple.chart(svgToDraw, values);
    chart.addCategoryAxis("x", xAxisName);
    chart.addMeasureAxis("y", yAxisName);
    chart.addSeries(name, dimple.plot.bar);
      chart.setBounds(50,10,xSize-50,ySize-60)

    if (legendYN) {
      chart.addLegend(100,0,xSize,ySize);
    }
    
    chart.draw();
}

//function to draw a cumulative barchart. same as normal barchart,but values contains the category in an attribute name
function drawAsBarChartCatColors(xSize,ySize,where,xAxisName,yAxisName,values,name,legendYN){
      var svgToDraw = createSvg(xSize,ySize,where,name);
      
      var chart = new dimple.chart(svgToDraw, values);
    chart.addCategoryAxis("x", xAxisName);
    chart.addMeasureAxis("y", yAxisName);
    chart.addSeries(name, dimple.plot.bar);
          chart.setBounds(50,10,xSize-50,ySize-60)

    if (legendYN) {
      chart.addLegend(0,0,200,200);
    }
    
    //assign colors
    for(var i = 0 ; i < allCats.length; i++){
      chart.assignColor(allCats[i],color(allCats[i]));
    }
    
    chart.draw();
}

//in this case, values is a list of list
function drawAsBarStackedArea(xSize,ySize,where,xAxisName,yAxisName,values,name){

      var svgToDraw = createSvg(xSize,ySize,where,name);


      var chart = new dimple.chart(svgToDraw, values);

    chart.addCategoryAxis("x", xAxisName);
    chart.addMeasureAxis("y", yAxisName);
    chart.setBounds(50,30,xSize-50,ySize-80)

    var series = chart.addSeries(name, dimple.plot.area);
    series.addOrderRule(name);
    chart.addLegend(0,0,xSize,ySize);
    
    
    //colors
    chart.defaultColors = [new dimple.color("#000000"),new dimple.color("#303030"),new dimple.color("#505050"),new dimple.color("#909090"),new dimple.color("#C8C8C8"),new dimple.color("#F8F8F8")]
    chart.draw();
}

function createSvg(xSize,ySize,where,className){
        var svg = d3.select(where).append("svg")
    .attr("class", className)
      .attr("width", xSize)
      .attr("height", ySize);
      
      return svg;
}