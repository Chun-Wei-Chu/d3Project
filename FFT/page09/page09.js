/*
設計理念
	對於每一列資料由於上標欄位名稱固定
	但有些列中的欄位並無資料
    所以當遇到這種情形為了設計方便起見，避免太多判斷，須補填空值，function 會判斷是否為數字會空值
	
	每一列的創造可選擇顏色，最後會回傳兩個值給callback去運算，分別是顏色和列的element方便之後加其他attr
	
	欄位名稱需固定，因為前面會用來判斷位置已決定顯示文字要靠左還是default
*/

function createPage_09(){}
		
createPage_09.prototype.draw=function(target, data)
{
	 d3.select(target).append("div")
		.attr("style", "text-align:right; white-space:pre; width:100%;")
		.text("前次部位調整時間:  "+data.adjustDate_last);
	 
	var main = d3.select(target).append("table")
		.attr("style", "width:100%;border-collapse:collapse");
	
	var title_num=0;
	main.append("tr")
		.attr("style", "border:2px #000 solid;")
		.selectAll(".td")
		.data(data.title).enter()
		.append("td").text(function(d){return d;})
		.attr("style", function(d){title_num++; return title_num>2?"text-align:right":""});
	
	//新增各類型投資標的
	for(var key in data.data)
	{
		this.add_sub_element(main, data.data[key].total, "#9ff");
		for(var each in data.data[key].each)
		{
			this.add_sub_element(main, data.data[key].each[each], "");
		}
	}
	
	//計算summary
	var summary={
		type:"合計",
		product:"",
		price:0,
		remuneration:0	,
		proportion:"",
		plan:"",
		diff:""
	};	
	for(var key in data.data)
	{
		summary.price+=data.data[key].total.price;
		summary.remuneration+=(data.data[key].total.remuneration*data.data[key].total.proportion)/100;
	}
	this.add_sub_element(main, summary, "#9ff", function(element, color){
		element.attr("style", "border:2px #000 solid;background:" + color);
	});
			
}


//條列式加入tr
createPage_09.prototype.add_sub_element=function(main, data, color, callback)
{
	var tmp = [];
	for(var key in data)
	{
		tmp.push(data[key]);
	}
	
	var td_num=0;
	var thousandComma=this.thousandComma;//call(this)竟然會導致functin(d)變成undefined...
	var ForCallBack = main.append("tr")
		.attr("style", "background:" + color);
		
	ForCallBack.selectAll(".td")
		.data(tmp).enter()
			.append("td").text(function(d)
				{
					td_num++;
					if(td_num == 3)
					{
						return thousandComma(d);
					}
					else if(td_num>3&&d!=="")
					{							
						return d.toFixed(2)+"%";
					}
					return d;
				})
				.attr("style", function(d){
					if(!isNaN(d))
					{	
						return "text-align:right";
					}
				});
	
	//check if callback is define(練習callback)
	var getType = {};
	if(callback && getType.toString.call(callback) === '[object Function]')
	{
		callback(ForCallBack, color);
	}
}

//將數字標示成千分位
createPage_09.prototype.thousandComma=function(number)
{
	 var num = number.toString();
	 var pattern = /(-?\d+)(\d{3})/;
	  
	 while(pattern.test(num))
	 {
		num = num.replace(pattern, "$1,$2");	  
	 }
	 return num;	 
}