create database bagyo;use bagyo;
create table panel_access(akun varchar(20)primary key,pass varchar(20)not null,islogin boolean not null,nama varchar(40)not null,
role varchar(5)not null check(role='admin'or role='cs'));
create table kat(nama varchar(20)primary key,hrg bigint not null,ket text not null);
create table kuli(email varchar(30)primary key,nama varchar(40)not null,nik varchar(20)not null,no_pe varchar(15)not null,
foto text not null,alamat text not null,konfirm boolean,ket text not null,skill varchar(20)not null);
alter table kuli add foreign key(skill)references kat(nama)on update cascade on delete cascade;
create table job(kode varchar(33)primary key,nama varchar(40)not null,nik varchar(20)not null,alamat text not null,konfirm boolean,
no_pe varchar(15)not null,keb varchar(20)not null,konfirmasi boolean,tgl date not null);
alter table job add foreign key(keb)references kat(nama)on update cascade on delete cascade;
create table kontrak(job varchar(33)not null,kuli varchar(30)not null,sedia boolean);
alter table kontrak add foreign key(job)references job(kode)on update cascade on delete cascade;
alter table kontrak add foreign key(kuli)references kuli(email)on update cascade on delete cascade;
insert into kat values('bangunan',100000,'per hari'),('listrik',50000,'per alat yang diperbaiki'),('kayu',200000,'per hari'),
('dekorasi',30000,'per meter persegi'),('pengairan',500000,'per instalasi');
