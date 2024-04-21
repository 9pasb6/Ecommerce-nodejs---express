// middlewares/authorize.js
function authorize(...allowedRoles) {
    return (req, res, next) => {
      if (req.user && allowedRoles.includes(req.user.role)) {
        next(); // El rol es permitido, por lo tanto continúa con la siguiente función en la ruta
      } else {
        res.status(403).json({ msg: 'Acceso denegado, no tienes permisos suficientes' });
      }
    };
  }
  
  export default authorize;
  