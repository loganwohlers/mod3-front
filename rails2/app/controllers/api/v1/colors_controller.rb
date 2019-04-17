class Api::V1::ColorsController < ApplicationController

     def filter
          abbrv=JSON.parse(request.raw_post)['abbreviation']
          color=Color.find_by(abbreviation: abbrv)
          @colors_cards = color.cards.sample(100)
          render json: @colors_cards
     end

   end
