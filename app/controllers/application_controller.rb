class ApplicationController < ActionController::Base
  protect_from_forgery
  
  # use 'homepage' template to remove global navigation element
  include Slimmer::Template
  slimmer_template :homepage

  def backdrop_api
    Rails.configuration.use_api_stub ? BackdropAPIStub.new : BackdropAPI.new(Rails.configuration.backdrop_url)
  end
end
