/*
	資料結構中data.y.length即為要畫的線的數目
	
*/

function createPage11(){
	
}

createPage11.prototype.drawLine=function(target, data, width, height)
{
	var margin = {top: 20, right: 20, bottom: 30, left: 50};
	width = width - margin.left - margin.right;
	height = height - margin.top - margin.bottom;

	//for d.x is ("%d-%b-%y") ex: 15-May-07
	/*
	var formatDate = d3.time.format("%d-%b-%y");
	function type(d) {
	  d.date = formatDate.parse(d.date);
	  d.y1 = +d.y1;
	  return d;
	}
	*/

	var svg = d3.select(target).append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
	  .append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
		
	var x = d3.time.scale()
		.range([0, width]);

	var y = d3.scale.linear()
		.range([height, 0]);

	var xAxis = d3.svg.axis()
		.scale(x)
		.orient("bottom")
		.ticks(0);

	var yAxis = d3.svg.axis()
		.scale(y)
		.orient("left")
		.ticks(0);

	 svg.append("g")
		 .attr("class", "x axis")
		 .attr("transform", "translate(0," + height + ")")
		 .call(xAxis);

	svg.append("g")
		.attr("class", "y axis")
		.call(yAxis);
	
	
	/*定義xy的範圍*/	
	x.domain(d3.extent(data, function(d) { return d.x; }));
	y.domain(d3.extent(data, function(d)
		{	
			var max;
			for(var i=0;i<d.y.length;i++)
			{
				max=(i==0?d.y[i]:Math.max(max, d.y[i]));
			}
			return max;
		}));

	for(var i=0;i<data[0].y.length;i++)
	{
		svg.append("path")
			.datum(data)
			.attr("class", "page11_line"+(i+1))
			.attr("d",  d3.svg.line()
				.interpolate('cardinal')//讓圖形更平滑
				.x(function(d) { return x(d.x); })
				.y(function(d) { return y(d.y[i]); })
			);
	}	
}

createPage11.prototype.drawBar=function(target, data, width, height)
{
	
	var margin = {top: 20, right: 20, bottom: 30, left: 40};
    width = width- margin.left - margin.right;
    height = height - margin.top - margin.bottom;

	var x = d3.scale.ordinal()
		.rangeRoundBands([0, width], .4);

	var y = d3.scale.linear()
		.range([height, 0]);

	var xAxis = d3.svg.axis()
		.scale(x)
		//.tickSize(0)  //座標標示刻度的長度
		.orient("bottom");

	var yAxis = d3.svg.axis()
		.scale(y)
		.orient("left")
		.ticks(10, "%");
		
	var svg = d3.select(target).append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
	  .append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	  x.domain(data.data.map(function(d) { return d.text; }));
	  y.domain([0, d3.max(data.data, function(d) { return d.value; })]);

	  svg.append("g")
		  .attr("class", "x axis")
		  .attr("transform", "translate(0," + height + ")")
		  .call(xAxis)
		  .append("text")
			.text(data.text)
			.attr("transform", "translate("+width/2+", -" + height + ")");

	  /*
	 svg.append("g")
		.attr("class", "y axis")
		  .call(yAxis)
		.append("text")
		  .attr("transform", "rotate(-90)")
		  .attr("y", 6)
		  .attr("dy", ".71em")
		  .style("text-anchor", "end")
		  .text("Frequency");
	*/

	  var j=0;
	  svg.selectAll(".bar")
		  .data(data.data)
		.enter().append("rect")
		  .attr("class",  function(d) { j++; return "page11_bar"+j; })
		  .attr("x", function(d) { return x(d.text); })
		  .attr("width", x.rangeBand())
		  .attr("y", function(d) { return y(d.value); })
		  .attr("height", function(d) { return height - y(d.value); });

	function type(d) 
	{
	  d.value = +d.value;
	  return d;
	}

}
