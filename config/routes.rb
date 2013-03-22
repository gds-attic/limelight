Limelight::Application.routes.draw do
  match "/_healthcheck" => "healthcheck#index", via: :get
  match "/performance/licensing/licences/:slug" => "licensing#per_licence", via: :get, as: "licence"
  match "/performance/licensing/licences" => "licensing#licences", via: :get
  match "/performance/licensing" => "licensing#index", via: :get
  
end
