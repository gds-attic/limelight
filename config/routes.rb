Limelight::Application.routes.draw do
  match "/_status" => "healthcheck#index", via: :get

  match "/performance/services" => "common#services", via: :get, as: "services"

  if Rails.env.test? or Rails.env.development?
    match "/backdrop_stub/performance/:service/api/:api_name" => "backdrop_stub#serve_fixture", via: :get
  end

  match "/performance/licensing/licences/:slug" => "licensing#per_licence", via: :get, as: "licence"
  match "/performance/licensing/authorities/:slug" => "licensing#per_authority", via: :get, as: "authority"
  match "/performance/licensing/licences" => "licensing#licences", via: :get
  match "/performance/licensing/authorities" => "licensing#authorities", via: :get
  match "/performance/licensing" => "licensing#index", via: :get, as: "licensing"

  if Rails.application.config.feature_toggles[:fco_dashboards]
    match "/performance/pay-legalisation-post" => "fco#pay_legalisation_post", via: :get, as: "pay_legalisation_post"
    match "/performance/pay-legalisation-drop-off" => "fco#pay_legalisation_drop_off", via: :get, as: "pay_legalisation_drop_off"
    match "/performance/pay-register-birth-abroad" => "fco#pay_register_birth_abroad", via: :get, as: "pay_register_birth_abroad"
    match "/performance/pay-register-death-abroad" => "fco#pay_register_death_abroad", via: :get, as: "pay_register_death_abroad"
    match "/performance/pay-foreign-marriage-certificates" => "fco#pay_foreign_marriage_certificates", via: :get, as: "pay_foreign_marriage_certificates"
    match "/performance/deposit-foreign-marriage" => "fco#deposit_foreign_marriage", via: :get, as: "deposit_foreign_marriage"
  end

  if Rails.application.config.feature_toggles[:hmrc_dashboards]
    match "/performance/hmrc" => "hmrc#index", via: :get, as: "hmrc"
  end

  if Rails.application.config.feature_toggles[:lpa_dashboard]
    match "/performance/lasting-power-of-attorney" => "lpa#index", via: :get, as: "lpa"
  end

  if Rails.application.config.feature_toggles[:evl_dashboard]
    get "/performance/:dashboard" => "dashboard#index", as: "dashboard"
  end

end
