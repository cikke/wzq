//永远黑先
//当前棋子颜色
var bow = 1;//1:黑 [2：白  ] //黑色1，白色0.1,方便五元组中数值计算
//难度系数(向后预测步数)var count = 0;

//按照规则5个一组，按组取分，按分选点
//五元组分数分配
var tupleState={
	blank:7,
	B1:35,
	B2:800,
	B3:15000,
	B4:800000,
	W1:15,
	W2:400,
	W3:1800,
	W4:100000,
	virtual:0,//undefined
	pollute:0//既有黑又有白
};
var tuples = [];

function getTuples(){//19*19--最后一组[15,16,17,18,19]
	//横向 记录xy,x向后+5
	$(function(){
		for(var i=1;i<16;i++){
			for(var j=1;j<20;j++){
				var obj={};
				obj.xy=[];
				obj.val=[];
				obj.state=tupleState.blank;
				obj.num=0;
				for(var m=0;m<5;m++){
					obj.xy.push({x:i+m,y:j});
					obj.val.push(getTadByXY(i+m,j));
				}
				tuples.push(obj);
			}
		}
	})
	//竖向 记录xy,y向后+5
	$(function(){
		for(var i=1;i<16;i++){
			for(var j=1;j<20;j++){
				var obj={};
				obj.xy=[];
				obj.val=[];
				obj.state=tupleState.blank;
				obj.num=0;
				for(var m=0;m<5;m++){
					obj.xy.push({x:j,y:i+m});
					obj.val.push(getTadByXY(j,i+m));
				}
				tuples.push(obj);
			}
		}
	})
	//正（左）斜 记录xy,xy向后+5
	$(function(){
		for(var i=1;i<16;i++){
			for(var j=1;j<16;j++){
				var obj={};
				obj.xy=[];
				obj.val=[];
				obj.state=tupleState.blank;
				obj.num=0;
				for(var m=0;m<5;m++){
					obj.xy.push({x:i+m,y:j+m});
					obj.val.push(getTadByXY(i+m,j+m));
				}
				tuples.push(obj);
			}
		}
	})
	//反（右）斜 记录xy,x+y-||y+x-
	$(function(){
		for(var i=1;i<16;i++){
			for(var j=19;j>4;j--){
				var obj={},obj2={};
				obj.xy=[];
				obj2.xy=[];
				obj.val=[];
				obj2.val=[];
				obj.state=tupleState.blank;
				obj2.state=tupleState.blank;
				obj.num=0;
				obj2.num=0;
				for(var m=0;m<5;m++){
					obj.xy.push({x:i+m,y:j-m});
					obj.val.push(getTadByXY(i+m,j-m));
					
					obj2.xy.push({x:j-m,y:i+m});
					obj2.val.push(getTadByXY(j-m,i+m));
				}
				tuples.push(obj);
			}
		}
	})
	return tuples;
}
function getTuplesByXY(x,y){
	var arrTuple = [];
	for(var i=0,len=tuples.length;i<len;i++){
		var arr = tuples[i].xy;
		if((arr[0].x==x&&arr[0].y==y)
				||(arr[1].x==x&&arr[1].y==y)
				||(arr[2].x==x&&arr[2].y==y)
				||(arr[3].x==x&&arr[3].y==y)
				||(arr[4].x==x&&arr[4].y==y)){
			arrTuple.push(tuples[i]);
		}
	}
	return arrTuple;
}
function getStateByXY(x,y){
	try{
		return $(".table-a."+x+"-"+y)[0].state;
	}catch(err){
		return false;
	}
}
function getTaByXY(x,y){
	return $(".table-a."+x+"-"+y);
}
function getTadByXY(x,y){
	return $(".table-a."+x+"-"+y)[0];
}
function updateTupleNum(obj){//obj:某个格点
	//获取此格点所属的五元组
	var arr = getTuplesByXY(obj.xy.x,obj.xy.y);
	for(var i=0,len=arr.length;i<len;i++){
		arr[i].num+=obj.state;
		arr[i].state = updateTupleState(arr[i]);
	}
	console.log(arr);
}
function updateTupleState(tuple){
	var state = tuple.state;
	var num = tuple.num;
	var bNum = Math.floor(num);//黑子数
	var wNum = (num - bNum)*10;//白子数
	if(bNum==0&&wNum==0)return state;
	if(bNum!=0&&wNum!=0){
		state += tupleState.pollute;//0
		return state;
	}
	if(bNum==0){//黑0，白一定大于0，小于5
		state += tupleState["W"+wNum];
	}else{//白0，黑一定大于0，小于5
		state += tupleState["B"+bNum];
	}
	return state;
}
function chooseTuple(){//根据落点查找八个方向的向外5点的五元组
	var lennew = tuples.length;
	for(var i = 0; i < lennew - 1; i++){//排序
		for(var j = 0; j < lennew - i - 1; j++){
			if(tuples[j].state > tuples[j + 1].state){
				var swap = tuples[j];
				tuples[j] = tuples[j + 1];
				tuples[j + 1] = swap;
			}
		}
	}
	return tuples[lennew-1];
}
function loopChooseTa(){//向前找符合要求的五元组的Ta
	var lennew = tuples.length;
	var loopNum = 2;
	for(var i = 0; i < lennew - 1; i++){//排序
		for(var j = 0; j < lennew - i - 1; j++){
			if(tuples[j].state > tuples[j + 1].state){
				var swap = tuples[j];
				tuples[j] = tuples[j + 1];
				tuples[j + 1] = swap;
			}
		}
	}
	var obj = chooseTaInTuple(tuples[lennew-loopNum]);
	for(var i = 0; i < lennew - 1; i++){
		loopNum++;
		var obj = chooseTaInTuple(tuples[lennew-loopNum]);
		if(obj)return obj;
	}
}
function chooseTaInTuple(tuple){//根据五元组随机取某个Ta
	var arr=[];
	for(var i=0;i<5;i++){
		if(!tuple.val[i].state)arr.push(tuple.val[i]);
	}
	var i = rnd(0,arr.length-1);
	return arr[i];
}
function rnd(n,m){
	var random = Math.floor(Math.random()*(m-n+1)+n);
	return random;
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
				console.log("people:"+JSON.stringify(this.xy));
				if(this.state)return console.log("此处有子："+this.state);
				this.state=bow;
				if(bow==1){//黑棋落子
					bow=0.1;
					$(this).css({"backgroundColor":"#000000"});
					success(this);
				}else if(bow==0.1){//白棋落子
					bow=1;
					$(this).css({"backgroundColor":"#FFFFFF"});
					success(this);
				}
				//每次落子后修改五元组状态
				updateTupleNum(this);
				//ai落子
				var tuple = chooseTuple();
				var obj = chooseTaInTuple(tuple);
				//如果obj不存在，则进攻，不需要防守//进攻暂时为随机
				if(!obj){
					obj = loopChooseTa();
				}
				console.log("computer:"+JSON.stringify(obj.xy));
				if(obj.state)return console.log("此处有子："+obj.state);
				obj.state=bow;
				if(bow==1){//黑棋落子
					bow=0.1;
					$(obj).css({"backgroundColor":"#000000"});
					success(obj);
				}else if(bow==0.1){//白棋落子
					bow=1;
					$(obj).css({"backgroundColor":"#FFFFFF"});
					success(obj);
				}
				updateTupleNum(obj);
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

getTuples();
