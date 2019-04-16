class Api::V1::CardsController < ApplicationController
     before_action :find_card, only: [:update]
     def index
       @cards = Card.all.order(name: :asc).limit(200)
       render json: @cards
     end
    
     def update
       @card.update(card_params)
       if @card.save
         render json: @card, status: :accepted
       else
         render json: { errors: @card.errors.full_messages }, status: :unprocessible_entity
       end
     end
    
     private
    
     def card_params
       params.require(:card).permit!
     end
    
     def find_card
       @card = Card.find(params[:id])
     end
   end