class AddMoreToCards < ActiveRecord::Migration[5.2]
  def change
    add_column :cards, :artist_name, :string
    add_column :cards, :set_name, :string
    add_column :cards, :likes, :integer
  end
end
