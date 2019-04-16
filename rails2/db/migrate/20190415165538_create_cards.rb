class CreateCards < ActiveRecord::Migration[5.2]
  def change
    create_table :cards do |t|
      t.string :name
      t.integer :artist_id
      t.string :art
      t.timestamps
    end
  end
end
