const jwt = require('jsonwebtoken');
const prisma = require("../prisma_init.js");
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');
const bcrypt = require('bcrypt');

const hashPassword = async(password) => {
    const saltRounds = 10; // Number of salt rounds, a cost factor to make the hashing process slower and more secure
  
    try {
      const hash = await bcrypt.hash(password, saltRounds);
      return hash;
    } catch (error) {
      throw error;
    }
}

const verify_password = async (password, password_hash) => {
    try {
      const match = await bcrypt.compare(password, password_hash);
      return match;
    } catch (error) {
      throw error;
    }
};


module.exports.signup = async (req,res) => {
    try {
        const {name, email, phone_number, password } = req.body;
        if(!name || !email || !phone_number || !password){
            return res.status(400).json({message:"Please fill all the fields"});
        }

        const user = await prisma.author.create({
            data:{
                id: uuidv4(),
                name,
                email,
                phone_number,
                access_token_secret: crypto.randomBytes(64).toString('hex'),
                refresh_token_secret: crypto.randomBytes(64).toString('hex'),
                password_hash: await hashPassword(password),
            }
        });

        const accessToken = await jwt.sign({
            id: user.id,
            name: user.name,
            email: user.email,
            phone_number: user.phone_number,
            created_at: user.created_at,
            updated_at: user.updated_at,
        },user.access_token_secret,{expiresIn:"15m"});
        const refreshToken = await jwt.sign({
            id: user.id,
            name: user.name,
            email: user.email,
            phone_number: user.phone_number,
            created_at: user.created_at,
            updated_at: user.updated_at,
        },user.refresh_token_secret,{expiresIn:"7d"});
        
        return res.status(200).json({
            accessToken,
            refreshToken,
            message: "User created successfully",
        });
    } catch (error) {
        if(error.code === "P2002"){
            return res.status(400).json({message:"User already exists", error: error.meta.target});
        }else{
            console.log(error);
        }
        
        return res.status(500).json({message:error.message});
    }
}


module.exports.login = async (req,res) => {
    try{
        const {email, password} = req.body;
        if(!email || !password){
            return res.status(400).json({message:"Please fill all the fields"});
        }

        const user = await prisma.author.findUnique({
            where:{
                email,
            }
        });

        //User does not exist
        if(!user){
            return res.status(400).json({message:"Invalid Credentials"});
        }

        const match = await verify_password(password, user.password_hash);

        if(!match){
            return res.status(400).json({message:"Invalid Credentials"});
        }

        const accessToken = await jwt.sign({
            id: user.id,
            name: user.name,
            email: user.email,
            phone_number: user.phone_number,
            created_at: user.created_at,
            updated_at: user.updated_at,
        },user.access_token_secret,{expiresIn:"15m"});

        const refreshToken = await jwt.sign({
            id: user.id,
            name: user.name,
            email: user.email,
            phone_number: user.phone_number,
            created_at: user.created_at,
            updated_at: user.updated_at,
        },user.refresh_token_secret,{expiresIn:"7d"});

        return res.status(200).json({
            accessToken,
            refreshToken,
            message: "User logged in successfully",
        });

    }catch(e){
        console.log(e);
        return res.status(500).json({message:e.message});
    }
};

module.exports.refresh_access_token = async (req,res) => {
    try {
        const { email, refresh_token } = req.body;
        if(!email || !refresh_token){
            return res.status(400).json({message:"Please fill all the fields"});
        }

        const user = await prisma.author.findUnique({
            where:{
                email,
            }
        });

        //User does not exist
        if(!user){
            return res.status(400).json({message:"Invalid Credentials"});
        }

        const payload = await jwt.verify(refresh_token,user.refresh_token_secret);
        if(!payload){
            return res.status(400).json({message:"Invalid Credentials"});
        }

        const access_token = await jwt.sign({
            id: user.id,
            name: user.name,
            email: user.email,
            phone_number: user.phone_number,
            created_at: user.created_at,
            updated_at: user.updated_at,
        },user.access_token_secret,{expiresIn:"15m"});

        return res.status(200).json({
            access_token,
            message: "Access Token Refreshed successfully",
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({message:error.message});
    }
}


module.exports.get_user_info = async(req,res) => {
    try {
        const { email } = req.user;
        if(!email){
            return res.status(400).json({message:"Authentication failed"});
        }

        const user = await prisma.author.findUnique({
            where:{
                email,
            }
        });


        return res.status(200).json({
            user,
            message: "User info fetched successfully",
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({message:error.message});
    }
}