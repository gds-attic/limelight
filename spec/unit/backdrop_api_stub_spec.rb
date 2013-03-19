require 'spec_helper'

describe BackdropAPIStub do

  it "should load fixtures from the provided path" do
    stub_path = Rails.root.join("spec/fixtures/stub_api")

    response = BackdropAPIStub.new(stub_path).get_licences

    response["data"]["licenceUrlSlug"].should have(2).licences
  end

  it "should raise a Songkick::Transport error if the fixture does not exist" do
    lambda { BackdropAPIStub.new("invalid_path").get_licences }.should raise_error(Songkick::Transport::UpstreamError)
  end

  describe "get_licences" do
    it "should return licences from the get_licences fixture" do
      response = BackdropAPIStub.new.get_licences

      response["data"]["licenceUrlSlug"].should have(2).licences
      response["data"]["licenceUrlSlug"]["application-to-licence-a-street-collection"]["licenceName"][0].should == "Application to licence a street collection"
    end
  end
  
  describe "get_licence" do
    it "should return a licence from the get_licence fixture" do
      response = BackdropAPIStub.new.get_licence('application-to-licence-a-street-collection')

      response["data"]["licenceUrlSlug"].should have(1).licence
      response["data"]["licenceUrlSlug"]["application-to-licence-a-street-collection"]["licenceName"][0].should == "Application to licence a street collection"
    end
  end
end