class CommonController < ApplicationController

  def services
    all_services = get_all_included_services
    services_list = extract_and_sort_services(all_services)
    service_groups_list = extract_and_sort_service_groups(all_services)

    @services = group_by_initial(services_list)
    @num_services = services_list.length

    @service_groups = group_by_initial(service_groups_list)
    @num_service_groups = service_groups_list.length
  end

  private

  def get_all_included_services
    Limelight::Application.config.available_services.values.reject(&:excluded_from_list)
  end

  def extract_and_sort_service_groups(service_array)
    extract_and_sort_when_group_is(:present?, service_array)
  end

  def extract_and_sort_services(service_array)
    extract_and_sort_when_group_is(:blank?, service_array)
  end

  def extract_and_sort_when_group_is(grouped_or_not, service_array)
    service_array
      .select { |service| service.is_group.send(grouped_or_not)}
      .sort_by!(&:name)
  end

  def group_by_initial(array)
    array.group_by { |service| initial_letter_of(service.name) }
  end

  def initial_letter_of(name)
    name[0].upcase
  end

end
