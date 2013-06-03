Given(/^API responds with (.*)$/) do |fixture_file|
  path = Rails.root.join('spec', 'fixtures', fixture_file)
  
  httparty_stub = double("HttpParty")
  response_stub = double("response")
  
  httparty_stub.stub(:get)
    .and_return(response_stub)
  
  response_stub.stub(:data).and_return(JSON.parse(File.read(path)))
  Songkick::Transport::HttParty.stub(:new)
    .and_return(httparty_stub)
end

Then(/^there should be (\d+) licences$/) do |num_licences|
  page.all("#licences-list li").count.should == num_licences.to_i
end

Then(/^there should be (\d+) authorities$/) do |num_authorities|
  page.all("#authorities-list li").count.should == num_authorities.to_i
end

