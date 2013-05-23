class ApplicationController < ActionController::Base
  protect_from_forgery
  
  # use 'homepage' template to remove global navigation element
  include Slimmer::Template
  slimmer_template :homepage

  def backdrop_api
    config_value(:use_api_stub, false) ? BackdropAPIStub.new : BackdropAPI.new(backdrop_url, backdrop_auth())
  end

  def backdrop_auth
    if Rails.application.config.respond_to? :backdrop_auth
      Rails.application.config.backdrop_auth
    else
      nil
    end
  end

  def backdrop_url
    Rails.application.config.backdrop_url
  end

  def additional_requirejs_dependencies
    config_value(:additional_requirejs_dependencies)
  end

  def config_value(property, default_value=nil)
    if Rails.configuration.respond_to?(property.to_sym)
      Rails.configuration.send(property.to_sym)
    else
      default_value
    end
  end

end
