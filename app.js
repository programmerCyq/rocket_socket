let app = require('express')();
let http = require('http').Server(app);
let io = require('socket.io')(http);
var onlineN = 0 ;
var roomInfo = {} ;
var roomID = "room_1";
var nickName = null;
var a = 2;
http.listen(8560,()=>{
	console.log("io start");
});


io.on("connection",function(socket){
	onlineN++;
	//返回连接成功
	socket.emit("conneced");
	nickName = "用户" + socket.id;
	//返回加入房间成功
	socket.on("join",function(){
		//如果没有就创建
		if(!roomInfo[roomID]){
			roomInfo[roomID] = [];
		};
		//当房间满2人的时候，可以开始游戏
		if (roomInfo[roomID].length <= 2) {
			socket.emit("join","ok");
			socket.join(roomID);
			roomInfo[roomID].push(nickName);
			if (roomInfo[roomID].length == 2) {
				io.to(roomID).emit("game.ready")
			};
		}else{
			//否则加入房间失败
			socket.emit("room.satisfy");
		}
	});
	//选择了红色或者蓝色的时候通知房间所有人有什么被选了并且通知自己可以控制什么飞机
	socket.on("ready",function(msg){
		a--;
		if (msg == "red") {
			io.to(roomID).emit("hide","red");
			socket.emit("control","red");
		}else if (msg == "blue") {
			io.to(roomID).emit("hide","blue");
			socket.emit("control","blue");
		};
		if (a==0) {
			io.to(roomID).emit("game.start");
		}
	});

	//飞机移动获取xy返回给房间内所有人
	socket.on("fly",function(flyer,ori){
		io.to(roomID).emit("fly",flyer,ori)
	})


	socket.on("disconnect",function(){
		onlineN--;
		if(roomInfo[roomID]){
			var index = roomInfo[roomID].indexOf(nickName);
		    if (index !== -1) {
		      roomInfo[roomID].splice(index, 1);
		    }
		    socket.leave(roomID);    // 退出房间
		}
	})
})