class Action < ApplicationRecord
    belongs_to :price
    validates :action_date, presence: true
end