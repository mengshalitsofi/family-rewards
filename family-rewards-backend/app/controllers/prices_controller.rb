class PricesController < ApplicationController

    def index
      render json: Price.all, include: [actions: {only: [:timestamp]}], except: [:created_at, :updated_at]
    end
  
    def create
      price = Price.new(price_params)
      if price.save
        render json: price, include: [actions: {only: [:timestamp]}], except: [:created_at, :updated_at]
      else
        render json: {message: price.errors.full_messages}
      end
    end
  
    def update
      price = Price.find_by(id: params[:id])
      price.update(price_params)
      render json: price, include: [actions: {only: [:timestamp]}], except: [:created_at, :updated_at]
    end
  
    def destroy
      price = Price.find_by(id: params[:id])
      price.destroy
      render json: {message: "success"}
    end
  
    private
  
    def price_params
        params.require(:price).permit(:description, :price)
    end
  
  
  end