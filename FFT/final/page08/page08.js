/*
設計理念

為避免圖形重疊蓋到相對重要的圖構圖順序為:
XY軸 > 背景標線 > 涵蓋座標框 > 選取標線 > 座標標籤、一般標籤 > 選取的座標框 > 選取的座標
> 座標圈 > 最下方選取涵蓋範圍的double slider

透過mousedown.brush和touchstart.brush觸發切換涵蓋範圍的執行element

參數頗多頗亂 之後會開始慢慢調整	
*/

/**************版面配置**************/
function createPage_08(){}
createPage_08.prototype.drawTable = function(target, data, width, height)
{
	
		var td_width=width/7;
	/*慢慢刻table囉*/
		var table = d3.select(target).append("div").attr("style", "height:"+(height/3*2)+"px;width:100%;")
			.append("table");
		var thead = table.append("thead").attr("style", "display:block;width:"+width+"px;");
		var tr = thead.append("tr").attr("style", "background-color:#fbe7aa");
		tr.append("td").attr("rowspan", 2).text("基金名稱").attr("style", "width:"+td_width+"px;");
		tr.append("td").attr("colspan", 4).text("報酬率 (%)");
		tr.append("td").attr("colspan", 2).text("風險");
		
		tr = thead.append("tr").attr("style", "background-color:#fbe7aa");
		tr.append("td").text("三個月以下").attr("style", "width:"+td_width+"px;");
		tr.append("td").text("六個月以下").attr("style", "width:"+td_width+"px;");
		tr.append("td").text("一年以下").attr("style", "width:"+td_width+"px;");
		tr.append("td").text("三年以上").attr("style", "width:"+td_width+"px;");
		tr.append("td").text("年化標準差以下").attr("style", "width:"+td_width+"px;");
		tr.append("td").text("Beta以下").attr("style", "width:"+td_width+"px;");
		
		table=table.append("tbody").attr("style", "height:"+height/2+"px; display:block; overflow-y:scroll;  width:"+(width+17)+"px");
		for(var i=0;i<data.length;i++)
		{
			tr = table.append("tr")
				.on("mouseover", function(){d3.select(this).attr("style", "background-color:#def;")})
				.on("mouseout", function(){d3.select(this).attr("style", "background-color:#fff;")});
			var tmp_data=[];
			for(var key in data[i].Return)
			{
				tmp_data.push(data[i].Return[key])
			}
			for(var key in data[i].Risk)
			{
				tmp_data.push(data[i].Risk[key])
			}
			tr.append("td").text(data[i].Name).attr("style", "width:"+(td_width)+"px; color:#0bb5d2");
			tr.selectAll(".td").data(tmp_data).enter()
				.append("td").text(function(d){return d;})
				.attr("style", function(d)
				{
					var tmp = "width:"+(td_width)+"px;"; return d>0?tmp:(tmp+"color:red;")
				});
		}
}

createPage_08.prototype.drawChart = function(target, data, width, height)
{
	var margin = {top: 20, right: width/13, bottom: height/10, left: width/13};
	width = width - margin.left - margin.right;
	height = height - margin.top - margin.bottom;

	var svg = d3.select(target).append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.attr("fill", "#0cb877")
	  .append("g")
		.attr("transform", "translate(" + margin.right + "," + margin.top + ")");
		
	var LeftRange = svg.append("rect").attr({
		"height":height,
		"fill":"#f4b7c1"
	});	
	var RightRange = svg.append("rect").attr({
		"width":0,
		"height":height,
		"fill":"#e1f3d6",
		"opacity":0.8,
		"transform":"translate("+ width +",0)"
	});	
		
	/***************開始畫圖****************/	
	var x = d3.scale.linear()
		.range([0, width]);

	var y = d3.scale.linear()
		.range([height, 0]);

	var color = d3.scale.category10();	
		
	var xAxis = d3.svg.axis()
		.scale(x)
		//.tickSize(0)  //座標標示刻度的長度
		.orient("bottom")
		.tickFormat(function(d) { d+=""; return d.slice(0, d.indexOf(".")+2) + "%"; });

	var yAxis = d3.svg.axis()
		.scale(y)
		.orient("right")
		.tickFormat(function(d){d+=""; return d.slice(0, d.indexOf(".")+2) + "%";});
		
  /*data.forEach(function(d) {
	d.y = +d.y;
	d.x = +d.x;
  });*/

  x.domain(d3.extent(data, function(d) { return d.x; })).nice();
  y.domain(d3.extent(data, function(d) { return d.y; })).nice();

  svg.append("g")
	  .attr("class", "x axis")
	  .attr("transform", "translate(0," + height + ")")
	  .call(xAxis)
	/*.append("text")
	  .attr("class", "label")
	  .attr("x", width)
	  .attr("y", -6)
	  .style("text-anchor", "end")
	  .text("Sepal Width (cm)");*/

  svg.append("g")
	  .attr("class", "y axis")
	  .attr("transform", "translate("+ width + ", 0)")
	  .call(yAxis)
	/*.append("text")
	  .attr("class", "label")
	  .attr("transform", "rotate(-90)")
	  .attr("y", -6)
	  .attr("dy", ".71em")
	  .style("text-anchor", "end")
	  .text("Sepal Length (cm)");*/
/********************* 背景虛線 格線 ******************************/				  
	svg.append('g')
	 .call(xAxis.tickFormat("")
	  .tickSize(-height,0))
	 .attr({
	  'fill':'none',
	  'stroke':'rgba(0,0,0,.1)',
	  'transform':'translate(0,'+height+')' 
	 });

	svg.append('g')
	 .call(
		yAxis.tickFormat("")
		.orient("left")
		.tickSize(-width,0)
	  )
	 .attr({
	  'fill':'none',
	  'stroke':'rgba(0,0,0,.1)',
	 });
 
/******************* heightLine 選取點 的XY axis	****************************/	
	//X background	 會有順序問題
	var value_lineX_background=svg.append("rect")
		.attr({
			"height":15,
			"fill":"white"
		});
		
	//X axis	
	var value_lineX=svg.append("g");		  
	  value_lineX
		.attr({
		  "class":"x",
		  "style":"visibility:hidden",
		  "fill":"none",
		  "stroke":"#0ccf15"
		})
		.call(xAxis.tickSize(0).tickFormat("")).selectAll(".tick").remove();
	value_lineX.append("text");

	//Y background	 會有順序問題
	var value_lineY_background=svg.append("rect")
		.attr({
			"height":15,
			"fill":"white"
		});

	//Y axis		
	var value_lineY=svg.append("g");		  
	  value_lineY
		.attr({
		  "class":"y",
		  "style":"visibility:hidden",
		  "fill":"none",
		  "stroke":"#0ccf15"
		})
		.call(yAxis.tickSize(0).tickFormat("")).selectAll(".tick").remove();
	value_lineY.append("text");


	
/*********************  把其他創建的基礎元素開始畫上去 ****************************/			
//畫點
  svg.selectAll(".dot")
	  .data(data)
	.enter().append("circle")
	  .attr("class", "dot")
	  .attr("r", Math.min(height, width)/60)
	  .attr("cx", function(d) { return x(d.x); })
	  .attr("cy", function(d) { return y(d.y); })
	  .style("fill", function(d) { return color(d.class); })
	  .attr("x_value", function(d) { return d.x; })
	  .attr("y_value", function(d) { return d.y; })
	  .on("mouseover", function()
	  {
		//取得X位置
		value_lineX
			.attr("transform", "translate(0," + d3.select(this).attr("cy")+ ")")
			.attr("style", "visibility:visible;")
			.select("text").text(d3.select(this).attr("y_value"))
				.attr("transform", "translate("+ (width-20) +",0)" );
		//加入背景
		value_lineX_background.attr("transform", "translate("+ (width-40) +", " + (d3.select(this).attr("cy")-15)+ ")" )
			.attr("style", "visibility:visible;width:" + d3.select(this).attr("y_value").length*15);
			
		value_lineY
			.attr("transform", "translate(" + d3.select(this).attr("cx")+ ", 0)")
			.attr("style", "visibility:visible;")
			.select("text").text(d3.select(this).attr("x_value"))
				.attr("transform", "translate(-20, "+height+")" );
		value_lineY_background.attr("transform", "translate("+(d3.select(this).attr("cx")-40)+", "+(height-15)+")" )
			.attr("style", "visibility:visible; width:" + d3.select(this).attr("x_value").length*15);
	  })
	  .on("mouseout", function()
	  {
		value_lineX.attr("style", "visibility:hidden;");
		value_lineX_background.attr("style", "visibility:hidden;");
		value_lineY.attr("style", "visibility:hidden;");
		value_lineY_background.attr("style", "visibility:hidden;");
	  });

  var legend = svg.selectAll(".legend")
	  .data(color.domain())
	.enter().append("g")
	  .attr("class", "legend")
	  .attr("transform", function(d, i) { return "translate(-"+ (width-margin.left/2)+"," + i * 20 + ")"; });

  legend.append("rect")
	  .attr("x", width - 54)
	  .attr("width", 18)
	  .attr("height", 18)
	  .style("fill", color);

  legend.append("text")
	  .attr("x", width - 24)
	  .attr("y", 9)
	  .attr("dy", ".35em")
	  .style("text-anchor", "begin")
	  .text(function(d) { return d; });
	  
  svg.append("text").text("三年年化標準差").attr("transform", "translate("+width/15*7+","+height/14*15+")");
  svg.append("text").text("三年平均月報酬率").attr("transform", "translate(-15, "+height/2+") rotate(-90)");


	/*最下面的slider bar made by brush*/
	var brush = d3.svg.brush()
		.x(x.clamp(true))
		.extent([0, 0])
		.on("brush", function ()
		{
		  var value = brush.extent()[0];
		  if (d3.event.sourceEvent) { // not a programmatic event
			value = x.invert(d3.mouse(this)[0]);
			brush.extent([value, value]);
		  }

		  NowHandle.attr({
			"transform": "translate("+x(value)+"," + height/10*11 + ")"
		  });
		  if(NowRange===LeftRange)
		  {
			NowRange.attr("width",x(value));
		  }
		  else
		  {
			NowRange.attr({
				"transform":"translate("+ (x(value)) +",0)",
				"width": (width-x(value))
			});
		  }
		});

	/********** 橫溝 ********/	
	svg.append("g")
		.attr("class", "x brush_axis")
		.attr("transform", "translate(0," + height/10*11 + ")")
		.call(d3.svg.axis()
		  .scale(x)
		  .orient("bottom")
		  .tickSize(0)
		  .tickFormat(""))
	  .select(".domain")
	  .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
		.attr("class", "brush_halo");
		
	/*************************************************/
	var slider = svg.append("g")
		.call(brush);

	slider.append("circle")
		.attr("transform", "translate(0," + height/10*11 + ")")
		.attr("fill", "#ff0000")
		.attr("r", 9)
		.on("mousedown.brush", function(){NowHandle=d3.select(this);NowRange=LeftRange;})
		.on("touchstart.brush", function(){NowHandle=d3.select(this);NowRange=LeftRange;});

		
	slider.append("circle")
		.attr("transform", "translate("+width+"," + height/10*11 + ")")
		.attr("fill", "#6fdd00")
		.attr("r", 9)
		.on("mousedown.brush", function(){NowHandle=d3.select(this);NowRange=RightRange;})
		.on("touchstart.brush", function(){NowHandle=d3.select(this);NowRange=RightRange;});
}
		

/*
//移到預設位置
slider
	.call(brush.event)
  .transition() // gratuitous intro!
	.duration(750)
	.call(brush.extent([70, 70]))
	.call(brush.event);
*/
