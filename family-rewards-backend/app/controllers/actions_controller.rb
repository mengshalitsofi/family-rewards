class ActionsController < ApplicationController

    def create
      action = Action.new(action_params)
      if action.save
        render json: ActionSerializer.new(action)
      else
          render json: {message: action.errors.full_messages}
        end
    end
  
    def destroy
        action = Action.find_by(id: params[:id])
        action.destroy
        render json: {message: "success"}
    end

    private
  
    def action_params
      params.require(:new_action).permit(:timestamp, :price_id)
    end
  
  end