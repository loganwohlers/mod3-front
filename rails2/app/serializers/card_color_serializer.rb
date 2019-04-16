class CardColorSerializer < ActiveModel::Serializer
  attributes :id

  belongs_to :card
  belongs_to :color
end
