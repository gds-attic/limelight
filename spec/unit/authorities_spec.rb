require 'spec_helper'

describe Authority do
  it "should initialise from a backdrop response" do
    response = {
      "data" => {
        "authorityUrlSlug" =>{
          "fake-authority-1" => {
            "authorityName" => ["Fake Authority"]
          },
          "fake-authority-2" => {
            "authorityName" => ["Fake Authority Two"]
          }
        }
      }
    }

    authorities = Authorities.from_backdrop_response(response)

    authorities[0].name.should == "Fake Authority"
    authorities[0].slug.should == "fake-authority-1"
    authorities[1].name.should == "Fake Authority Two"
    authorities[1].slug.should == "fake-authority-2"
  end

  it "should return an empty array when the backdrop response is empty" do
    authorities = Authorities.from_backdrop_response({})

    authorities.should be_empty
  end
end