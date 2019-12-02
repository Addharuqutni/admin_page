router.get('/email-adress', function (req, res) {
    res.render('email-adress', { success: req.session.success, errors: req.session.errors })
    req.session.errors = null
  })
  
  router.post('/finished', function (req, res) {
    let email = req.body.email
  
    req.checkBody('email', 'Email required').isEmail()
  
    var errors = req.validationErrors()
    if (errors) {
      req.session.errors = errors
      req.session.success = false
      res.redirect('/email-adress')
    } else {
      req.session.success = true
      res.redirect('/finished')
    }
  })