var db = require('./db');

var db_username = process.env.BAE_ENV_AK;                 // 用户名
var db_password = process.env.BAE_ENV_SK;                 // 密码

function User(user) {
    this.name = user.name;
	this.password = user.password;
};
module.exports = User;
//对象实例的方法，用于将用户对象的数据保存到数据库中
User.prototype.save = function save(callback) {
// 存入 db 的文档
    var user = {
        name: this.name,
        password: this.password,
    };	
    db.open(function(err, db) {
        db.authenticate(db_username, db_password, function(err, result) { 
		    if (err) {
			    db.close();
			    //res.end('Authenticate failed!');
			    //return;  
			    return callback(err);			
		    }
			// 读取 users 集合
			db.collection('users', function(err, collection) {
				if (err) {
					db.close();
					return callback(err);
				}
				// 为 name 属性添加索引
				collection.ensureIndex('name', {unique: true},{w:0});				
				// 写入 user 文档
				collection.insert(user, {safe: true}, function(err, user) {
					db.close();
				    callback(err, user);
				});
			});
		});	
	});
};
//是对象构造函数的方法，用于从数据库中查找指定的用户。
User.get = function get(username, callback) {
    db.open(function(err, db) {
        db.authenticate(db_username, db_password, function(err, result) { 
		    if (err) {
			    db.close();
			    //res.end('Authenticate failed!');
			    //return;  
			    return callback(err);			
		    }
			// 读取 users 集合
			db.collection('users', function(err, collection) {
				if (err) {
					db.close();
					return callback(err);
					//return callback('read error');
				}
				 // 查找 name 属性为 username 的文档
				collection.findOne({name: username}, function(err, doc) {
					db.close();
					if (doc) {
						// 封装文档为 User 对象
						var user = new User(doc);
						callback(err, user);
					} else {
						  callback(err, null);
					}
				});
			});
		});
    });
};