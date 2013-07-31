class CommonController < ApplicationController

  def services
    services_list = Limelight::Application.config.available_services.values.reject(&:excluded_from_list)
    services_list.sort_by!(&:name)

    @services = services_list.group_by { |service| initial_letter_of(service.name) }
    @num_services = services_list.length

  end

  private

  def initial_letter_of(name)
    name[0].upcase
  end

end
