class CardSetSerializer < ActiveModel::Serializer
     attributes :id, :name
   
     has_many :cards
end
   