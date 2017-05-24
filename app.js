let app = require('express')();
let http = require('http').Server(app);
let io = require('socket.io')(http);
var onlineUsers = {};
var onlineCount = 0;
var nickName;
var roomCount = 0;
http.listen(8560,()=>{
	console.log("io start");
});

io.on("connection",function(socket){
	socket.emit("connection",{status : "ok" , msg : "Wellcom to the room"});
	// console.log("第"+(onlineCount-0+1)+"用户连接成功，用户id为"+socket.id);
	nickName = "用户"+socket.id;
	console.log(io)
	let Obj_user = {
		id:socket.id,
		name:nickName
	};
	onlineCount++;
	onlineUsers.nickName = Obj_user;
	// console.log("在线的人数"+onlineCount)
	socket.on("join",()=>{
		// console.log("有用户加入房间")
	});
	socket.on("ready",(msg)=>{
		roomCount++;
		// console.log("房间的人数"+roomCount);
		if(roomCount == "2"){
			io.sockets.emit("startGame","ok")
		}
	});
	socket.on("disconnect",()=>{
		delete onlineCount.nickName;
		onlineCount--;
		roomCount--;
		// console.log("有用户退出，当前的用户人数为"+onlineCount);
		// console.log("房间内的人数"+roomCount)
	})
})