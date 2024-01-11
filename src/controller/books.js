const jwt = require('jsonwebtoken');
const prisma = require("../prisma_init.js");
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');
const bcrypt = require('bcrypt');


const createBookModule = async (book_body) => {
    try {
        const {title, author_id, likes } = book_body;

        const book = await prisma.books.create({
            data:{
                id: uuidv4(),
                title,
                author_id,
                likes
            }
        });

        return book;
    } catch (error) {
        throw error;
    }
};

module.exports.getBooks = async(req,res) => {
    try {
        const { skip, take, sort_by } = req.query;

        // Default values
        const skip_default = skip || 0;
        const take_default = take || 10;

        // GET BOOKS BY MOST LIKED or LEAST LIKED
        const books = await prisma.books.findMany({
            skip: parseInt(skip_default),
            take: parseInt(take_default),
            orderBy:{
                likes: sort_by === "most_liked" ? "desc" : "asc"
            },
            
        });

        return res.status(200).json({
            books,
            message: "Books fetched successfully",
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({message:error.message});
    }
}

module.exports.createBookModule = createBookModule;

module.exports.create_book = async (req,res) => {
    try {
        const {title, author_id } = req.body;
        const likes = 0;

        const book = await createBookModule({
            title,
            author_id,
            likes
        });

        return res.status(200).json({
            ...book,
            message: "Book created successfully",
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({message:error.message});
    }
}

module.exports.like_book = async (req,res) => {
    try {
        const { id } = req.user;

        // Get book_id from req.params
        const { book_id } = req.params;

        const book = await prisma.books.update({
            where:{
                id:book_id,
            },
            data:{
                likes: {
                    increment: 1,
                },
                books_like_activity:{
                    create:{
                        author:{
                            connect:{
                                id,
                            }
                        }
                    }
                }
            }
        })
        
        return res.status(200).json({
            ...book,
            message: "Book liked successfully",
        });

    } catch (error) {
        if(error.code === "P2002"){
            return res.status(200).json({message:"Book already liked by User"});
        }
        return res.status(500).json({message:error.message});
    }
}


module.exports.dislike_book = async (req,res) => {
    try {
        const { id } = req.user;
        // Get book_id from req.params
        const { book_id } = req.params;
        
        const book = await prisma.books.update({
            where:{
                id:book_id,
            },
            data:{
                likes: {
                    decrement: 1,
                },
                books_like_activity:{
                    delete:{
                        author_id_book_id:{
                            author_id: id,
                            book_id: book_id,
                        }
                    }
                }
            }
        });

        return res.status(200).json({
            ...book,
            message: "Book disliked successfully",
        });

    } catch (error) {
        if(error.code === "P2017"){
            return res.status(200).json({message:"Book already disliked by User"});
        }
        console.log(error);
        return res.status(500).json({message:error.message});
    }
}