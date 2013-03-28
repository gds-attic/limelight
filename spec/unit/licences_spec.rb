require "spec_helper"

describe Licences do
  it "should initialize from a backdrop response" do
    response = {
      "data" => [
        {
          "licenceUrlSlug" => "licence_slug_1"
        },
        {
          "licenceUrlSlug" => "licence_slug_2"
        }
      ]
    }

    licences = Licences.from_backdrop_response(response)

    licences[0].should be_a(Licence)
    licences[0].name.should == "licence_slug_1"
    licences[0].slug.should == "licence_slug_1"

    licences[1].should be_a(Licence)
    licences[1].name.should == "licence_slug_2"
    licences[1].slug.should == "licence_slug_2"
  end

  it "should return an empty array when the backdrop response is empty" do
    licences = Licences.from_backdrop_response({ "data" => [] })

    licences.should be_empty
  end
end
