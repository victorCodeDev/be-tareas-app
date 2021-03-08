const { Router} = require('express');
const router = Router();

const User = require('../models/User');

const jwt = require('jsonwebtoken');

router.post('/signup', async (req, res) =>{
    
    const {email, password} = req.body;
    const newUser = new User({email, password});
    await newUser.save();

    const token = jwt.sign({id:newUser.id}, 'secretkey');

    res.status(200).json({token});
    

})


router.post('/signin', async (req, res) =>{
    
    const {email, password} = req.body;
    const user = await User.findOne({email})

   if (!user) return res.status(401).send("El email no existe");
   if (user.password !== password) return res.status(401).send("Contraseña incorrecta");
   
   const token = jwt.sign({id:user.id}, "secretkey");

   res.status(200).json({token});
    

})

router.get('/tasks', (req, res) => {
    res.json([
       {
        id: 1,
        name: 'TAREA 1',
        description: 'DESCRIPCION PARA TAREA 1',
        date: "2020-03-13T15:54:51.451Z"
       },
       {
        id: 2,
        name: 'TAREA 2',
        description: 'DESCRIPCION PARA TAREA 2',
        date: "2020-03-13T15:54:51.451Z"
       },
       {
        id: 3,
        name: 'TAREA 3',
        description: 'DESCRIPCION PARA TAREA 3',
        date: "2020-03-13T15:54:51.451Z"
       }
        
    ])
})


router.get('/private-tasks', verifyToken, (req, res) => {
    res.json([
       {
        id: 1,
        name: 'TAREA PRIVADA 1',
        description: 'DESCRIPCION PARA TAREA PRIVADA 1',
        date: "2020-03-13T15:54:51.451Z"
       },
       {
        id: 2,
        name: 'TAREA PRIVADA 2',
        description: 'DESCRIPCION PARA TAREA PRIVADA 2',
        date: "2020-03-13T15:54:51.451Z"
       },
       {
        id: 3,
        name: 'TAREA PRIVADA 3',
        description: 'DESCRIPCION PARA TAREA PRIVADA 3',
        date: "2020-03-13T15:54:51.451Z"
       }
        
    ])
})

function verifyToken(req, res, next){
    if (!req.headers.authorization){
        res.status(401).send("Sin autorizacion");
    }

    const token = req.headers.authorization.split(' ')[1];

    if (token === 'null'){
        return res.status(401).send("Sin autorizacion");
    }

    const payload = jwt.verify(token, 'secretkey');
    req.userId = payload.id;
    next();



}

module.exports = router;