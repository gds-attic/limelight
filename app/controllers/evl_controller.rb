class EvlController < ApplicationController

  def index
    respond_to do |format|
      format.html { render :template => "evl/index" }
    end
  end

end