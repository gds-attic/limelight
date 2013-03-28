require "spec_helper"

describe Authority do
  it "should initialize from a backdrop response" do
    response = JSON.parse <<-HERE
      {
        "data": [
          {
            "authorityUrlSlug": "some-slug"
          }
        ]
      }
    HERE

    authority = Authority.from_backdrop_response(response)

    authority.should be_a(Authority)
    authority.name.should == "some-slug"
    authority.slug.should == "some-slug"
  end

  it "should raise an error if response has no entries" do
    response = {
      "data" => []
    }

    expect {Authority.from_backdrop_response(response)}.to raise_error
  end

  it "should raise an error if response has more than one entry" do
    response = {
      "data" => [
        {"authorityUrlSlug" => "some-slug1"},
        {"authorityUrlSlug" => "some-slug2"},
        {"authorityUrlSlug" => "some-slug3"}
      ]
    }

    expect {Authority.from_backdrop_response(response)}.to raise_error
  end
end