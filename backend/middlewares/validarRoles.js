export const esAdmin = (req, res, next) => {
    if (!req.usuario) {
        return res.status(401).json({ msg: 'No hay usuario autenticado' })
    }

    if(req.usuario.rol !== 'admin') {
        return res.status(401).json({ msg: 'Acceso solo para administradores.' })
    }
    
    console.log('Accediendo como administrador...')
    next()
}

export const esUsuario = (req, res, next) => {
    if (!req.usuario) {
        return res.status(401).json({ msg: 'No hay usuario autenticado' })
    }

    if(req.usuario.rol !== 'usuario') {
        return res.status(401).json({ msg: 'Acceso solo para usuarios.' })
    }

    console.log('Accediendo como usuario...')
    next()
}