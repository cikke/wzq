//默认黑先
var bow = 1;//1:黑 2：白
function getStateByXY(x,y){
	try{
		return $(".table-a."+x+"-"+y)[0].state;
	}catch(err){
		return false;
	}
}
function success(obj){
	$(function(){
		var count=1;//每个最大4次
		//正横向
		for(var i=1;i<5;i++){
			if(getStateByXY(obj.xy.x-i,obj.xy.y)&&getStateByXY(obj.xy.x-i,obj.xy.y)==obj.state)count++;
		}
		//负横向
		for(var i=1;i<5;i++){
			if(getStateByXY(obj.xy.x+i,obj.xy.y)&&getStateByXY(obj.xy.x+i,obj.xy.y)==obj.state)count++;
		}
		if(count==5){
			if(obj.state==1){
				alert("黑方赢");
			}else{
				alert("白方赢");
			}
			window.location.reload();
		}
	})
	$(function(){
		var count=1;//每个最大4次
		//正竖向
		for(var i=1;i<5;i++){
			if(getStateByXY(obj.xy.x,obj.xy.y-i)&&getStateByXY(obj.xy.x,obj.xy.y-i)==obj.state)count++;
		}
		//负竖向
		for(var i=1;i<5;i++){
			if(getStateByXY(obj.xy.x,obj.xy.y+i)&&getStateByXY(obj.xy.x,obj.xy.y+i)==obj.state)count++;
		}
		if(count==5){
			if(obj.state==1){
				alert("黑方赢");
			}else{
				alert("白方赢");
			}
			window.location.reload();
		}
	})
	$(function(){
		var count=1;//每个最大4次
		//正左倾斜
		for(var i=1;i<5;i++){
			if(getStateByXY(obj.xy.x-i,obj.xy.y-i)&&getStateByXY(obj.xy.x-i,obj.xy.y-i)==obj.state)count++;
		}
		//负左倾斜
		for(var i=1;i<5;i++){
			if(getStateByXY(obj.xy.x+i,obj.xy.y+i)&&getStateByXY(obj.xy.x+i,obj.xy.y+i)==obj.state)count++;
		}
		if(count==5){
			if(obj.state==1){
				alert("黑方赢");
			}else{
				alert("白方赢");
			}
			window.location.reload();
		}
	})
	$(function(){
		var count=1;//每个最大4次
		//正右倾斜
		for(var i=1;i<5;i++){
			if(getStateByXY(obj.xy.x+i,obj.xy.y-i)&&getStateByXY(obj.xy.x+i,obj.xy.y-i)==obj.state)count++;
		}
		//负右倾斜
		for(var i=1;i<5;i++){
			if(getStateByXY(obj.xy.x-i,obj.xy.y+i)&&getStateByXY(obj.xy.x-i,obj.xy.y+i)==obj.state)count++;
		}
		if(count==5){
			if(obj.state==1){
				alert("黑方赢");
			}else{
				alert("白方赢");
			}
			window.location.reload();
		}
	})
}
$(function(){
	var $table=$(".table");
	for(var i=1;i<20;++i){
		$("<div class='table-h "+i+"'></div>").appendTo($table);
	}
	
	for(var j=1;j<20;++j){
		var $h=$(".table-h."+j)
		for(var i=1;i<20;++i){
			var $ta=$("<div class='table-a "+i+"-"+j+"'></div>");
			$ta.appendTo($h);
			$ta[0].xy = {x:i,y:j};
			$ta.on('click',function(){
				console.log(this.xy);
				if(this.state)return console.log("此处有子："+this.state);
				this.state=bow;
				if(bow==1){//黑棋落子
					bow=2;
					$(this).css({"backgroundColor":"#000000"});
					success(this);
				}else if(bow==2){//白棋落子
					bow=1;
					$(this).css({"backgroundColor":"#FFFFFF"});
					success(this);
				}
			})
			
		}
	}
	
	var canvas = document.getElementById("canvas");
	var context = canvas.getContext("2d");
	context.fillStyle = "#F4A460";
	context.fillRect(0,0,540,540);
	
	context.rect(0,0,540,540);
	
	for(var i=1;i<19;i++){
		context.moveTo(0,i*30);
		context.lineTo(540,i*30);
	}
	for(var i=1;i<19;i++){
		context.moveTo(i*30,0);
		context.lineTo(i*30,540);
	}
	context.lineWidth = 2;
	context.strokeStyle = "#000000";
	context.stroke();
	
})
