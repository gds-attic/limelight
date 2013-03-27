class LicensingController < ApplicationController
  
  def index
    
  end
  
  def licences
    
    api = backdrop_api
    
    response = api.get_licences
    
    if response["data"]
      
      @licences = response["data"].map do |value|
        {
          :licenceUrlSlug => value["licenceUrlSlug"],
          :licenceName => value["licenceUrlSlug"] # value["licenceName"][0]
        }
      end
    else
      @licences = []
    end
    
  end

  def per_licence
    
    slug = params[:slug]
    
    #api = backdrop_api
    #
    #response = api.get_licence(slug)
    #
    #data = response["data"]
    #
    #if data && data[0]
      
      @licence = {
        :licenceUrlSlug => slug,
        :licenceName => slug # response["data"][0]["licenceName"][0]
      }
      
    #else
    #  raise ActionController::RoutingError.new('Licence not found.')
    #end
  end

end
