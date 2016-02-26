//main function
//透過純變數取得element位置 優點是不用做太多命名 缺點是需要較多記憶體去紀錄
function createPage12(target, data, width, height)
{
	
	var mainBody = d3.select(target).append("table").append("tr");
	var leftBody = mainBody.append("td");
	var rightBody = mainBody.append("td");
	
	//Array copy by value not ref	
	var sortable = data.slice(0);

	/*
	取得right chart長度增加得單位
	透過map建立新的array其順序依據Array data中的times取絕對值(正常都是正數)
	接著回傳後透過Math.max.apply取得最大值當基底
	右半部width設計為傳入大小的三分之一，為美觀取其四分之一為最大長度
	最大長度 / 基底則為增加幅度
	*/
	
/*************************************** right chart *************************************************/
	var leftBodySizeScale = width/4/(Math.max.apply(Math,data.map(function(d){return Math.abs(d.times);})));
	
	//sort new array sortable
	sortable.sort(function(a, b) {return a.value - b.value}).reverse();
	for(var key in sortable)
	{
		 rightBody.append("div")
			.attr("class", "page12_chartLeft")
			.attr("mapValue", sortable[key].value)
			.attr("style", "height:"+height/data.length/3*2+"px;width:"+ (Math.abs(sortable[key].times)*leftBodySizeScale)+"px;") //Math.abs 取絕對值
			.text(sortable[key].value)
			.on("click", function(){
				/*需要在商討的部分，此為試作確認其可能性*/
				
				value_line
					.attr("transform", "translate(0," + y(d3.select(this).attr("mapValue"))+ ")")
					.attr("style", "visibility:visible;");
					
				value_line.select("text").text(d3.select(this).attr("mapValue"));
			});

	}
	

/*********************************** left chart ********************************************/
	//會依據width 和 height調整bar的大小
	var margin = {top: 20, right: 30, bottom: 40, left: 30},
		width = width/3*2 - margin.left - margin.right,
		height = height - margin.top - margin.bottom;

	//scale就是畫刻度，而在這標準是以height和width當參考  範圍由上而下 >> 從大到小[height, 0]
	var y = d3.scale.linear()
		.range([height, 0]);

	//ordinal是設定座標軸的位置 0.1則為bar之間的寬度
	var x = d3.scale.ordinal()
		.rangeRoundBands([0, width], 0.1);

	//x軸在下方
	var xAxis = d3.svg.axis()
		.scale(x)
		.orient("bottom");
	
	//y軸在左方
	var yAxis = d3.svg.axis()
		.scale(y)
		.orient("left");

	var svg = leftBody.append("svg")
		.attr("width", (width + margin.left + margin.right))
		.attr("height", height + margin.top + margin.bottom)
	  .append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
		
	//畫背景虛線，ticks能畫的線數為 num <= 5 ? num:10的倍數	
    var axisYGrid = d3.svg.axis()
      .scale(y)
      .orient("left")
	  .ticks(10)
      .tickFormat("")
      .tickSize(-width,0);

    svg.append('g')
     .call(axisYGrid)
     .attr({
      'fill':'none',
      'stroke':'rgba(0,0,0,.1)',
     });
	 
	//transform
	//... translate(向右位移, 向下位移)
	//... scale(x) 等比放大, scale(x,y)依需求縮放，如果是負值則為鏡射
	//... rotate(旋傳角度)以左上方為圓心, rotate(旋轉角度, 自訂圓心X, 自訂圓心Y)	
	//svg.attr("transform", "rotate(90,220,250)");


	  y.domain(d3.extent(data, function(d) { return d.value; })).nice();
	  x.domain(data.map(function(d) { return d.name; }));	


	  //Math.max(0, d.value) 如果是負的 起始位置則為y(0)
	  svg.selectAll(".bar")
		  .data(data)
		.enter().append("rect")
		  .attr("class", function(d) { return "page12_bar--" + (d.value < 0 ? "negative" : "positive"); })
		  .attr("y", function(d) { return y(Math.max(0, d.value)); })
		  .attr("y_value", function(d) { return d.value;})
		  .attr("x", function(d) { return x(d.name); })
		  .attr("height", function(d) { return Math.abs(y(d.value) - y(0)); })
		  .attr("width", x.rangeBand())
		  .on("mouseover", function()
		  {
			//取得
			value_line
				.attr("transform", "translate(0," + y(d3.select(this).attr("y_value"))+ ")")
				.attr("style", "visibility:visible;");
			
				value_line.select("text").text(d3.select(this).attr("y_value"));
		  })
		  .on("mouseout", function()
		  {
			value_line
					.attr("style", "visibility:hidden;");
		  });
	
	//add x-axis and y-axis
	  svg.append("g")
		  .attr("class", "x axis")
		  .attr("transform", "translate(0," + y(0) + ")")
		  .call(xAxis);

	  svg.append("g")
		  .attr("class", "y axis")
		  .call(yAxis);
	  
	//for show the data's location
	//紀錄svg_append(g)，而非之後創建的其他物件	
	  var value_line=svg.append("g");		  
	  value_line
		.attr("style","visibility:hidden;")
		.attr("class", "x axis")
		.call(d3.svg.axis()
			.scale(d3.scale.ordinal().rangeRoundBands([0, width]))
			.orient("bottom").tickSize(0))
		.append("text")
			.attr("transform", "translate("+width+", 0)" );
		
	/*
	svg.append("g")		  
		.attr("class", "y axis")
		.call(yAxis)
		.attr("transform", "translate("+x("G")+", 0)" )
		.append("text");
	 */
	  
	function type(d) 
	{
	  d.value = +d.value;
	  return d;
	}
}