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

module.exports.get_all_authors = async(req,res) => {
    try {
        const { order_by } = req.query;

        const authors_data = await prisma.author.findMany({
            orderBy:{
                name: order_by ? order_by : "asc",
            },
            select:{
                id:true,
                name:true,
                created_at:true,
                updated_at:true,
                email: true,
                phone_number: true,
                _count:{
                    select:{
                        books:true,
                    }
                },
            }
        });

        if(!authors_data){
            return res.status(404).json({message:"No authors found"});
        }

        let authors = authors_data.map((author)=>{
            return {
                ...author,
                books_count: author._count.books,
            }
        });

        return res.status(200).json({
            authors,
            message: "Authors fetched successfully",
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({message:error.message});
    }
}

module.exports.update_author_profile = async(req,res) => {
    try{
        const { name, email, phone_number } = req.body;
        const { id } = req.user;

        if(!name && !email && !phone_number){
            return res.status(400).json({message:"No data to update"});
        }

        const user = await prisma.author.findUnique({
            where:{
                id: id
            },
            select:{
                id:true,
                name:true,
                email:true,
                phone_number:true,
                created_at:true,
                updated_at:true,
            }
            
        });

        if(!user){
            return res.status(404).json({message:"Author not found"});
        }

        const updated_user = await prisma.author.update({
            where:{
                id: id
            },
            data:{
                name: name ? name : user.name,
                email: email ? email : user.email,
                phone_number: phone_number ? phone_number : user.phone_number,
            },
            select:{
                id:true,
                name:true,
                email:true,
                phone_number:true,
                created_at:true,
                updated_at:true,
            }
        });

        return res.status(200).json({
            ...updated_user,
            message: "User updated successfully",
        });
    }catch(error){
        if(error.code === "P2002"){
            return res.status(409).json({message:"Email or Phone Number already exists"});
        }
        console.log(error);
        return res.status(500).json({message:error.message});
    }
}

module.exports.delete_author_profile = async(req,res) => {
    try{
        const { id } = req.user;

        const user = await prisma.author.findUnique({
            where:{
                id: id
            },
            select:{
                id:true,
                name:true,
                email:true,
                phone_number:true,
                created_at:true,
                updated_at:true,
            }
            
        });

        if(!user){
            return res.status(404).json({message:"Author not found"});
        }

        const deleted_user = await prisma.author.delete({
            where:{
                id: id
            },
            select:{
                id:true,
                name:true,
                email:true,
                phone_number:true,
                created_at:true,
                updated_at:true,
            }
        });

        return res.status(200).json({
            ...deleted_user,
            message: "User deleted successfully",
        });
    }catch(error){
        console.log(error);
        return res.status(500).json({message:error.message});
    }
}