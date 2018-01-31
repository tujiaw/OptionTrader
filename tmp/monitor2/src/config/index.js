//连接参数配置

//export var wsip = "172.16.66.87";
//export var wsport = "7777";

export var wsip = "47.100.7.224";
export var wsport = "55555";

export var wsLocation = wsip + ":" + wsport;
export var path = "";

export var token = '123456'; // 假token
export var username,userid,accountid,loginname;
export var pictures = [], sortedPics = [];
export var uuids = [];
export var userIds = [];
export var tablelevel = "";

export var raruuid = [];

//定义菜单及内容公用变量结构,勿删！rights -菜单项数组；rightsdesc - 菜单中文描述数组；
export var rights = ['log','service','gateway','relation','user','sysmsg','online','qqnickname','public','right','global','mobilesettings','mobilemainpage','restartserver','datachange','qmnochange','topo','recommend','emoticon','setmassgrouplimit','autoreply', 'monitorapp'];
export var rightsdesc = ['监控日志','服务在线','网关','绑定','账号','通知','在线统计','QQ昵称','机构号','权限控制','全局变量配置','移动更新设置','移动主页设置','服务重启','资料变更','群号更改','服务拓扑图','推荐群或机构号','表情包管理','群发人数设置','自动回复设置', '合规监控'];

export var codeList = [
    'IC1802',
    'IF1802',
    'IH1802',
    'i1805'
]
