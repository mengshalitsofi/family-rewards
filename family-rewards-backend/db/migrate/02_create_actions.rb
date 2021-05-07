class CreateActions < ActiveRecord::Migration[6.0]
    def change
        create_table :actions do |t|
            t.references :price, null: false, foreign_key: true

            t.timestamps
        end
    end
end