class ColorSerializer < ActiveModel::Serializer
     attributes :id, :name
   
     has_many :card_colors
     has_many :cards, through: :card_colors
end
   