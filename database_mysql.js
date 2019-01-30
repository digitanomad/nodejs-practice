var mysql = require('mysql');
var conn = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'password',
  database : 'o2'
});

 conn.connect();
// var sql = 'SELECT * FROM topic';
// conn.query(sql, function(err, rows, fields) {
//     if(err) {
//         console.log(err);
//     } else {
//         for (var i=0; i<rows.length; i++) {
//             console.log(rows[i].author);       
//         }
//     }
// });

// var sql = 'INSERT INTO TOPIC (TITLE, DESCRIPTION, AUTHOR) VALUES (?, ?, ?)';
// var params = ['Supervisor', 'Watcher', 'graphittie'];
// conn.query(sql, params, function(err, rows, fields) {
//     if (err) {
//         console.log(err);
//     } else {
//         console.log(rows);
//     }
// });

// var sql = 'UPDATE TOPIC SET TITLE=?, AUTHOR=? WHERE ID=?';
// var params = ['npm', 'leezche', '2'];
// conn.query(sql, params, function(err, rows, fields) {
//     if (err) {
//         console.log(err);
//     } else {
//         console.log(rows);
//     }
// });

var sql = 'DELETE FROM TOPIC WHERE ID=?';
var params = [1];
conn.query(sql, params, function(err, rows, fields) {
    if (err) {
        console.log(err);
    } else {
        console.log(rows);
    }
});
conn.end();