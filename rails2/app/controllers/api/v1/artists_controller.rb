class Api::V1::ArtistsController < ApplicationController

     def index
          @artists=Artist.all.order(name: :asc)
          render json: @artists
     end

     def filter
          name=JSON.parse(request.raw_post)['name']
          artist=Artist.find_by(name: name)
          @artist_cards = artist.cards
          render json: @artist_cards
     end

     def show

     end
     
   end