//订阅变量配置，服务心跳、日志、网关、聊天消息统计；
export var APPID = 0x00B;

export var SUBID_TO_LOG = 1;
export var SUBID_TO_LOGIN = 2;
export var SUBID_TO_LOGOUT = 3;
export var SUBID_TO_HEARTBEAT = 4;
export var SUBID_TO_GATEWAY = 5;
export var SUBID_TO_MSG = 6;

export var TOPIC_LOGIN = 0x00001;
export var TOPIC_LOGOUT = 0x00002;
export var TOPIC_HEARTBEAT = 0x00003;
export var TOPIC_LOG = 0x00004;

export var TOPIC_GATEWAY = (0x045 << 20) | 0x00001 ;
export var TOPIC_MSG = (0x03C<<20) | 0x00001;

export var msgExpress = {
    KEY_UUID: 1,KEY_AUTH: 2,KEY_ADDR: 3,KEY_NAME: 4,KEY_TYPE: 5,KEY_GROUP: 6,
    KEY_IP: 7,KEY_STARTTIME: 8,KEY_LOGINTIME: 9,KEY_SERVICE: 10,KEY_HBTIME: 20,
    KEY_CPU: 21,KEY_TOPMEM: 22,KEY_MEM: 23,KEY_CSQUEUE: 24,KEY_CRQUEUE: 25,
    KEY_QUEUELENGTH: 29,KEY_RECVREQUEST: 30,KEY_SENTREQUEST: 31,KEY_RECVRESPONSE: 32,
    KEY_SENTRESPONSE: 33,KEY_RECVPUBLISH: 34,KEY_SENTPUBLISH: 35,KEY_RECVREQUESTB: 36,
    KEY_SENTREQUESTB: 37,KEY_RECVRESPONSEB: 38,KEY_SENTRESPONSEB: 39,KEY_RECVPUBLISHB: 40,
    KEY_SENTPUBLISHB: 41,KEY_LOGLEVEL: 61,KEY_LOGDATA: 62, KEY_TIME: 11 ,KEY_BROKER:12
};
export var msgExpressGateway = {KEY_TOKEN: 2,KEY_USERID: 3};
export var gatewayTopic = {1048577: "GATEWAY_TOPIC_OFFLINE", 1048579: "GATEWAY_TOPIC_LOGOUT", 1048580: "GATEWAY_TOPIC_LOGIN"};

//各个应用的command配置
export var COMMAND_MONITOR_LOGIN = (500 << 20) | 4;
export var COMMAND_ACCOUNT_LOGIN = (5 << 20) | 8;
export var COMMAND_GATEWAY_LOGIN = (1 << 20) | 1;
export var COMMAND_SUBSCRIBE = (500 << 20) | 5;
export var COMMAND_APPINFO = (0 << 20) | 16;
export var COMMAND_MONITOR_HISTORY = (68 << 20) | 2;
export var COMMAND_USER_ONLINE_OFFLINE = (68 << 20) | 1;
export var COMMAND_SERVER_ONLINE_OFFLINE = (68 << 20) | 3;
export var COMMAND_SEARCH_COMPANY = (65 << 20) | 2;
export var COMMAND_SEARCH_USER = (65 << 20) | 1;
export var COMMAND_SEARCH_ROOM = (65 << 20) | 1;
export var COMMAND_GET_ALL_BIND_ROOM = (64 << 20) | 82;
export var COMMAND_ADD_BIND_ORG_GROUP = (64 << 20) | 83;
export var COMMAND_REQUEST_USER = (64 << 20) | 1;
export var COMMAND_REQUEST_ROOM = (64 << 20) | 22;
export var COMMAND_SET_GUIDE = (64 << 20) | 93;
export var COMMAND_GET_ALL_USERS = (64 << 20) | 87;
export var COMMAND_GET_ALL_COMPANYS = (64 << 20) | 17;
export var COMMAND_SET_BIND_QQ = (64 << 20) | 91;
export var COMMAND_GET_BIND_QQ = (64 << 20) | 92;
export var COMMAND_GET_ROOM_INFO = (64 << 20) | 88;

export var COMMAND_GET_PUB_ACCOUNT = (64 << 20) | 75;
export var COMMAND_ADD_PUB_ACCOUNT = (64 << 20) | 72;
export var COMMAND_UPDATE_PUB_ACCOUNT = (64 << 20) | 74;
export var COMMAND_DEL_PUB_ACCOUNT = (64 << 20) | 73;

export var COMMAND_GET_USER_INFO = (64 << 20) | 80;
export var COMMAND_GET_ORG_TYPE = (64 << 20) | 40;//ISReqOrgType
export var COMMAND_GET_PROVINCE_CITY = (64 << 20) | 48;//ISReqLocation

export var COMMAND_QM_NO_CHANGE = (64 << 20) | 104;//ISReqLocation

export var COMMAND_GET_PNPUB_ACCOUNT = (67 << 20) | 11;

export var COMMAND_ADD_MONITOR_ACCOUNT = (5 << 20) | 23;
export var COMMAND_GET_MONITOR_ACCOUNT = (5 << 20) | 28;

export var COMMAND_GET_ACCOUNT_RIGHT = (5 << 20) | 25;

export var COMMAND_ALTER_MONITOR_ACCOUNT = (5 << 20) | 24;

export var COMMAND_PNS_PRODUCTSKILL = (67 << 20) | 10;
export var COMMAND_FS_RESOURCE = (952 << 20) | 1;
export var COMMAND_FS_UPLOAD = (952 << 20) | 2;
export var COMMAND_SM_GET_ONLINE_USERINFO = (11 << 20) | 75;
export var COMMAND_SM_GET_LOGIN_STATISTICS = (68 << 20) | 12;
export var COMMAND_IS_SET_QQ_NICKNAME = (64 << 20) | 95;

export var COMMAND_GET_GLOBAL_VAR = (64 << 20) | 98;
export var COMMAND_UPDATE_GLOBAL_VAR = (64 << 20) | 97;
export var COMMAND_GET_GLOBAL_VAR_EX = (64 << 20) | 96;

export var COMMAND_GET_MOBILE_UPDATE_INFO = (3 << 20) | 5;
export var COMMAND_SET_MOBILE_UPDATE_INFO = (3 << 20) | 10;
export var COMMAND_GET_ALL_MOBILE_UPDATE_INFO = (3 << 20) | 11;

export var COMMAND_GATEWAY_HISTORY = (68 << 20) | 4;

export var COMMAND_MSG_STATISTICS = (69 << 20) | 1;
export var COMMAND_MSG_LOG_STATISTICS = (69 << 20) | 2;

export var COMMAND_GET_MONITORSTATUS = (70 << 20) | 1;
export var COMMAND_SET_MONITORSTATUS = (70 << 20) | 2;

export var COMMAND_GATEWAY_LIST = (68 << 20) | 5;
export var COMMAND_SERVICE_DETAILS = (68 << 20) | 6;
export var COMMAND_SERVICE_RESTART = (68 << 20) | 7;
export var COMMAND_GET_GATEWAY = (68 << 20) | 9;
export var COMMAND_GATEWAY_RESTART = (68 << 20) | 8;

export var COMMAND_GET_USERINFO_CHANGE = (68 << 20) | 10;
export var COMMAND_AUDIT_USERINFO_CHANGE = (68 << 20) | 11;

export var COMMAND_GET_QQ_DETAIL = (64 << 20) | 90;

export var COMMAND_DATABUS_HEART_BEAT = (0 << 20) | 5;

export var COMMAND_GET_ALL_RECOMMAND = (64 << 20) | 105;
export var COMMAND_UPDATE_RECOMMAND = (64 << 20) | 106;

export var COMMAND_GET_ROOM_AVATAR = (64 << 20) | 103;

export var COMMAND_REQUEST_COMPANY_INFO = (64 << 20) | 17;

export var COMMAND_GET_RESOURCE_LIST = (6 << 20) | 1;
export var COMMAND_SET_RESOURCE_LIST = (6 << 20) | 2;

export var COMMAND_SET_MASSGROUP_LIMIT = (64 << 20) | 126;
export var COMMAND_GET_AD_LIST = (64 << 20) | 128;
export var COMMAND_DEL_AD = (64 << 20) | 129;
export var COMMAND_SET_AD = (64 << 20) | 127;

/////////////////////////////////////////////////////
export var COMMAND_DATABUS_SUBSCRIBE = (0 << 20) | 14;
export var COMMAND_DATABUS_LOGININFO = (0 << 20) | 3;
export var COMMAND_GET_APP_INFO = (0 << 20) | 16;