var ouaf = "ouif";

function printHeader(page)
{

isActive = [];
isActive["index"]="";
isActive["publications"]="";
isActive["cv"]="";
isActive["ressources"]="";
isActive["other"]="";

isActive[page]="class='active'";

toReturn = "<div class='navbar navbar-inverse navbar-fixed-top' role='navigation'> \
              <ul class='nav navbar-nav'> \
              <li "+isActive["index"]+"><a href='index.html'>Rémy Cazabet</a></li> \
              <li "+isActive["publications"]+"><a href='publications.html'>Publications</a></li> \
              <li "+isActive["cv"]+"><a href='cv.html'>CV</a></li> \
              <li "+isActive["ressources"]+" class='dropdown'> \
                  <a class='dropdown-toggle' data-toggle='dropdown' href='#'> \
                      Research ressources<span class='caret'></span> \
                  </a> \
                  <ul class='dropdown-menu'> \
                      <li><a href='iLCD.html'>iLCD</a></li> \
                      <li><a href='friendCircles.html'>friend circles</a></li> \
                      <li><a href='cooperationFlow.html'>cooperationFlow</a></li> \
                      <li><a href='interactionProfiler.html'>Interaction Profiler</a></li> \
                  </ul> \
              </li> \
              <li "+isActive["other"]+"><a href='other.html'>Other</a></li> \
              </ul> \
          </div>";
          
return toReturn;
}
        
        
          