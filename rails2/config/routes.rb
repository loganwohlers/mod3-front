Rails.application.routes.draw do
  resources :card_colors
  namespace :api do
    namespace :v1 do
      resources :cards, only: [:index, :update]
      resources :colors, only: [:index, :show]
      resources :artists, only: [:index, :show]
      resources :card_sets, only: [:index, :show]


      post '/colorfilter', to: 'colors#filter'
      post '/artistfilter', to: 'artists#filter'
      post '/setfilter', to: 'card_sets#filter'
    end
  end
end