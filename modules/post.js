var db = require('./db');

var db_username = process.env.BAE_ENV_AK;                 // 用户名
var db_password = process.env.BAE_ENV_SK;                 // 密码

function Post(username, post, time) {
	this.user = username;
	this.post = post;
	if (time) {
		this.time = time;
	} else {
		this.time = new Date();
	}
};
module.exports = Post;

Post.prototype.save = function save(callback) {
	// 存入 db 的文档
	var post = {
		user: this.user,
		post: this.post,
		time: this.time,
	};
	db.open(function(err, db) {
		db.authenticate(db_username,db_password, function(err, result) { 
		  if (err) {
			db.close();
			//res.end('Authenticate failed!');
			//return;  
			return callback(err);			
		  }
		  // 读取 posts 集合
		  db.collection('posts', function(err, collection) {
			if (err) {
				db.close();
				return callback(err);
			}
			// 为 user 属性添加索引
			collection.ensureIndex('user',{unique: false},{w:0});
			// 写入 post 文档
			collection.insert(post, {safe: true}, function(err, post) {
				db.close();
				callback(err, post);
			});
		});
	   });
	});
};


Post.get = function get(username, callback) {
	db.open(function(err, db) {
		db.authenticate(db_username, db_password, function(err, result) { 
		    if (err) {
		    	db.close();
			    //res.end('Authenticate failed!');
			    //return;  
			    return callback(err);			
		    }
			// 读取 posts 集合
			db.collection('posts', function(err, collection) {
				if (err) {
					db.close();
					return callback(err);
				}
				// 查找 user 属性为 username 的文档，如果 username 是 null 则匹配全部
				var query = {};
				if (username) {
					query.user = username;
				}
				collection.find(query).sort({time: -1}).toArray(function(err, docs) {
					db.close();
					if (err) {
						callback(err, null);
					}
					// 封装 posts 为 Post 对象
					var posts = [];
					docs.forEach(function(doc, index) {
						var post = new Post(doc.user, doc.post, doc.time);
						posts.push(post);
					});
					
					callback(null, posts);
				});
			});
		});
	});
};


