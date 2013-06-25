class CommonController < ApplicationController

  def services

    all_services = [
      {
        name: 'Licensing',
        path: licensing_path
      },
      {
        name: 'Pay to get documents legalised by post',
        path: pay_legalisation_post_path
      },
      {
        name: 'Pay to legalise documents using the premium service',
        path: pay_legalisation_drop_off_path
      },
      {
        name: 'Payment to register a birth abroad in the UK',
        path: pay_register_birth_abroad_path
      },
      {
        name: 'Payment to register a death abroad',
        path: pay_register_death_abroad_path
      },
      {
        name: 'Payment for certificates to get married abroad',
        path: pay_foreign_marriage_certificates_path
      },
      {
        name: 'Deposit foreign marriage or civil partnership certificates',
        path: deposit_foreign_marriage_path
      }
    ]

    if Rails.application.config.feature_toggles[:lpa_dashboard]
      all_services << {
        name: 'Lasting Power of Attorney',
        path: lpa_path
      }
    end

    all_services.sort_by! { |k| k[:name] }

    @services = all_services.group_by{ |service| service[:name][0].downcase }
    @num_services = all_services.length

  end

end
