Limelight::Application.routes.draw do
  match "/_healthcheck" => "healthcheck#index", via: :get
  match "/licensing/licences/:slug" => "licensing#per_licence", via: :get
  match "/licensing/licences" => "licensing#licences", via: :get
  match "/licensing" => "licensing#index", via: :get
  
end
