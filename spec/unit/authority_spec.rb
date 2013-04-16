require "spec_helper"

describe Authority do
  it "should initialize from a backdrop response with additional data" do
    response = JSON.parse <<-HERE
      {
        "data": [
          {
            "authorityUrlSlug": "some-slug",
            "authorityName": ["Some name"]
          }
        ]
      }
    HERE

    authority = Authority.from_backdrop_response(response)

    authority.should be_a(Authority)
    authority.name.should == "Some name"
    authority.slug.should == "some-slug"
  end

  it "should initialize from a backdrop response without additional data" do
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

    expect { Authority.from_backdrop_response(response) }.to raise_error
  end

  it "should raise an error if response has more than one entry" do
    response = {
        "data" => [
            {"authorityUrlSlug" => "some-slug1"},
            {"authorityUrlSlug" => "some-slug2"},
            {"authorityUrlSlug" => "some-slug3"}
        ]
    }

    expect { Authority.from_backdrop_response(response) }.to raise_error
  end

  describe "getAuthorityShortName" do
    it "does not change names that have no redundant content" do
      names = [
          "Cheshire East",
          "Belfast Health and Social Care trust",
          "Department of Agriculture and Rural Development",
          "Driver and Vehicle Licensing Agency",
          "Food Standards Agency",
          "Northern Health and Social Care Trust",
          "Northern Ireland Environment Agency",
          "Office for Standards in Education, Children's Services and Skills"
      ]

      names.each { |name|
        name.should == Authority.new(nil, name).short_name
      }
    end

    it "strips 'Council' from name" do
      Authority.new(nil, "Aberdeenshire Council").short_name.should == "Aberdeenshire"
    end

    it "strips 'City Council' from name" do
      Authority.new(nil, "Aberdeen City Council").short_name.should == "Aberdeen"
    end

    it "strips 'County Council' from name" do
      Authority.new(nil, "Cardiff City Council").short_name.should == "Cardiff"
    end

    it "strips 'City and District Council' from name" do
      Authority.new(nil, "Armagh City and District Council").short_name.should == "Armagh"
    end

    it "strips 'District Council' from name" do
      Authority.new(nil, "Arun City and District Council").short_name.should == "Arun"
    end

    it "strips 'Borough Council' from name" do
      Authority.new(nil, "Amber Valley Borough Council").short_name.should == "Amber Valley"
    end

    it "strips 'County Borough Council' from name" do
      Authority.new(nil, "Bridgend County Borough Council").short_name.should == "Bridgend"
    end

    it "strips 'Metropolitan Borough Council' from name" do
      Authority.new(nil, "Barnsley Metropolitan Borough Council").short_name.should == "Barnsley"
    end

    it "strips 'City Metropolitan District Council' from name" do
      Authority.new(nil, "Wakefield City Metropolitan District Council").short_name.should == "Wakefield"
    end

    it "strips 'Borough Council of' from beginning of name" do
      Authority.new(nil, "Borough Council of King's Lynn and West Norfolk").short_name.should == "King's Lynn and West Norfolk"
    end

    it "strips 'City of' from beginning of name and 'Council' from end of name" do
      Authority.new(nil, "City of Edinburgh Council").short_name.should == "Edinburgh"
    end

    it "strips 'City and County of' from beginning of name" do
      Authority.new(nil, "City and County of Swansea").short_name.should == "Swansea"
    end

    it "does not strip 'City of' from 'City of London'" do
      Authority.new(nil, "City of London").short_name.should == "City of London"
    end

    it "strips 'London Borough of' from beginning of name" do
      Authority.new(nil, "London Borough of Barking and Dagenham").short_name.should == "Barking and Dagenham"
    end

    it "strips 'Royal Borough of' from beginning of name" do
      Authority.new(nil, "Royal Borough of Kensington and Chelsea").short_name.should == "Kensington and Chelsea"
    end

  end
end