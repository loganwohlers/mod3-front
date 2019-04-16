class Card < ApplicationRecord
     belongs_to :artist
     has_many :card_colors
     has_many :colors, through: :card_colors
     belongs_to :card_set
end
