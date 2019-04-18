class Api::V1::CardSetsController < ApplicationController

     def index
          @sets=CardSet.all.order(name: :asc)
          render json: @sets
     end

     def filter
          name=JSON.parse(request.raw_post)['name']
          set=CardSet.find_by(name: name)
          @set_cards = set.cards.order(name: :asc).limit(1000)
          render json: @set_cards
     end
  
end