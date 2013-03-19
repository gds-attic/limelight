require 'spec_helper'

describe BackdropAPI do
  
  describe "get_licences" do
    
    it "should retrieve a list of licences" do
      
      response = {
        "bucket" => "licensing",
        "query" => {
          "group_by" => "licenceUrlSlug",
          "collect" => ["licenceName"],
          "period" => "all"
        },
        "data" => {
          "licenceUrlSlug" => {
            "application-to-licence-a-street-collection" => {
              "licenceName" => ["Application to licence a street collection"],
              "_count" => 2
            },
            "register-as-a-scrap-metal-dealer" => {
              "licenceName" => ["Register as a scrap metal dealer"],
              "_count" => 1
            }
          }
        }
      }
      
      httparty_stub = double("HttpParty")
      response_stub = double("response")
      
      httparty_stub.should_receive(:get)
        .with("/licensing?group_by=licenceUrlSlug&collect=licenceName&period=all")
        .and_return(response_stub)
      
      response_stub.stub(:data).and_return(response)
      
      Songkick::Transport::HttParty.should_receive(:new)
        .with("http://backdrop/", :user_agent => "Limelight", :timeout => 30)
        .and_return(httparty_stub)
            
      client = BackdropAPI.new("http://backdrop/")
      
      licences = client.get_licences

      licences["data"]["licenceUrlSlug"].should have(2).licences
      
    end
    
  end

  describe "get_licence" do
    
    it "should retrieve data for a specific licence" do
      
      response = {
        "bucket" => "licensing",
        "query" => {
          "filter_by" => "licenceUrlSlug:application-to-licence-a-street-collection",
          "group_by" => "licenceUrlSlug",
          "collect" => ["licenceName"],
          "period" => "all"
        },
        "data" => {
          "licenceUrlSlug" => {
            "application-to-licence-a-street-collection" => {
              "licenceName" => ["Application to licence a street collection"],
              "_count" => 2
            }
          }
        }
      }
      
      httparty_stub = double("HttpParty")
      response_stub = double("response")
      
      httparty_stub.should_receive(:get)
        .with("/licensing?filter_by=licenceUrlSlug:application-to-licence-a-street-collection&group_by=licenceUrlSlug&collect=licenceName&period=all")
        .and_return(response_stub)
      
      response_stub.stub(:data).and_return(response)
      
      Songkick::Transport::HttParty.should_receive(:new)
        .with("http://backdrop/", :user_agent => "Limelight", :timeout => 30)
        .and_return(httparty_stub)
            
      client = BackdropAPI.new("http://backdrop/")
      
      licences = client.get_licence('application-to-licence-a-street-collection')

      licences["data"]["licenceUrlSlug"].should have(1).licences
      licences["data"]["licenceUrlSlug"]["application-to-licence-a-street-collection"]["licenceName"][0].should == "Application to licence a street collection"
      
    end
    
  end

end
