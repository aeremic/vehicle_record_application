const { response } = require('express')
const express = require('express')
const app = new express()
const sqlite3 = require('sqlite3')
const session = require('express-session')
const bodyParser = require('body-parser')
const path = require('path')
const db = new sqlite3.Database(__dirname + '/cars.db')

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())

app.use(express.urlencoded({extended:true}))
app.use(express.static(__dirname + '/public'))

app.get('/', function(req, res){
    res.sendFile(__dirname + '/public/login_page.html')
})

app.post('/auth', function(req, res){
    var username = req.body.username
    var password = req.body.password
    if(username && password){
        db.get("select * from users where username = ? and password = ?;", [username, password], function(err, row){
            if(err){
                res.send(err.message)
                res.end()
            } else if(row){
                req.session.loggedin = true
                req.session.username = username
                res.redirect('/home.html')
                res.end()
            } else {
                req.session.loggedin = false
                res.redirect('/home.html')
                res.end()
            }
        })
    } else {
        req.session.loggedin = false
        res.redirect('/home.html')
        res.end()
    }
})

app.post('/logout', function(req, res){
    req.session.loggedin = false
    req.session.username = ''
    res.redirect('/home.html')
    res.end()
})

app.get('/login', function(req, res){
    if(req.session.loggedin)
        res.send('succ ' + req.session.username)
    else 
        res.send('err ' + req.session.username)

    res.end()
})

app.get('/data_cars', function(req, res){
    db.all('select c.idCar as idCar, c.manufacturerName as manufacturerName, c.modelName as modelName, d.firstName as firstName, d.lastName as lastName, c.regNo as regNo from cars c join drivers d on c.idDriver = d.idDriver;', function(err, rows){
        var result = JSON.stringify(rows)        
        res.send(result)
    })
})

app.get('/data_drivers', function(req, res){
    db.all('select * from drivers', function(err, rows){
        var result = JSON.stringify(rows)        
        res.send(result)
    })
})

app.post('/data_driver', function(req, res){
    db.get('select d.firstName, d.lastName from cars c join drivers d on c.idDriver = d.idDriver where c.idCar = ? group by d.idDriver;', [req.body.car_id], function(err, row){
        if(err)
            res.send('driver select err')
        else
            res.send(JSON.stringify(row))
    })
})

app.post('/insert_car', function(req, res){
    db.run("insert into cars(idDriver, manufacturerName, modelName, regNo) values(?, ?, ?, ?);", [req.body.driver_id, req.body.manufacturer_name, req.body.model_name, req.body.reg_no], function(err){
        if(err)
            res.end('car insert err')
        else
            res.end('car insert succ')
    })
})

app.post('/change_car', function(req, res){
    if([req.body.manufacturer_name] != '' && [req.body.model_name] != '' && [req.body.reg_no] != ''){      
        db.run("update cars set manuFacturerName = ?, modelName = ?, regNo = ? where idCar = ?;", [req.body.manufacturer_name, req.body.model_name, req.body.reg_no, req.body.car_id], function(err){
            if(err)
                res.end('car update err')
            else
                res.end('car update succ')
        })
    } else if([req.body.manufacturer_name] != '' && [req.body.model_name] != ''){
        db.run("update cars set manuFacturerName = ?, modelName = ? where idCar = ?;", [req.body.manufacturer_name, req.body.model_name, req.body.car_id], function(err){
            if(err)
                res.end('car update err')
            else
                res.end('car update succ')
        })
    } else if([req.body.manufacturer_name] != '' && [req.body.reg_no] != ''){      
        db.run("update cars set manuFacturerName = ?, regNo = ? where idCar = ?;", [req.body.manufacturer_name, req.body.reg_no, req.body.car_id], function(err){
            if(err)
                res.end('car update err')
            else
                res.end('car update succ')
        })

    } else if([req.body.model_name] != '' && [req.body.reg_no] != ''){
        db.run("update cars set modelName = ?, regNo = ? where idCar = ?;", [req.body.model_name, req.body.reg_no, req.body.car_id], function(err){
            if(err)
                res.end('car update err')
            else
                res.end('car update succ')
        })
    } else if([req.body.manufacturer_name] != ''){
        db.run("update cars set manuFacturerName = ? where idCar = ?;", [req.body.manufacturer_name, req.body.car_id], function(err){
            if(err)
                res.end('car update err')
            else
                res.end('car update succ')
        })
    } else if([req.body.model_name] != ''){
        db.run("update cars set modelName = ? where idCar = ?;", [req.body.model_name, req.body.car_id], function(err){
            if(err)
                res.end('car update err')
            else
                res.end('car update succ')
        })
    } else if([req.body.reg_no] != ''){
        db.run("update cars set regNo = ? where idCar = ?;", [req.body.reg_no, req.body.car_id], function(err){
            if(err)
                res.end('car update err')
            else
                res.end('car update succ')
        })
    } else {
        res.send('param err')
        res.end()
    }
})

app.post('/delete_car', function(req, res){
    db.run('delete from cars where idCar = ?', [req.body.car_id], function(err){
        if(err)
            res.end('car delete err')
        else
            res.end('car delete succ')
    })
})

server = app.listen(5500, function(){
    var host = server.address().address
    var port = server.address().port
    console.log('Listening: http://%s:%s', host, port)
})