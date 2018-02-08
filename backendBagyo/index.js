const express = require('express')
const app = express()
const mailer = require('express-mailer')
const mysql = require('mysql')
const formatMysql={host:'localhost',password:'',user:'root',database:'bagyo'}

mailer.extend(app,{
  from:'emaile bagyo',
  host: 'smtp.gmail.com',
  secureConnection: true,
  port: 465,
  transportMethod: 'SMTP',
  auth:{
    user:'emaile bagyo',
    pass:'pasworde'
  }
})

app.get('/',(req,res)=>{
  res.send('Hallo')
}).get('/daftarKat',(req,res)=>{
  var c=mysql.createConnection(formatMysql)
  c.query('select*from kat',(error,results,rows)=>{  //result adalah hasil
    res.send(JSON.stringify({rusak:error,hasil:results,baris:rows}))
  })
  c.end()
}).post('/login',(req,res)=>{
  var c=mysql.createConnection(formatMysql)
  c.query('select islogin,pass from panel_access where akun=?',[req.params.akun],(e,r,f)=>{
    if(r){
      if(r.pass===req.params.pass&&!r.islogin)c.query('update panel_access set islogin=? where akun=?',[true,req.params.akun],(e1,r1,f1)=>{
        if(!e1)res.send(JSON.stringify({kode:0,pesan:'berhasil'}))
      })
      else res.send(JSON.stringify({kode:2,pesan:'login tidak valid'}))
    }else res.send(JSON.stringify({kode:1,pesan:'akun apa ini?'}))
  })
  c.end()
}).get('/kuli/:kat',(req,res)=>{
  var c=mysql.createConnection(formatMysql)
  c.query('select*from kuli where konfirm and skill=?',[req.params.kat],(e,r,f)=>{
    if(!e)res.send(JSON.stringify({rusak:e,hasil:r,baris:f}))
  })
  c.end()
}).get('/kerja/:kuli',(req,res)=>{
  var c=mysql.createConnection(formatMysql)
  c.query('select*from job where kode in(select job from kontrak where sedia and kuli=?)order by tgl desc',[req.params.kuli],(e1,r1,f1)=>{
    if(!e1)res.send(JSON.stringify({rusak:e1,hasil:r1,baris:f1}))
    else res.send(JSON.stringify({rusak:e1}))
  })
  c.end()
}).post('/jobBaru',(req,res)=>{})

app.listen(2103)
