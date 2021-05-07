# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

Price.create([
    { description: "Clean room", price: 2 },
    { description: "Practice reading", price: 3 },
    { description: "Get dressed by yourself", price: 1 },
    { description: "Buy Barbie", price: -5 },
    { description: "Watch a movie", price: -2 }
])