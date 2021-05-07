class CreatePrices < ActiveRecord::Migration[6.0]
    def change
        create_table :prices do |t|
            t.string :description
            t.numeric :price

            t.timestamps
        end
    end
end