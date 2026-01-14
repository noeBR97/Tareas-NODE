export const esAdmin = (req, res, next) => {
    if (!req.usuario) {
        return res.status(401).json({ msg: 'No hay usuario autenticado' })
    }

    console.log('Accediendo como administrador...')
    next()
}

export const esUsuario = (req, res, next) => {
    if (!req.usuario) {
        return res.status(401).json({ msg: 'No hay usuario autenticado' })
    }

    console.log('Accediendo como usuario...')
    next()
}