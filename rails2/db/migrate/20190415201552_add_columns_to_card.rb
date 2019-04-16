class AddColumnsToCard < ActiveRecord::Migration[5.2]
  def change
    add_column :cards, :flavor_text, :string 
    add_column :cards, :type_line, :string 
  end
end
