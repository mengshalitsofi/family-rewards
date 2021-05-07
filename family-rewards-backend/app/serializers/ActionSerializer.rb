class ActionSerializer
    include FastJsonapi::ObjectSerializer
    attributes :timestamp, :price_id
end