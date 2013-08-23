class DashboardController < ApplicationController
  before_filter :validate_dashboard_existence

  def index
    #this doesn't work, hash to partial which build sub nav? partial in application?
    self.class.prepend_view_path "app/views/#{params[:slug]}../"
    respond_to do |format|
      format.html { render :template => "#{params[:slug]}/index" }
    end
  end

  def validate_dashboard_existence
    redirect_to :status => 404 unless Limelight::Application.config.available_services.key? params[:slug]
  end
end
