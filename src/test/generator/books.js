const {faker} = require('@faker-js/faker');

module.exports.generateBook = async() => {
    try {
        const title = await faker.music.songName();
        return {
            title
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
}