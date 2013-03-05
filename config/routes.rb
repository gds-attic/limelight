Limelight::Application.routes.draw do
  match "/_healthcheck" => "healthcheck#index", via: :get
end
