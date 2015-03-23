This visualization is composed of two independant parts: 
- the cooperation flow visualization, displaying the details of the interactions inside a cooperation flow
- the global view Visualization, displaying several cooperation flows in the form of time series

For each of them, there is one HTML file. This HTML files call functions and other elements  contained in the files of the "tools" directory.

_____________________________________________

###INPUT FORMAT

If you want to display your own data, you need the following files, all located in the folder "data" and described below.

####CooperationFlow: 
- XXX.json: A file describing the cooperation flow "XXX", containing all relevent information. You can have as many of these files as you want. 
- flowsToDisplay.json: A file that indicates the list of the files with cooperation flows you want to display. 

####GlobalView:
- global.json: A file containing all the time series of all the cooperation flows.
_____________________________________________

Note that technically, the information in global.json could be derived from all the XXX.json. However for technical reasons, it is better to have the information already processed. 
We could write a simple stand alone file to create it.

_____________________________________________

###Description of the format of XXX.json files

{"nodes":[NODE1,NODE2,...], "links":[LINK1,LINK2,...], "categories":[CAT1,CAT2,...], "firstDate":DATE, "lastDate":DATE, "name":NAME,"largestNode":LARGESTNODE}
- NODE = {"id":A, "date":B, "author":C, "name":D, "catN":E, "popularity":F, "paramX":G}
  - A: a unique id, string
  - B: a date as a number since firstDate. This is scaled based on firstDate and lastDate.
  - C: author name, for display
  - D: name of the node, for display
  - E: category. String. Must belong to the category list
  - F: number, define the radius of the node (normalized)
  - G: String, for display, write what you want
- LINK = {"source":RANK, "target":RANK,"value":LINKVAL}
  - RANK : the rank of the node in the list of nodes
  - LINKVAL : for display, write what you want
- CAT: A string. "categories" define the list of possible categories. to a given rank in the list coressponds a given color.
- DATE: a date in any format recognized by jQuery. Example : "Dec 16, 2012 11:14:12 PM"
- NAME: The name of the node
- LARGESTNODE: the highest possible value of the "popularity" parameter of nodes. Used for normalization between cooperation flow : a given radius of node will correspong to a same size in different cooperation flows with the same LARGESTNODE.






###Description of the format of the flowsToDisplay.json file

[FILENAME1,FILENAME2,...]
- FILENAME: the name of a file containing a cooperation flow, such as FILENAME.json exists.






###Description of the format of the global.json file

{"firstDate":DATE, "lastDate":DATE, "categories":[CAT1,CAT2,...], "allSequences":{CAT1:SEQUENCE,CAT2:SEQUENCE,...}}
- DATE:same as before, date as a string
- CAT: same as before, category as a string. CAT in "allsequences" must belong to CAT in "categories"
- SEQUENCE:[X1,X2,...]
  - X: a number.
	
The idea here is that CAT:SEQUENCE represents the time series of elements of the category CAT. The time series can be as long as you want, and will be scaled to math firsDate and lastDate. All timeSeries must of course be of the same length, as firstDate and lastDate is unique for all timeSeries.

_____________________________________________

Please write me for any inquiry : remy.cazabet AT gmail.com
If you use this, please make a proper reference to: 

@inproceedings{cazabet2014understanding,
	Author = {Cazabet, Remy and Takeda, Hideaki},
	Booktitle = {Proceedings of the 25th ACM conference on Hypertext and social media},
	Organization = {ACM},
	Pages = {206--211},
	Title = {Understanding mass cooperation through visualization},
	Year = {2014}}

