Limelight::Application.routes.draw do
  match "/_healthcheck" => "healthcheck#index", via: :get
  match "/licensing" => "licensing#index", via: :get
  
end
