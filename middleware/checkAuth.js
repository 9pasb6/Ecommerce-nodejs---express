function CheckAuth (req, res, next) {

    //si el suario existe o es admin req.session?.user ||  req.session.admin
    if(req.session?.user ||  req.session.admin){
        console.log('Authentication succes')
        return next()
        
    }

    return res.status(401).json({msg: 'Authentication error'})


}

export default CheckAuth