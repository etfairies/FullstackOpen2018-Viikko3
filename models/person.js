const mongoose = require('mongoose')

const url = 'mongodb://fullstack:soittaja1@ds235833.mlab.com:35833/phonebook'

mongoose.connect(url, {useNewUrlParser: true})

const Person = mongoose.model('Person', {
    name: String,
    number: String
})

module.exports = Person