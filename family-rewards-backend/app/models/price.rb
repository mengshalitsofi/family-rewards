class Price < ApplicationRecord
    has_many :actions, dependent: :destroy

    validates :description, presence: true
end