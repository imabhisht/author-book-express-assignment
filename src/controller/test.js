const AuthController = require('./auth');
const BookController = require('./books');
const user_test_data_generator = require('../test/generator/user');
const book_test_data_generator = require('../test/generator/books');

module.exports.createFakeAuthorAndBooks = async (req,res) => {
    try {
        const { author_count, each_author_max, each_author_min, min_like, max_likes } = req.body;
        
        // If not provided, set default values
        const author_count_value = author_count || 10;
        const each_author_max_value = each_author_max || 10;
        const each_author_min_value = each_author_min || 1;
        const min_like_value = min_like || 0;
        const max_likes_value = max_likes || 100;



        const users = [];
        const books = [];
        for(let i=0;i<author_count_value;i++){
            const user = await user_test_data_generator.generateUserWithFullInfo();
            const { accessToken, refreshToken, id } = await AuthController.createUserModule(user);
            users.push({
                ...user,
                accessToken,
                refreshToken,
                id
            });

            console.log("User Created Successfully", user.email);
            const book_count = Math.floor(Math.random() * (each_author_max_value - each_author_min_value + 1)) + each_author_min_value;
            console.log("User", user.email, "created", book_count, "books");
            for(let j=0;j<book_count;j++){
                const book = await book_test_data_generator.generateBook();
                book.author_id = id;
                book.likes = Math.floor(Math.random() * (max_likes_value - min_like_value + 1)) + min_like_value;
                const created_book = await BookController.createBookModule(book);
                books.push(created_book);
                console.log("Book Created Successfully", book.title, "by", user.email, "with", book.likes, "likes")
            }

            console.log("--------------------------------------------------");

        }

        return res.status(200).json({
            users,
            books,
            message: "Fake users created successfully",
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:error.message});
    }
}

