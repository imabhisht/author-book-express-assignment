const {faker} = require('@faker-js/faker');
const fs = require('fs');

module.exports.generateUserWithFullInfo = async() => {
    const first_name = await faker.person.firstName();
    const last_name = await faker.person.lastName();
    const email = await faker.internet.email({
        firstName: first_name,
        lastName: last_name,
        provider: faker.internet.domainName(),
    });

    const phone_number = await faker.phone.number();
    const password = await faker.internet.password();

    return {
        name: `${first_name} ${last_name}`,
        email,
        phone_number,
        password,
    }
}