import  jwt  from "jsonwebtoken";
import User from "../Models/User.js";

const checkAuth = async (req, res, next) =>{
    let token;
//sirve para checkear si un usuario esta autenticado, si es correcto, entonces siga con el siguiente middleware
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){

     
        

        try {
            token = req.headers.authorization.split(" ")[1];
            //el usuario debe estar autenticado, confirm:true token:yes
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            // sesion del usuario
            req.user = await User.findById(decoded.id).select("-password -confirm -token -createdAt -updatedAt")
            //console.log(req.user)
            return next();
          

        } catch (error) {
            //hay un problema con el token enviado, podria no coincidir con el actual o que el usuario no esta autenticado
            return res.status(404).json({msg: 'hubo un error'})
        } 

    }


    if(!token){
        // si se hace la petición sin token entonces saldrá el siguiente problema
        const error = new Error ('Usuario no tiene token')
        return res.status(401).json({msg: error.message})
    }

   

    next();

}

export default checkAuth;