require_relative "../../features/backdrop_stub/backdrop_stub"
require_relative "../../features/backdrop_stub/stub_config"
require_relative "../../features/backdrop_stub/fixture_loader"

describe 'Stubbing out backdrop responses from files' do
  it 'should return fixture files matching parameters' do
    backdrop = BackdropStub.new(
        FixtureLoader.new('features/backdrop_stub_responses'),
        [StubConfig.new(
             {'filter_by' => 'id:foo', 'sort_by' => 'id:descending'},
             'fixture_for_spec.json')]
    )

    backdrop.response_for_params(
        {
            'filter_by' => 'id:foo',
            'sort_by' => 'id:descending',
            'method' => 'blah',
            'anything_else_rails_may_add' => 'something...'
        }
    ).should == {'this' => 'is used in the stub backdrop spec'}
  end

  it 'should return nil for parameters that do not match anything' do
    backdrop = BackdropStub.new(
        FixtureLoader.new('features/backdrop_stub_responses'),
        [StubConfig.new(
             {'filter_by' => 'id:foo', 'sort_by' => 'id:descending'},
             'fixture_for_spec.json')]
    )

    backdrop.response_for_params(
        {
            'method' => 'blah',
            'anything_else_rails_may_add' => 'something...'
        }
    ).should == nil
  end
end

describe 'Backdrop Stub' do
  it 'should return a json response for matching parameters' do
    parameters = {
        "filter_by" => "check:licensing"
    }

    fixture_loader = double()
    fixture_loader.stub(:load).with('test_stub.json') {
      'file contents...'
    }

    backdrop = BackdropStub.new(
        fixture_loader,
        [StubConfig.new({'filter_by' => "check:licensing"}, "test_stub.json")]
    )

    response = backdrop.response_for_params(parameters)

    response.should == 'file contents...'
  end

  it 'should distinguish between responses based on parameters' do
    params_for_a = {'filter_by' => 'a'}
    params_for_b = {'filter_by' => 'b'}

    fixture_loader = double()

    fixture_loader.stub(:load).with('a.json') { 'a' }
    fixture_loader.stub(:load).with('b.json') { 'b' }

    backdrop = BackdropStub.new(
        fixture_loader,
        [
            StubConfig.new({'filter_by' => 'a'}, 'a.json'),
            StubConfig.new({'filter_by' => 'b'}, 'b.json')
        ]
    )

    backdrop.response_for_params(params_for_a).should == 'a'
    backdrop.response_for_params(params_for_b).should == 'b'
  end

  describe 'StubConfig' do
    it 'should return hash with a query and the response for that query' do
      stub_config = StubConfig.new({'filter_by' => 'foo:bar'}, 'response')
      stub_config.query.should == {'filter_by' => 'foo:bar'}
      stub_config.response.should == 'response'
    end

    it 'should match parameters which contain all the entries in a query' do
      parameters = {'foo' => 'catfish', 'disco' => 'mongoose'}
      StubConfig.new({'foo' => 'catfish'}, nil).matches_parameters?(parameters).should == true
    end

    it 'should no match parameters which do not contain all the entries in a query' do
      parameters = {'disco' => 'mongoose'}
      StubConfig.new({'foo' => 'catfish'}, nil).matches_parameters?(parameters).should == false
    end
  end

  describe 'fixture loader' do
    it 'should load JSON from a file' do
      loader = FixtureLoader.new('features/backdrop_stub_responses')
      loader.load('fixture_for_spec.json').should == {'this' => 'is used in the stub backdrop spec'}
    end

    it 'should treat trailing slashes as optional' do
      loader = FixtureLoader.new('features/backdrop_stub_responses/')
      loader.load('fixture_for_spec.json').should == {'this' => 'is used in the stub backdrop spec'}
    end

    it 'should return nil when there is a file missing' do
      loader = FixtureLoader.new('features/backdrop_stub_responses/')
      loader.load('does_not_exist').should == nil
    end
  end
end
