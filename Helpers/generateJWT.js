import  Jwt  from "jsonwebtoken";


const generateJwt = (id) => {

    return Jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: "30d"})

}

export default generateJwt;