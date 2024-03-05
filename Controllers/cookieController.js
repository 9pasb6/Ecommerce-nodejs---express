



const createCookie = async (req, res) => {
    
    const body = req.body
    console.log('Form data:', body);
    
    return await res.cookie('cookieUser', {email: `${body.email}` }, {maxAge: 20000, signed:true}).send()
}


const getCookie = async (req, res) => {

    console.log('Info cookies', req.cookies, req.signedCookies)
    return await res.json({ cookie: req.signedCookies})


}


const deleteCookie = (req,res) =>{

    return res.clearCookie('cookieUser').json({msg: "Cookie Removed"})


}

const cookieView = (req, res) =>{

    const cookie = req.cookie;

    res.render("cookie", {cookie});

}






export {
    getCookie,
    createCookie,
    deleteCookie,
    cookieView
}