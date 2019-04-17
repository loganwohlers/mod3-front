# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)
require 'json'

Artist.destroy_all
Card.destroy_all
Color.destroy_all
CardColor.destroy_all

data_hash = JSON.parse(File.read('./lib/scryfall.json'))

Color.create(name: 'White', abbreviation: 'W')
Color.create(name: 'Blue', abbreviation: 'U')
Color.create(name: 'Black', abbreviation: 'B')
Color.create(name: 'Red', abbreviation: 'R')
Color.create(name: 'Green', abbreviation: 'G')
colorless=Color.create(name: 'Colorless', abbreviation: 'N')
land=Color.create(name: 'Land', abbreviation: 'L')

# doing normal layout only to avoid flip/multi-sided cards
data_hash.each do |card|
     if(card['highres_image'] && card['layout']=='normal') 
          aa=Artist.find_or_create_by(name: card['artist'])
          cs=CardSet.find_or_create_by(name: card['set_name'])
          cc=Card.create(
               name: card['name'],
               artist_id: aa.id,
               art: card['image_uris']['art_crop'],
               flavor_text: card['flavor_text'],
               type_line: card['type_line'],
               card_set_id: cs.id,
               artist_name: aa.name,
               set_name: cs.name,
               likes: 0
          )
          if(card['type_line'].include?("Land"))
               CardColor.create(card_id: cc.id, color_id: land.id)
          elsif (card['colors'].empty?)
               CardColor.create(card_id: cc.id, color_id: colorless.id)
          else
               card['colors'].each do |col|
                    CardColor.create(card_id: cc.id, color_id: Color.find_by(abbreviation: col).id) 
               end
          end
     end
end
