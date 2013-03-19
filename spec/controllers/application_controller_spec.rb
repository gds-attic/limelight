require "spec_helper"

describe ApplicationController do
  controller do
    def index
      @my_action_data = backdrop_api.my_action_data
      render :nothing => true
    end
  end

  describe "use_api_stub" do
    it "should use the api stub when use_api_stub is true" do
      Rails.configuration.use_api_stub = true
      BackdropAPI.should_not_receive(:new)
      BackdropAPIStub.any_instance.should_receive(:my_action_data).and_return({"foo" => "bar"})

      get :index

      assert_response :ok

      assigns(:my_action_data).should == {"foo" => "bar"}
    end

    it "should use the real api when use_api_stub is false" do
      Rails.configuration.use_api_stub = false
      BackdropAPIStub.should_not_receive(:new)
      BackdropAPI.any_instance.should_receive(:my_action_data).and_return({"bar" => "foo"})

      get :index

      assert_response :ok

      assigns(:my_action_data).should == {"bar" => "foo"}
    end
  end
end