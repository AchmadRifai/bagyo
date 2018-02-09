const express = require('express')
const app = express()
const mailer = require('express-mailer')
const mysql = require('mysql')
const formatMysql={host:'localhost',password:'',user:'root',database:'bagyo'}
const md5 = require('md5')

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
}).get('/karya/:kuli',(req,res)=>{
  var c=mysql.createConnection(formatMysql)
  c.query('select*from job where kode in(select job from kontrak where sedia and kuli=?)order by tgl desc',[req.params.kuli],(e1,r1,f1)=>{
    if(!e1)res.send(JSON.stringify({rusak:e1,hasil:r1,baris:f1}))
    else res.send(JSON.stringify({rusak:e1}))
  })
  c.end()
}).post('/jobBaru',(req,res)=>{
  var c=mysql.createConnection(formatMysql)
  if(req.params.nama&&req.params.nik&&req.params.alamat&&req.params.no_pe&&req.params.keb&&req.params.tgl&&req.params.email){
    var kode=req.params.nik+req.params.tgl
    c.query('insert into job values(?,?,?,?,?,?,?,?,?,?)', [kode, req.params.nama, req.params.nik, req.params.alamat, false, req.params.no_pe, req.params.keb, false, req.params.tgl, req.params.email], (e,r,f)=>{
      if(!e){
        var a=cok(kode)
        app.mailer.send({template:'email'}, {to:req.params.email, subject:'Validasi Email', user:{message:"<a href='http://localhost:8000/validasiJob/"+a+"'>Validasi</a>", name:'Sistem Bagyo'}}, (e)=>{
          if(e)console.log(e)
        })
      }else res.send(JSON.stringify({rusak:e}))
    })
  }else res.send(JSON.stringify({rusak:'isi semua'}))
  c.end()
}).get('/validJob/:md5',(req,res)=>{
  fs.readFile(req.params.md5,(e,data)=>{
    if(!e){
      var c = mysql.createConnection(formatMysql)
      c.query('update job set konfirm=? where kode=?', [true, data], (e,r,f)=>{
        if(!e)c.query('select*from kuli where skill=(select keb from job where kode=?)', [data], (e,r,f)=>res.send(JSON.stringify({rusak:e,hasil:r,baris:f})))
        else res.send(JSON.stringify({rusak:e}))
      })
      c.end()
    }else res.send(JSON.stringify({rusak:e}))
  })
}).post('/addKuli',(req,res)=>{
  if(req.params.job&&req.params.kuli){
    var c = mysql.createConnection(formatMysql)
    c.query('insert into kontrak values(?,?,?)', [req.params.job, req.params.kuli, false], (e,r,f)=>res.send(JSON.stringify({rusak:e,hasil:r,baris:f})))
    c.end()
  }else res.send(JSON.stringify({rusak:'harus diisi'}))
}).get('/ikut/:job', (req,res)=>{
  var c = mysql.createConnection(formatMysql)
  c.query('select*from terkontrak where job=?', [req.params.job], (e, r, f) => res.send(JSON.stringify({rusak:e,hasil:r,baris:f})))
  c.end()
}).post('/siapSedia', (req, res) => {
  if(req.params.job&&req.params.kuli){
    var c = mysql.createConnection(formatMysql)
    c.query('update kontrak set sedia=? where job=? and kuli=?', [true, req.params.job, req.params.kuli], (e,r,f)=>{
      if(!e)c.query('select distinct sedia from kontrak where job=?', [req.params.job], (e,r,f)=>{
        if(!e&&r.length===1)c.query('update job set konfirmasi=? where kode=?', [r[0].sedia, req.params.job], (e,r,f)=>res.send(JSON.stringify({rusak:e, hasil:r, baris:f})))
        else res.send(JSON.stringify({rusak:e}))
      })
      else res.send(JSON.stringify({rusak:e}))
    })
    c.end()
  }else res.send(JSON.stringify({rusak:'isilah datanya'}))
})

app.listen(2103)
