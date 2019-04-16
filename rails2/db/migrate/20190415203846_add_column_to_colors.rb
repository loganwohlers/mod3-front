class AddColumnToColors < ActiveRecord::Migration[5.2]
  def change
    add_column :colors, :abbreviation, :string
  end
end
