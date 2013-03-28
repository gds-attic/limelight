class LicensingController < ApplicationController
  
  def index
    
  end
  
  def licences
    @licences = Licences.from_backdrop_response(backdrop_api.get_licences)
  end

  def per_licence
    slug = params[:slug]
    begin
      #@licence = Licence.from_backdrop_response(backdrop_api.get_licence(slug))
      @licence = Licence.new(slug, slug)
    rescue Exception => e
      raise ActionController::RoutingError.new('Licence not found.')
    end
  end

  def authorities
    @authorities = Authorities.from_backdrop_response(backdrop_api.get_authorities)
  end

  def per_authority
    slug = params[:slug]
    begin
      @authority = Authority.from_backdrop_response(slug, backdrop_api.get_authority(slug))
    rescue Exception => e
      raise ActionController::RoutingError.new('Authority not found')
    end
  end

end
