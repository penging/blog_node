var Db = require('mongodb').Db;
var Server = require('mongodb').Server;

var db_name = 'ayJUdLvsPlBvAdqKRklB';                  // 数据库名，从云平台获取
var db_host =  process.env.BAE_ENV_ADDR_MONGO_IP;      // 数据库地址
var db_port =  +process.env.BAE_ENV_ADDR_MONGO_PORT;   // 数据库端口
//var ak_username = process.env.BAE_ENV_AK;                 // 用户名
//var sk_password = process.env.BAE_ENV_SK;                 // 密码

module.exports = new Db(
                         db_name,
						 new Server( 
						      db_host, 
							  db_port, 
							  {}
						    ),
						{w: 1}
				);
			