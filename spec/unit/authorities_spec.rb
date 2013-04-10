require 'spec_helper'

describe Authorities do
  it "should initialise from a backdrop response with additional data" do
    response = JSON.parse <<-HERE
      {
        "data": [
          {
            "authorityUrlSlug": "fake-authority-1",
            "authorityName": ["Fake authority 1"]
          },
          {
            "authorityUrlSlug": "fake-authority-2",
            "authorityName": ["Fake authority 2"]
          }
        ]
      }
    HERE

    authorities = Authorities.from_backdrop_response(response)

    authorities[0].name.should == "Fake authority 1"
    authorities[0].slug.should == "fake-authority-1"
    authorities[1].name.should == "Fake authority 2"
    authorities[1].slug.should == "fake-authority-2"
  end

  it "should initialise from a backdrop response without additional data" do
    response = JSON.parse <<-HERE
      {
        "data": [
          {
            "authorityUrlSlug": "fake-authority-1"
          },
          {
            "authorityUrlSlug": "fake-authority-2"
          }
        ]
      }
    HERE

    authorities = Authorities.from_backdrop_response(response)

    authorities[0].name.should == "fake-authority-1"
    authorities[0].slug.should == "fake-authority-1"
    authorities[1].name.should == "fake-authority-2"
    authorities[1].slug.should == "fake-authority-2"
  end

  it "should return an empty array when the backdrop response is empty" do
    authorities = Authorities.from_backdrop_response({ "data" => [] })

    authorities.should be_empty
  end
end