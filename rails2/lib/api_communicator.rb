SCRYFALL='https://api.scryfall.com/cards?page=1'
puts "TEST"

# require 'rest-client'
require 'json'



data_hash = JSON.parse(File.read('scryfall.json'))
data_hash.each do |card|
     Artist.find_or_create_by(name: card['artist'])
end








# fetch(SCRYFALL)
# .then(response=>response.json())
# .then(json=>{
#      console.log(json)
#      json.data.map(renderArt)
#      if(json.next_page){
#           // debugger
#           fetch(json.next_page)
#           .then(response=>response.json())
#           .then(json=>{
#                json.data.map(renderArt)
#           })
#      }
# })

