class LicensingController < ApplicationController
  
  def index
    @last_month = 1.months.ago.strftime("%B")
  end
  
  def licences
    licences_flat = Licences.from_backdrop_response(backdrop_api.get_licences)
    @licences = licences_flat.group_by{ |licence| licence.name[0].downcase }
    @num_licences = licences_flat.length
  end

  def per_licence
    begin
      @licence = Licence.from_backdrop_response(backdrop_api.get_licence(service_name))
    rescue Exception => e
      raise ActionController::RoutingError.new('Licence not found.')
    end
  end

  def authorities
    authorities_flat = Authorities.from_backdrop_response(backdrop_api.get_authorities).sort
    @authorities = authorities_flat.group_by{ |authority| authority.short_name[0].downcase }
    @num_authorities = authorities_flat.length
  end

  def per_authority
    begin
      @authority = Authority.from_backdrop_response(backdrop_api.get_authority(service_name))
    rescue Exception => e
      raise ActionController::RoutingError.new('Authority not found')
    end
  end

end
