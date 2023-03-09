import mysql from 'mysql2';

/*create a connection with the database*/
const db = mysql.createConnection({
    host:'localhost',
    port:'3306',
    user:'root',
    password:'',
    database:'employeeTrack'
})

connection.connect(function(error){
    if(error) throw error;
    console.log("connected at " +connection.threadId+"\n");
    addQuiz()
})

module.exports = db;