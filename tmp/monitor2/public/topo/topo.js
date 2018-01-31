var scene;
var topoinfo = []
var heartbeatbyuuid = []
var appInfoMap = {}

function updateData() {
    topoinfo = window.parent.topoinfo;
    heartbeatbyuuid = topoinfo.heartbeatbyuuid;
    appInfoMap = topoinfo.appInfoMap;
    DrawTopo()
}

function myfunc(divName) {
    var canvas = document.getElementById(divName);
    var stage = new JTopo.Stage(canvas);
    scene = new JTopo.Scene(stage);

    updateData()
    setInterval(function(){
        updateData()
    }, 5000);
}

function DrawTopo()
{
    scene.clear();
    var brokerArr = topoinfo.brokerArr;
    var heartbeatmsg = topoinfo.heartbeatmsg;
    var logoutAddr = topoinfo.logoutAddr;
    var logoutUUID = [];
    for(var i = 0; i < logoutAddr.length; i++)
    {
        logoutUUID.push(logoutAddr[i].uuid);
    }

    // 获取proxy,gateway和服务
    var proxyArr = [], serverAddr = [], gateWayAddr = [];
    for(var i = 0; i < heartbeatmsg.length; i++)
    {
        if(heartbeatmsg[i].uuid && -1 === logoutUUID.indexOf(heartbeatmsg[i].uuid) && appInfoMap[heartbeatmsg[i].uuid])
        {
            if(appInfoMap[heartbeatmsg[i].uuid].type == 3 || appInfoMap[heartbeatmsg[i].uuid].type == 4)
            {
                if(heartbeatmsg[i].broker != "logbroker")
                {
                    proxyArr.push(heartbeatmsg[i]);
                }
            }
            else if(appInfoMap[heartbeatmsg[i].uuid].serviceid)
            {
                if(appInfoMap[heartbeatmsg[i].uuid].serviceid === "1")
                {
                    gateWayAddr.push(heartbeatmsg[i]);
                }
                else
                {
                    serverAddr.push(heartbeatmsg[i]);
                }
            }
        }
    }

    // 获取离线proxy,gateway和服务
    var logoutProxyAddr = [], logoutServerAddr = [], logoutGateWayAddr = [];
    for(var i = 0; i < logoutAddr.length; i++)
    {
        if(logoutAddr[i].uuid && appInfoMap[logoutAddr[i].uuid])
        {
            if(appInfoMap[logoutAddr[i].uuid].type == 3 || appInfoMap[logoutAddr[i].uuid].type == 4)
            {
                if(logoutAddr[i].broker != "logbroker")
                {
                    logoutProxyAddr.push(logoutAddr[i]);
                }
            }
            else if(appInfoMap[logoutAddr[i].uuid].serviceid)
            {
                if(appInfoMap[logoutAddr[i].uuid].serviceid === "1")
                {
                    logoutGateWayAddr.push(logoutAddr[i]);
                }
                else
                {
                    logoutServerAddr.push(logoutAddr[i]);
                }
            }
        }
    }

    // 画broker
    var brokerMap = {};
    for(var i = 0; i < brokerArr.length; i++)
    {
        var broker = new JTopo.CircleNode(brokerArr[i]);
        broker.fillColor = '140,252,131';
        broker.radius = 30;
        broker.fontColor = "0,0,0";
        broker.textPosition = "Middle_Center";
        var position = GetPosition(brokerArr[i]);
        broker.setLocation(position.x, position.y);
        broker.layout = {type: 'circle', radius: 150};

        brokerMap[brokerArr[i]] = broker;
        scene.add(broker);
    }

    // 画服务
    for(var i = 0; i < serverAddr.length; i++)
    {
        if(brokerMap[serverAddr[i].broker])
        {
            var serverNode = new JTopo.Node(serverAddr[i].uuid);
            serverNode.fillColor = '0,234,117';
            serverNode.fontColor = "0,0,0";
            serverNode.textPosition = "Middle_Center";
            scene.add(serverNode);
            scene.add(new JTopo.Link(brokerMap[serverAddr[i].broker], serverNode));

            var reqSend = 0;
            var resRecv = 0;
            var resSend = 0;
            var reqRecv = 0;
            var pubSend = 0;
            var pubRecv = 0;
            var queueSend = 0;
            var queueRecv = 0;

            serverNode.mouseover(function(e){
                reqSend = heartbeatbyuuid[this.text].reqsend;
                resRecv = heartbeatbyuuid[this.text].resrecv;
                resSend = heartbeatbyuuid[this.text].ressend;
                reqRecv = heartbeatbyuuid[this.text].reqrecv;
                pubSend = heartbeatbyuuid[this.text].pubsend;
                pubRecv = heartbeatbyuuid[this.text].pubrecv;
                queueSend = heartbeatbyuuid[this.text].queuesend;
                queueRecv = heartbeatbyuuid[this.text].queuerecv;
                liStr = "<li><span class='title'>服务uuid：</span><span>" + appInfoMap[this.text].uuid + "</span></li>" +
                    "<li><span class='title'>服务ID：</span><span>" + appInfoMap[this.text].serviceid + "</span></li>" +
                    "<li><span class='title'>发送请求/接收应答计数：</span><span>" + reqSend + "/" + resRecv +  "</span></li>" +
                    "<li><span class='title'>接收请求/发送应答计数：</span><span>" + resSend + "/" + reqRecv + "</span></li>" +
                    "<li><span class='title'>发送发布/接收发布计数：</span><span>" + pubSend + "/" + pubRecv + "</span></li>" +
                    "<li><span class='title'>发送队列/接收队列长度：</span><span>" + queueSend + "/" + queueRecv + "</span></li>";
                $(".shorttip").show().css({top: e.pageY,left: e.pageX});
                $(".shorttip ul").empty().append(liStr);
                //this.alarm = "Service ID:"+appInfoMap[this.text].serviceid + ";Service UUID:";
                //this.alarmColor = '0,255,0';
                //this.alarmAlpha = 0.5;
            });

            serverNode.mouseout(function(){
                //this.alarm = null;
                $(".shorttip").hide();
            });
        }
    }
    for(var i = 0; i < logoutServerAddr.length; i++)
    {
        var broker = brokerMap[logoutServerAddr[i].broker];
        if(broker)
        {
            var logoutServerNode = new JTopo.Node(logoutServerAddr[i].uuid);
            logoutServerNode.fillColor = '192,192,192';
            logoutServerNode.fontColor = "0,0,0";
            logoutServerNode.textPosition = "Middle_Center";
            scene.add(logoutServerNode);

            var link = new JTopo.Link(broker, logoutServerNode);
            link.strokeColor  = "150,150,150";
            scene.add(link);

            logoutServerNode.mouseover(function(){
                this.alarm = appInfoMap[this.text].serviceid;
                this.alarmColor = '0,255,0';
                this.alarmAlpha = 0.5;
            });

            logoutServerNode.mouseout(function(){
                this.alarm = null;
            });
        }
    }
    for(var p in brokerMap)
    {
        JTopo.layout.layoutNode(scene, brokerMap[p], false);
    }

    // 画bridge
    var proxyMap = {};
    for(var i = 0; i < proxyArr.length; i++)
    {
        var broker = brokerMap[proxyArr[i].broker];
        if(broker)
        {
            var proxyName = appInfoMap[proxyArr[i].uuid].name;
            var proxy = proxyMap[proxyName];
            if(!proxy)
            {
                proxy = new JTopo.CircleNode(proxyName);
                proxy.fillColor = '128,128,255';
                proxy.radius = 15;
                proxy.fontColor = "0,0,0";
                proxy.textPosition = "Middle_Center";

                var position = GetBridgePosition(proxyName);
                if(position)
                {
                    proxy.setLocation(position.x, position.y);
                }
                else
                {
                    proxy.setLocation(broker.x + 200, broker.y - 200);
                }

                proxyMap[proxyName] = proxy;
            }

            scene.add(proxy);
            scene.add(new JTopo.Link(proxy, broker));
        }
    }
    for(var i = 0; i < logoutProxyAddr.length; i++)
    {
        var broker = brokerMap[logoutProxyAddr[i].broker];
        if(broker)
        {
            var proxyName = appInfoMap[logoutProxyAddr[i].uuid].name;
            var proxy = proxyMap[proxyName];
            if(!proxy)
            {
                proxy = new JTopo.CircleNode(proxyName);
                proxy.fillColor = '192,192,192';
                proxy.radius = 15;
                proxy.fontColor = "0,0,0";
                proxy.textPosition = "Middle_Center";

                var position = GetBridgePosition(proxyName);
                if(position)
                {
                    proxy.setLocation(position.x, position.y);
                }
                else
                {
                    proxy.setLocation(broker.x + 200, broker.y - 200);
                }

                proxyMap[proxyName] = proxy;
            }

            scene.add(proxy);
            var link = new JTopo.Link(proxy, broker);
            link.strokeColor  = "150,150,150";
            scene.add(link);
        }
    }

    gateWayAddr = GetSortGateWay(gateWayAddr);
    // 画网关
    for(var i = 0; i < gateWayAddr.length; i++)
    {
        var gateWay = new JTopo.CircleNode(gateWayAddr[i].uuid);
        gateWay.fillColor = '255,128,255';
        gateWay.radius = 15;
        gateWay.fontColor = "0,0,0";
        gateWay.textPosition = "Middle_Center";
        gateWay.setLocation(100 + i * 200, 900);

        scene.add(gateWay);

        var broker = brokerMap[gateWayAddr[i].broker];
        if(broker)
        {
            scene.add(new JTopo.Link(gateWay, broker));
        }
    }
    logoutGateWayAddr = GetSortGateWay(logoutGateWayAddr);
    for(var i = 0; i < logoutGateWayAddr.length; i++)
    {
        var gateWay = new JTopo.CircleNode(logoutGateWayAddr[i].uuid);
        gateWay.fillColor = '192,192,192';
        gateWay.radius = 15;
        gateWay.fontColor = "0,0,0";
        gateWay.textPosition = "Middle_Center";
        gateWay.setLocation(100 + i * 200 + gateWayAddr.length * 200, 900);

        scene.add(gateWay);

        var broker = brokerMap[logoutGateWayAddr[i].broker];
        if(broker)
        {
            var link = new JTopo.Link(gateWay, broker);
            link.strokeColor  = "150,150,150";
            scene.add(link);
        }
    }

    scene.addEventListener('mouseup', function(e){
        if(e.target && e.target.layout){
            JTopo.layout.layoutNode(scene, e.target, true);
        }
    });
}

function GetPosition(brokerName)
{
    var position = {};
    if("filebroker" === brokerName)
    {
        position.x = 200;
        position.y = 600;
    }
    else if("filebroker2" === brokerName)
    {
        position.x = 1600;
        position.y = 600;
    }
    else if("msgbroker" === brokerName)
    {
        position.x = 400;
        position.y = 200;
    }
    else if("msgbroker2" === brokerName)
    {
        position.x = 1400;
        position.y = 200;
    }
    else if("mainbroker" === brokerName)
    {
        position.x = 600;
        position.y = 600;
    }
    else if("mainbroker2" === brokerName)
    {
        position.x = 1200;
        position.y = 600;
    }
    else if("logbroker" === brokerName)
    {
        position.x = 900;
        position.y = 300;
    }
    else
    {
        console.log("Unknow broker, broker:" + brokerName);
        position.x = scene.width * Math.random() + 100;
        position.y = 1500;
    }

    return position;
}

function GetSortGateWay(gateWayList)
{
    var sortGateWayList = [];
    for(var i = 0; i < gateWayList.length; i++)
    {
        if(gateWayList[i].broker == "filebroker")
        {
            sortGateWayList.push(gateWayList[i]);
        }
    }
    for(var i = 0; i < gateWayList.length; i++)
    {
        if(gateWayList[i].broker == "mainbroker")
        {
            sortGateWayList.push(gateWayList[i]);
        }
    }
    for(var i = 0; i < gateWayList.length; i++)
    {
        if(gateWayList[i].broker == "logbroker")
        {
            sortGateWayList.push(gateWayList[i]);
        }
    }
    for(var i = 0; i < gateWayList.length; i++)
    {
        if(gateWayList[i].broker == "mainbroker2")
        {
            sortGateWayList.push(gateWayList[i]);
        }
    }
    for(var i = 0; i < gateWayList.length; i++)
    {
        if(gateWayList[i].broker == "filebroker2")
        {
            sortGateWayList.push(gateWayList[i]);
        }
    }
    return sortGateWayList;
}

function GetBridgePosition(bridgeName)
{
    var position = {};
    if("bridge1" == bridgeName)
    {
        position.x = 900;
        position.y = 550;
    }
    else if("bridge2" == bridgeName)
    {
        position.x = 900;
        position.y = 650;
    }
    else if("msg_proxy" == bridgeName)
    {
        position.x = 500;
        position.y = 400;
    }
    else if("msg_proxy2" == bridgeName)
    {
        position.x = 1300;
        position.y = 400;
    }
    else if("msg_log_proxy" == bridgeName)
    {
        position.x = 650;
        position.y = 250;
    }
    else if("msg_log_proxy2" == bridgeName)
    {
        position.x = 650;
        position.y = 250;
    }
    else if("msgbridge1" == bridgeName)
    {
        position.x = 900;
        position.y = 60;
    }
    else if("msgbridge2" == bridgeName)
    {
        position.x = 900;
        position.y = 120;
    }
    else
    {
        return null;
    }
    return position;
}