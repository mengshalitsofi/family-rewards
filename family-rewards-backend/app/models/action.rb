class Action < ApplicationRecord
    belongs_to :price
    validates :timestamp, presence: true
end