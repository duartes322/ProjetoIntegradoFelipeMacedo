const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./models/User');
const Post = require('./models/Post');
const Carteirinha = require('./models/Carteirinha');
const bcrypt = require('bcryptjs');
const app = express();
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const uploadMiddleware = multer({ dest: 'uploads/' });
const fs = require('fs');

const salt = bcrypt.genSaltSync(10);
const secret = 'asdfe45we45w345wegw345werjktjwertkj';

app.use(cors({credentials: true,origin:'http://localhost:3000'}));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname + '/uploads'));

mongoose.connect('mongodb+srv://projetoaplicado:<password>@cluster0.pt4f9fu.mongodb.net/?retryWrites=true&w=majority');

app.post('/register', async (req,res) => {
    const{username, password, email, firstname, lastname, birthday, cep, number, complement} = req.body;
    try{    
        const userDoc = await User.create({
        username,
        password:bcrypt.hashSync(password, salt),
        email,
        firstname,
        lastname,
        birthday,
        cep,
        number,
        complement,
        });
        res.json(userDoc);
    } catch(e){
        console.log(e);
        res.status(400).json(e);
    }
});

app.post('/cardregister', async (req,res) => {
  const ownerTemp = new mongoose.Types.ObjectId(req.body);
  const userDoc = await User.findById(ownerTemp);
  const owner = userDoc._id;
  const cardstatus = 'Não solicitada';
  try{
    const cardDoc = await Carteirinha.create({ cardstatus , owner });
    res.json(cardDoc);
  } catch(e){
    console.log(e);
    res.status(400).json(e);
  }
  
});

app.post('/login', async (req,res) => {
    const {username,password} = req.body;
    const userDoc = await User.findOne({username});
    const passOk = bcrypt.compareSync(password, userDoc.password);
    if (passOk) {
        // logged in
        jwt.sign({username, id:userDoc._id, isAdmin: userDoc.isAdmin}, secret, {}, (err,token) => {
            if(err) throw err;
            res.cookie('token', token).json({
                id:userDoc._id,
                username,
                isAdmin: userDoc.isAdmin,
            });
        });
    } else {
        res.status(400).json('Usuario ou senha incorretos');
    }
});

app.get('/profile', (req, res) => {
    const {token} = req.cookies;
    jwt.verify(token, secret, {}, (err,info) => {
        if (err) throw err;
        res.json(info);
    });
});

app.post('/logout', (req,res) => {
    res.cookie('token', '').json('ok');
});

app.post('/post', uploadMiddleware.single('file'), async (req, res) => {
    const {originalname, path} = req.file;
    const parts = originalname.split('.');
    const ext = parts[parts.length - 1];
    const newPath = path+'.'+ext;
    fs.renameSync(path, newPath);

    const {token} = req.cookies;
    jwt.verify(token, secret, {}, async (err,info) => {
        if (err) throw err;
        const {title,summary,content} = req.body;
        const postDoc = await Post.create({
            title,
            summary,
            content,
            cover:newPath,
            author:info.id,
        });
        res.json(postDoc);
    });
});



app.get('/post', async (req,res) => {
    res.json(
        await Post.find()
        .populate('author', ['username'])
        .sort({createdAt: -1})
        .limit(20)
    );
});

app.get('/post/:id', async (req,res) => {
    const {id} = req.params;
    const postDoc = await Post.findById(id).populate('author', ['username']);
    res.json(postDoc);
});

app.put('/post', uploadMiddleware.single('file'), async (req,res) => {
    let newPath = null;
    if (req.file) {
        const {originalname, path} = req.file;
        const parts = originalname.split('.');
        const ext = parts[parts.length - 1];
        const newPath = path+'.'+ext;
        fs.renameSync(path, newPath);
    }

    const {token} = req.cookies;
    jwt.verify(token, secret, {}, async (err,info) => {
        if (err) throw err;
        const {id, title,summary,content} = req.body;
        const postDoc = await Post.findById(id);
        const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
        if (!isAuthor){
            return res.status(400).json('voce nao e o autor');
        }
        await postDoc.updateOne({
            title, 
            summary, 
            content,
            cover: newPath ? newPath : postDoc.cover,
        });
        res.json(postDoc);
    });

});

app.get('/cards', async (req,res) => {
    res.json(
        await Carteirinha.find()
        .populate('owner', ['username'])
        .sort({createdAt: -1})
        .limit(20)
    );
});

  app.put('/cards/:id', async (req, res) => {
    const { id } = req.params;
    const { cardstatus } = req.body;
  
    try {
      const carteirinha = await Carteirinha.findByIdAndUpdate(id, { cardstatus }, { new: true });
      res.json(carteirinha);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro ao atualizar o status da carteirinha.' });
    }
  });



app.listen(4000);
