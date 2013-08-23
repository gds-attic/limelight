require 'spec_helper'

describe CommonController do

  describe "#services" do
    let(:excluded_service_attributes) {
      [
        {:name=>"HMRC", :slug=>"hmrc", :excluded_from_list=>true, :toggle=>"hmrc_dashboards"}
      ]
    }
    let(:included_service_attributes) {
      {
        services:[
          {name:"Licensing", slug:"licensing", excluded_from_list:false, toggle:nil, is_group: nil},
          {name:"Lasting Power of Attorney", slug:"lasting-power-of-attorney", excluded_from_list:false, toggle:"lpa_dashboard", is_group: false},
          {name:"Pay to get documents legalised by post", slug:"pay-legalisation-post", excluded_from_list:false, toggle:"fco_dashboards", is_group: nil},
          {name:"Pay to legalise documents using the premium service", slug:"pay-legalisation-drop-off", excluded_from_list:false, toggle:"fco_dashboards", is_group: false},
          {name:"Payment to register a birth abroad in the UK", slug:"pay-register-birth-abroad", excluded_from_list:false, toggle:"fco_dashboards", is_group: false},
          {name:"Payment to register a death abroad", slug:"pay-register-death-abroad", excluded_from_list:false, toggle:"fco_dashboards", is_group: false},
          {name:"Payment for certificates to get married abroad", slug:"pay-foreign-marriage-certificates", excluded_from_list:false, toggle:"fco_dashboards", is_group: false},
          {name:"Deposit foreign marriage or civil partnership certificates", slug:"deposit-foreign-marriage", excluded_from_list:false, toggle:"fco_dashboards", is_group: false},
          {name:"SORN", slug:"sorn", excluded_from_list:false, toggle:nil, is_group: false},
          {name:"Tax Disc", slug:"tax-disc", excluded_from_list:false, toggle:"evl_dashboard", is_group: false}
        ],
        groups:[
          {name:"Vehicle licensing", slug:"vehicle-licensing", excluded_from_list:false, toggle:nil, is_group: true},
          {name:"Aardvark wrangling", slug:"aardvark-wrangling", excluded_from_list:false, toggle:nil, is_group: true},
        ]
      }
    }
    let(:excluded_service_list) {
      excluded_service_attributes.map {|attrs| Service.new(attrs.stringify_keys) }
    }
    let(:service_list) {
      included_service_attributes[:services].map {|attrs| Service.new(attrs.stringify_keys) }
    }
    let(:service_groups_list) {
      included_service_attributes[:groups].map {|attrs| Service.new(attrs.stringify_keys) }
    }
    let(:all_service_list) {
      excluded_service_list + service_list + service_groups_list
    }
    let(:grouped_service_groups_list) {
      service_groups_list.group_by {|service| service.name[0].upcase }
    }
    let(:grouped_service_list) {
      service_list.group_by {|service| service.name[0].upcase }
    }
    before do
      Limelight::Application.stub_chain(:config, :available_services, :values).and_return all_service_list
    end

    it "should render the services page" do
      get :services
      response.status.should == 200
      response.should render_template :services
    end

    it "should assign the services grouped by first letter and the count of services" do
      get :services
      assigns(:num_services).should == included_service_attributes[:services].count
      grouped_service_list.each do |letter, services|
        assigns(:services)[letter].should == services.sort_by!(&:name)
      end
    end

    it "should assign the service groups grouped by first letter and the count of service groups" do
      get :services
      assigns(:num_service_groups).should == included_service_attributes[:groups].count
      grouped_service_groups_list.each do |letter, services|
        services.each do |service|
          assigns(:service_groups)[letter].should == services.sort_by!(&:name)
        end
      end
    end
  end

end
