import jwt from 'jsonwebtoken';

export const validarJWT = (req , res , next) => {  //Estas asignaciones son necesarias para almacenar en el request los datos que extraigamos del token.
    const token = req.header('x-token')  //Este nombre será establecido en el cliente también.

    if (!token){
        return res.status(401).json({'msg':'No hay token en la petición.'})
    }

    try {
        const {id, rol} = jwt.verify(token, process.env.SECRETORPRIVATEKEY)
        req.usuario = {id, rol}
        next()
    }catch(error){
        console.log(error);
        res.status(401).json({'msg':'Token no válido.'})
    }
}