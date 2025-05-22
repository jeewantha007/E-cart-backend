const mysql = require('mysql2')

let connection;

function getConnection(){
  if (!connection){
      connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'jeewa007',
        database: 'e_cart',
    
      })
  }
  return connection;
}

module.exports = getConnection();