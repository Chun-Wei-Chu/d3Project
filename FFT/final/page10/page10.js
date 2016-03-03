/*
	設計理念
		bar圖表為常用的圖表，未來重複使用率高，所以個別寫成createPage10.prototype.Bar
		
		邊框的顏色為聯動
		
		圖表顏色、小正方形、圓型顏色為聯動
		
		圖形與字體全依比例調整，未來在微調時會比較方便
*/

function createPage10()
{
}

createPage10.prototype.draw=function(target, data, width, height, color, font_size)
{
	//font_size ,  font_size*7 優化用
	d3.select(target).append("svg")
		.attr("height", font_size*2)
		.attr("width", width)
		.append("text").text(data.chartText).attr("style", "font-size:"+font_size+"px;" ).attr("transform", "translate(50, "+font_size+")");
		
	//改用table的方式去設定以保證一定在上方	
	var BarTable = d3.select(target).append("table").attr("style", "border:8px "+color+" solid;");
	
	var BarTableUp = BarTable.append("tr").append("td");
	
/**************** 插入小標題**********************/
	
	BarTableUp.append("svg")
		.attr("width", font_size*6.5)
		.attr("height", font_size)
		.append("rect")
			.attr("class",  "page10_bar1")
			.attr("width", font_size)
			.attr("height", font_size)
			.attr("transform", "translate(100,0)");
			  
	BarTableUp.append("text").text("現在").attr("style", "font-size:"+font_size+"px;" );

	BarTableUp.append("svg")
		.attr("width", font_size*6.5)
		.attr("height", font_size)
		.append("rect")
			.attr("class",  "page10_bar2")
			.attr("width", font_size)
			.attr("height", font_size)
			.attr("transform", "translate(100,0)");
			  
	BarTableUp.append("text").text("優化後").attr("style", "font-size:"+font_size+"px;" );
/****************繪製併行圖表*********************/
//感覺未來比較可能重用 所以分開寫
	this.Bar(BarTable.append("tr").append("td"), data, width, height);

/****************繪製併行Table*********************/	
	d3.select(target).append("svg")
		.attr("height", font_size*6)
		.attr("width", width)
		.append("text").text(data.tableText).attr("style", "font-size:"+font_size+"px;" ).attr("transform", "translate(50, "+font_size*4+")");
	
	var Table = d3.select(target).append("table")
		.attr("width", width+25)
		.attr("style", "border:4px "+color+" solid;border-collapse:collapse;")
		.attr("border", 1);
		
	//會有覆蓋問題 但卻因此剛好符合題意...看之後要不要改 select("td") -> 所有td,  select(".td") ->後來欲加入的
	//var tmp = data.data.map(function(d){return {text:d.text}})	
	var TableTitleX = Table.append("tr").attr("style", "background:"+color+";width:100%");
	TableTitleX.append("td").attr("style", "width:10%").text("");	
	TableTitleX.selectAll(".td")
		.data(data.data).enter()
		.append("td")
			.attr("style", "border:4px "+color+" solid;border-collapse:collapse;")
			.append("text").text(function(d){return d.text});
			
	this.tableTr(Table.append("tr"), "現在", "page10_bar1", data.data.map(function(d){return {percent:d.table.now.percent, value:d.table.now.value};}), font_size,color);
	this.tableTr(Table.append("tr"), "優化後", "page10_bar2", data.data.map(function(d){return {percent:d.table.optimization.percent, value:d.table.optimization.value};}), font_size, color);
			
}

//為了程式美觀用了map之類的其實效能比較不好，但這支是小程式影響不大
createPage10.prototype.tableTr=function(D3target, text, style, data, circleSize, color)
{
	//畫原點加標題
	var tmp = D3target.append("td").append("div")
		.attr("style", "background:"+color+";")
		.append("svg")
			.attr("width", circleSize*7)
			.attr("height", circleSize*2);

	tmp.append("circle").attr(
		{
			cx: circleSize,
			cy: circleSize*3/2, 
			r:circleSize/2
		})
		.attr("class", style);
	tmp.append("text").text(text)
		.attr("transform", "translate("+circleSize*2+", "+circleSize*1.5+")");

	//填數據
	D3target.selectAll(".td")
		.data(data).enter()
		.append("td")
			.attr("style", "border:4px "+color+" solid;border-collapse:collapse;")
			.append("text").text(function(d){return (d.percent>0?("+"+d.percent):d.percent)+"%"})
				.append("span").text(function(d){return "\t" +d.value;}).attr("style","white-space:pre;color:#3b3;");
}

//創造並行的bar用
createPage10.prototype.Bar=function(D3target, data, width, height)
{
	var margin = {top: 20, right: 20, bottom: 30, left: 100},
		width = width - margin.left - margin.right,
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
		.orient("left");
		
	var svg = D3target.append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
	  .append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	 var min=d3.min(data.data, function(d) { return Math.min(d.chart.now, d.chart.optimization); });
	 var max=d3.max(data.data, function(d) { return Math.max(d.chart.now, d.chart.optimization); });
	 	 
	  x.domain(data.data.map(function(d) { return d.text; }));
	  y.domain([min, max]).nice();
	  
	 //背景虛線 格線
     var axisXGrid = d3.svg.axis()
      .scale(x)
      .orient("bottom")
      .tickFormat("")
      .tickSize(-height,0);

    var axisYGrid = d3.svg.axis()
      .scale(y)
      .orient("left")
      .tickFormat("")
      .tickSize(-width,0);

    svg.append('g')
     .call(axisXGrid)
     .attr({
      'fill':'none',
      'stroke':'rgba(0,0,0,.1)',
      'transform':'translate('+ x.rangeBand()/5*4+','+height+')' 
     });

    svg.append('g')
     .call(axisYGrid)
     .attr({
      'fill':'none',
      'stroke':'rgba(0,0,0,.1)',
      'transform':'translate(0,0)'
     });
	 
	 //為了方便JSON格式設計 加上又不是很複雜的架構 所以直接貼兩次
	 svg.selectAll(".bar")
		  .data(data.data)
		.enter().append("rect")
		  .attr("class",  "page10_bar1")
		  .attr("x", function(d) { return x(d.text); })
		  .attr("width", x.rangeBand()/15*7)
		  .attr("y", function(d) { return y(d.chart.now); })
		  .attr("height", function(d) { return height - y(d.chart.now); });
		
	svg.selectAll(".bar")
		  .data(data.data)
		.enter().append("rect")
		  .attr("class",  "page10_bar2")
		  .attr("x", function(d) { return x(d.text) + x.rangeBand()/2; })
		  .attr("width", x.rangeBand()/15*7)
		  .attr("y", function(d) { return y(d.chart.optimization); })
		  .attr("height", function(d) { return height - y(d.chart.optimization); });

		  
	//最後才加入XY軸以免覆蓋問題	  
	  svg.append("g")
		  .attr("class", "x axis")
		  .attr("transform", "translate(0," + height + ")")
		  .call(xAxis)
		  .append("text")
			.text(data.text)
			.attr("transform", "translate("+width/2+", -" + height + ")");

	  
	 svg.append("g")
		.attr("class", "y axis")
		.attr("transform", "translate(0,0)")
		  .call(yAxis);

}