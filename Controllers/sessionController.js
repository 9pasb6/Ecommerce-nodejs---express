import User from "../Models/User.js"
import mongoose from 'mongoose'



const sessionWelcome = async (req, res) =>{

// welcome?name=pablo, se utiliza el metodo query para acceder a ese tipo params
const name = req.session.user

const counter = req.session?.counter

    if(!counter){
    req.session.counter=1
    req.session.user=name
    req.session.admin = true
    return res.json({msg: `Welcome for the firts time ${name}`})
    }

    try {

    req.session.counter++
    req.session.user=name
    req.session.admin = true
    return res.json({msg: `Dear ${name}, Visit number ${req.session.counter}`})


    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Error en el servidor' });

    }

}



const logIn = async (req, res) =>{

    const {email, password} = req.body


    const user = await User.findOne({email})
    console.log(user)

    if(!user){
        return res.json({msg: `User doesnt exist `})
    }

    if(password !== user.password){
        return res.json({msg: `Incorrect password`})
    }


    try {

        
    if (user.email === process.env.EMAIL_ADMIN && user.password === process.env.PASSWORD_ADMIN) {
        
        user.role = 'Admin'
        await user.save()

    }

        
         req.session.user = user
         req.session.admin = true
         console.log(`Login succes `)
         return res.redirect('/api/products')


    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Error en el servidor' });

    }
    

}


const logOut = async (req, res) =>{

    const {first_name} = req.session.user
    console.log(`Good Bye ${first_name}`)

    req.session.destroy ( error => {
        if(!error){
            console.log(`Log Out successfully`)
            return res.redirect('/api/view/login')
        }
    
        return res.json({msg: `Log Out troubles`})

    })

}

const register = async (req,res) =>{

//const {first_name, last_name, email, age, password} = req.body

const newUser = new User(req.body)

try {
    console.log('register user')
    await newUser.save();
   
    console.log('User created')

   
    return res.redirect('/api/view/login')
  
   // return res.json({ msg: 'User created'})

    
} catch  {
    res.status(404).json({ error: 'Error to create user' });
  }


}






//vistas del usuario handlebars


const loginView = (req, res) =>{

    res.render("login");

}


const registerView = async (req, res) =>{
    res.render('register')
}

const profileView = async (req, res) =>{
   
    // usuario logueado en la session, obtener la instancia del user
    const user = req.session.user

    res.render('profile',{
        user,
    })
    
}

export {
   
    sessionWelcome,
    logIn,
    logOut,
    register, 
    loginView,
    registerView,
    profileView
}