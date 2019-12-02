var express = require('express');
var router = express.Router();
var authentication_mdl = require('../middlewares/authentication');

/* GET Customer page. */

router.get('/',authentication_mdl.is_login, function(req, res, next) {
	req.getConnection(function(err,connection){
		var query = connection.query('SELECT * FROM produk',function(err,rows)
		{
			if(err)
				var errornya  = ("Error Selecting : %s ",err );   
			req.flash('msg_error', errornya);   
			res.render('produk/list',{title:"Produk",data:rows});
		});
         //console.log(query.sql);
     });
});

router.delete('/delete/(:id)',authentication_mdl.is_login, function(req, res, next) {
	req.getConnection(function(err,connection){
		var produk = {
			id: req.params.id,
		}
		
		var delete_sql = 'delete from produk where ?';
		req.getConnection(function(err,connection){
			var query = connection.query(delete_sql, produk, function(err, result){
				if(err)
				{
					var errors_detail  = ("Error Delete : %s ",err);
					req.flash('msg_error', errors_detail); 
					res.redirect('/produk');
				}
				else{
					req.flash('msg_info', 'Delete Produk Success'); 
					res.redirect('/produk');
				}
			});
		});
	});
});
router.get('/edit/(:id)',authentication_mdl.is_login, function(req,res,next){
	req.getConnection(function(err,connection){
		var query = connection.query('SELECT * FROM produk where id='+req.params.id,function(err,rows)
		{
			if(err)
			{
				var errornya  = ("Error Selecting : %s ",err );  
				req.flash('msg_error', errors_detail); 
				res.redirect('/produk'); 
			}else
			{
				if(rows.length <=0)
				{
					req.flash('msg_error', "Produk can't be find!"); 
					res.redirect('/produk');
				}
				else
				{	
					console.log(rows);
					res.render('produk/edit',{title:"Edit ",data:rows[0]});

				}
			}

		});
	});
});
router.put('/edit/(:id)',authentication_mdl.is_login, function(req,res,next){
	req.assert('nama', 'Please fill the Nama').notEmpty();
	var errors = req.validationErrors();
	if (!errors) {
		v_nama = req.sanitize( 'nama' ).escape().trim(); 
		v_merk = req.sanitize( 'merk' ).escape().trim();
		v_satuan = req.sanitize( 'satuan' ).escape().trim();
        v_jumlah= req.sanitize( 'jumlah' ).escape().trim();
		v_harga = req.sanitize( 'harga' ).escape().trim();
	

		var produk = {
			nama : v_nama,
			merk : v_merk,
            satuan : v_satuan,
            jumlah : v_jumlah,
			harga : v_harga
		}

		var update_sql = 'update produk SET ? where id = '+req.params.id;
		req.getConnection(function(err,connection){
			var query = connection.query(update_sql, produk, function(err, result){
				if(err)
				{
					var errors_detail  = ("Error Update : %s ",err );   
					req.flash('msg_error', errors_detail); 
					res.render('produk/edit', 
					{ 
						nama: req.param('nama'), 
						merk: req.param('merk'),
                        satuan: req.param('satuan'),
                        jumlah: req.param('jumlah'),
						harga: req.param('harga'),
					});
				}else{
					req.flash('msg_info', 'Update Produk Success'); 
					res.redirect('/produk/edit/'+req.params.id);
				}		
			});
		});
	}else{

		console.log(errors);
		errors_detail = "Sory there are error<ul>";
		for (i in errors) 
		{ 
			error = errors[i]; 
			errors_detail += '<li>'+error.msg+'</li>'; 
		} 
		errors_detail += "</ul>"; 
		req.flash('msg_error', errors_detail); 
		res.render('produk/add-produk', 
		{ 
			kode: req.param('kode'),
			nama: req.param('nama')
		});
	}
});

router.post('/add',authentication_mdl.is_login, function(req, res, next) {
	req.assert('kode', 'Please fill the kode').notEmpty();
	var errors = req.validationErrors();
	if (!errors) {

        v_kode = req.sanitize( 'kode' ).escape().trim();
		v_nama = req.sanitize( 'nama' ).escape().trim(); 
		v_merk = req.sanitize( 'merk' ).escape().trim();
        v_satuan = req.sanitize( 'satuan' ).escape().trim();
        v_jumlah = req.sanitize( 'jumlah' ).escape().trim();
		v_harga = req.sanitize( 'harga' ).escape().trim();

		var produk = {
            kode: v_kode,
			nama: v_nama,
			merk: v_merk,
			satuan: v_satuan,
            jumlah: v_jumlah,
            harga: v_harga
		}

		var insert_sql = 'INSERT INTO produk SET ?';
		req.getConnection(function(err,connection){
			var query = connection.query(insert_sql, produk, function(err, result){
				if(err)
				{
					var errors_detail  = ("Error Insert : %s ",err );   
					req.flash('msg_error', errors_detail); 
					res.render('produk/add-produk', 
					{ 
						kode: req.param('kode'), 
						name: req.param('nama'),
						merk: req.param('merk'),
						satuan: req.param('satuan'),
						jumlah: req.param('jumlah'),
						harga: req.param('harga'),
					});
				}else{
					req.flash('msg_info', 'Create Produk Success'); 
					res.redirect('/produk');
				}		
			});
		});
	}else{

		console.log(errors);
		errors_detail = "Sory there are error <ul>";
		for (i in errors) 
		{ 
			error = errors[i]; 
			errors_detail += '<li>'+error.msg+'</li>'; 
		} 
		errors_detail += "</ul>"; 
		req.flash('msg_error', errors_detail); 
		res.render('produk/add-produk', 
		{ 
			kode: req.param('kode'), 
			nama: req.param('nama')
		});
	}

});

router.get('/add',authentication_mdl.is_login, function(req, res, next) {
	res.render(	'produk/add-produk', 
	{ 
		title: 'Add New Produk',
		kode: '',
		nama: '',
		merk: '',
		satuan: '',
		jumlah:'',
		harga:''
	});
});

module.exports = router;