class LicensingController < ApplicationController
  
  def index
    
  end
  
  def licences
    
    api = backdrop_api
    
    response = api.get_licences
    
    if response["data"]["licenceUrlSlug"]
      
      @licences = response["data"]["licenceUrlSlug"].map do |slug, value|
        {
          :licenceUrlSlug => slug,
          :licenceName => value["licenceName"][0]
        }
      end
    else
      @licences = []
    end
    
  end

  def per_licence
    
    slug = params[:slug]
    
    api = backdrop_api
    
    response = api.get_licence(slug)
    
    data = response["data"]["licenceUrlSlug"]
    
    if data && data[slug]
      
      @licence = {
        :licenceUrlSlug => slug,
        :licenceName => response["data"]["licenceUrlSlug"][slug]["licenceName"][0]
      }
      
    else
      raise ActionController::RoutingError.new('Licence not found.')
    end
  end

end
