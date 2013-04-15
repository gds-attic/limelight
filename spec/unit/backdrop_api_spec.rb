require 'spec_helper'

describe BackdropAPI do

  before :each do
    FakeWeb.clean_registry
  end
  
  describe "get_licences" do
    
    it "should retrieve a list of licences" do
      
      response = { "data" => "some-licenses" }

      FakeWeb.register_uri(:get,
                           "http://backdrop/performance/licensing/api?group_by=licenceUrlSlug&collect=licenceName&sort_by=licenceName:ascending",
                           :body => response.to_json)
            
      client = BackdropAPI.new("http://backdrop/")
      licences = client.get_licences

      licences.should == response
    end
    
  end

  describe "get_authorities" do

    it "should retrieve a list of authorities" do
      response = { "data" => ["foo_authoritiy", "bar_authoritiy"]}

      FakeWeb.register_uri(
        :get,
        "http://backdrop/performance/licensing/api?group_by=authorityUrlSlug&collect=authorityName&sort_by=authorityName:ascending",
        :body => response.to_json
      )

      client = BackdropAPI.new("http://backdrop/")
      authorities = client.get_authorities

      authorities.should == response
    end

  end

  describe "get_licence" do
    
    it "should retrieve data for a specific licence" do

      response = { "data" => "data-for-a-specific-licence" }

      FakeWeb.register_uri(:get,
                           "http://backdrop/performance/licensing/api?filter_by=licenceUrlSlug:application-to-licence-a-street-collection&group_by=licenceUrlSlug&collect=licenceName",
                           :body => response.to_json)

      client = BackdropAPI.new("http://backdrop/")
      
      licences = client.get_licence('application-to-licence-a-street-collection')

      licences["data"].should == "data-for-a-specific-licence"

    end
    
  end

  describe "get_authority" do
    it "should retrieve data listing specific authorities" do
      response = { "data" => "something that looks nothing like the real data"}

      FakeWeb.register_uri(
        :get,
        "http://backdrop/performance/licensing/api?filter_by=authorityUrlSlug:some-auth-slug&group_by=authorityUrlSlug&collect=authorityName",
        :body => response.to_json
      )

      client = BackdropAPI.new("http://backdrop/")

      authority = client.get_authority('some-auth-slug')
      authority['data'].should == "something that looks nothing like the real data"
    end
  end

  describe "authentication" do
    it "should authenticate with credentials" do
      response = { "data" => "some-licence-data" }

      FakeWeb.register_uri(:get,
                           "http://backdrop/performance/licensing/api?group_by=licenceUrlSlug&collect=licenceName&sort_by=licenceName:ascending", status: 401)

      FakeWeb.register_uri(:get,
                           "http://doctor:who@backdrop/performance/licensing/api?group_by=licenceUrlSlug&collect=licenceName&sort_by=licenceName:ascending", :body => response.to_json)

      client = BackdropAPI.new("http://backdrop/", {username: 'doctor', password: 'who'})
      licences = client.get_licences
      licences.should == response
    end
  end

end
