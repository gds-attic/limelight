class LpaController < ApplicationController

  def index
    respond_to do |format|
        format.html { render :template => "lpa/index" }
    end
  end

end