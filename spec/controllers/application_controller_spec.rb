require "spec_helper"

describe ApplicationController do

  describe "use_stub_api" do
    controller do
      def index
        @my_action_data = backdrop_api.my_action_data
        render :nothing => true
      end
    end

    context "when use_stub_api is true" do
      let(:port) {"4567"}
      let(:url) {"/backdrop_stub"}
      before do
        Rails.configuration.use_stub_api = true
        Rails.configuration.backdrop_port = port
        Rails.configuration.backdrop_url = url
      end
      after do
        Rails.configuration.use_stub_api = false
        Rails.configuration.backdrop_url = "http://my.backdrop/path"
      end

      it "should use the real api with a local domain and port" do
        BackdropAPI.should_receive(:new)
          .with("127.0.0.1:#{port}#{url}", nil).and_call_original
        BackdropAPI.any_instance.should_receive(:my_action_data).and_return({"foo" => "bar"})

        get :index

        assert_response :ok

        assigns(:my_action_data).should == {"foo" => "bar"}
      end
    end

    context "when use_stub_api is false" do
      let(:url) {"http://my.backdrop/path"}
      before do
        Rails.configuration.use_stub_api = false
        Rails.configuration.backdrop_url = url
      end

      it "should use the real api with the backdrop url alone" do
        BackdropAPI.should_receive(:new)
          .with("http://my.backdrop/path", nil).and_call_original
        BackdropAPI.any_instance.should_receive(:my_action_data).and_return({"bar" => "foo"})

        get :index

        assert_response :ok

        assigns(:my_action_data).should == {"bar" => "foo"}
      end
    end
  end

  describe "#backdrop_port" do
    let(:port) {"4321"}
    before {Rails.configuration.backdrop_port = port}
    it "should return the configured port" do
      @controller.backdrop_port.should == ":#{port}" 
    end
  end

  describe "backdrop_url" do
    controller do
      def index
        @backdrop_url = backdrop_url
        render :nothing => true
      end
    end

    before(:each) do
      Rails.configuration.backdrop_url = nil
    end

    it "should use backdrop_url if configured" do
      Rails.configuration.backdrop_url = 'http://my.backdrop/path'

      get :index

      assert_response :ok
      assigns(:backdrop_url).should == "http://my.backdrop/path"
    end
  end
end
