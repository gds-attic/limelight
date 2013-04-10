require "spec_helper"

describe Licence do
  it "should initialize from a backdrop response with additional data" do
    response = {
      "data" => [{
                   "licenceUrlSlug" => "some-slug",
                   "licenceName" => ["Some Name"],
                   "_count" => 2
                 }]
    }

    licence = Licence.from_backdrop_response(response)

    licence.should be_a(Licence)
    licence.name.should == "Some Name"
    licence.slug.should == "some-slug"
  end

  it "should initialize from a backdrop response without additional data" do
    response = {
      "data" => [{
                   "licenceUrlSlug" => "some-slug",
                   "_count" => 2
                 }]
    }

    licence = Licence.from_backdrop_response(response)

    licence.should be_a(Licence)
    licence.name.should == "some-slug"
    licence.slug.should == "some-slug"
  end

  it "should raise an error if the response contains no data" do
    response = {
      "data" => []
    }

    expect {Licence.from_backdrop_response(response)}.to raise_error
  end


  it "should raise an error if the response contains more than one entry" do
    response = {
      "data" => [
        {
          "licenceUrlSlug" => "some-slug",
          "licenceName" => ["Some Name"],
          "_count" => 2
        },
        {
          "licenceUrlSlug" => "some-other-slug",
          "licenceName" => ["Some Other Name"],
          "_count" => 3
        }
      ]
    }

    expect {Licence.from_backdrop_response(response)}.to raise_error
  end
end