class Api::V1::ColorsController < ApplicationController

     def index
       
     end

     def show

     end

     def filter
          abbrv=JSON.parse(request.raw_post)['abbreviation']
          color=Color.find_by(abbreviation: abbrv)
          @colors_cards = color.cards.limit(200)
          render json: @colors_cards
     end

   end