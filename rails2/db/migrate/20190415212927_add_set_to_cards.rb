class AddSetToCards < ActiveRecord::Migration[5.2]
  def change
    add_column :cards, :card_set_id, :integer
  end
end
