const request = require('request');
const watson = require('watson-developer-cloud/assistant/v1');
const fs = require('fs');
const config = JSON.parse(fs.readFileSync('conf.json','utf8'));
const assistant = new watson({
    version : config.watson.version,
    username : config.watson.username,
    password : config.watson.password
});

exports.socket=(socket)=>{
    console.log('socket connected');
    socket.on('add user',(data)=>{
        console.log('add user',data);
        socket.emit('login',{"numUsers":0})
    });
    socket.on('new message',(data)=>{
        let preconfig={
            workspace_id: config.assistant.workspace_id,
            input: {'text' : data }
        };
        assistant.message(preconfig,(err,response)=>{
            if(err){
                console.log(err);
            }else{
                console.log(JSON.stringify(response,null,2));
                if(response.context.action){
                    let date = new Date();
                    date = date.toISOString().substring(0,10).split("-");
                    let today = date[0]+date[1]+date[2];
                    let url_build =
                        "http://newsky2.kma.go.kr/service/SecndSrtpdFrcstInfoService2/ForecastSpaceData?" +
                        "serviceKey="+config.kma.servicekey+"&" +
                        "base_date="+today+"&" +
                        "base_time=0500&" +
                        //위치 넣는곳
                        "nx=62&" +
                        "ny=124&" +
                        //==========
                        "numOfRows=50&" +
                        "pageSize=50&" +
                        "pageNo=1&" +
                        "startPage=1&" +
                        "_type=json";
                    request(url_build,(error,response,body)=>{
                        if(error){
                            console.log(error);
                        }else{
                            var result = JSON.parse(body);
                            var item = result.response.body.items.item;
                            for(let i in item){
                                //현재 시간 기준으로 추출 현재는 습도만 추출
                                if(item[i].fcstTime=="1800" && item[i].category=="REH"){
                                    var msg = {
                                        "username":"admin",
                                        "message":"습도 : "+item[i].fcstValue+"%"
                                    };
                                    socket.emit('new message',msg);
                                }
                            }
                        }
                    })
                }

            }
        });
    });
};