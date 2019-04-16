class CardSerializer < ActiveModel::Serializer
     attributes :id, :name, :artist_id, :art, :flavor_text, :type_line, :card_set_id, :set_name, :likes
   
     belongs_to :artist
     has_many :card_colors
     has_many :colors, through: :card_colors
     belongs_to :card_set


   end
   