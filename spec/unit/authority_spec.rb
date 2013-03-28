require "spec_helper"

describe Authority do
  it "should initialize from a backdrop response" do
    response = {
      "data" => {
        "authorityUrlSlug" => {
          "some-slug" => {
            "authorityName" => ["Some Name"]
          }
        }
      }
    }

    authority = Authority.from_backdrop_response('some-slug', response)

    authority.should be_a(Authority)
    authority.name.should == "Some Name"
    authority.slug.should == "some-slug"
  end

  it "should raise an error if the authority does not exist in the response" do
    response = {
      "data" => {
        "authorityUrlSlug" => {
          "some-slug" => {
            "authorityName" => ["Some Name"]
          }
        }
      }
    }

    expect {Authority.from_backdrop_response('something-not-in-response', response)}.to raise_error
  end
end