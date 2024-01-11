const prisma = require("../prisma_init");
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');
const bcrypt = require('bcrypt');   


module.exports.get_author_profile = async(req,res) => {
    try {
        let id = null;
        const { operation } = req.params;

        if(operation === "me"){
            id = req.user.id;
        } else if(operation.length === 36){
            id = operation;
        } else{
            return res.status(400).json({message:"Invalid API Call. Please check the API documentation. Use /me to get your own profile. Use /:id to get the profile of a user with id"});
        }
        
        const user = await prisma.author.findUnique({
            where:{
                id: id
            },
            select:{
                id:true,
                name:true,
                email:true,
                books:{
                    select:{
                        id:true,
                        title:true,
                        created_at:true,
                        updated_at:true,
                        likes: true,
                    },
                },
                created_at:true,
                updated_at:true,
            }
            
        });

        if(!user){
            return res.status(404).json({message:"Author not found"});
        }

        return res.status(200).json({
            ...user,
            books_count: user.books.length,
            message: "User fetched successfully",
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({message:error.message});
    }
}