const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
let user = require('./models/user');

const app = express();

app.use(express.json());

app.listen(process.env.PORT || 4000, function() {
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});


mongoose.connect("mongodb+srv://sitcomTechnology:Sitcomtech1234@cluster0.wabsa.mongodb.net/socialmedia?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
    .then(() => {
        console.log('connected')
    })
    .catch((err) => {
        console.log(' not connected to mongodb', err)
    })

//register api


app.post('/api/register', function(req, res) {
    var data = new user();
    data.name = req.body.name;
    data.mobile = req.body.mobile;
    data.email = req.body.email;
    data.userId = req.body.userId;
    data.password = req.body.password;
    data.confirm_password = req.body.confirm_password;

    if (req.body.password == req.body.confirm_password) {
        data.save(function(err, data) {
            if (err) {
                if (err.code == 11000) {
                    res.json({ 'err': 11000, 'msg': 'Email already exists' })
                } else {
                    res.json({ 'err': 1, 'msg': 'Not insert successfully', 'err': err })
                }
            } else if (data) {
                res.json({ 'err': 0, 'msg': 'Insert Successfully', 'data': data })
            }
        })
    } else {
        res.json({ 'msg': 'Password not match.' })
    }
})

//login api

app.post('/api/login', function(req, res) {

    let email = req.body.email;
    let pass = req.body.password;
    user.find({ 'email': email, 'password': pass }, function(err, data) {
        if (err) {
            res.json({ 'err': 1, 'msg': 'Some error occour' })
        } else if (data.length == 0) {
            res.json({ 'err': 1, 'msg': 'Email or pass is not correct' })
        } else {
            res.json({ 'err': 0, 'msg': 'Login successfully', 'id': data[0].id, 'name': data[0].name, 'mobile': data[0].mobile, 'email': data[0].email, 'userId': data[0].userId })
        }
    })

})