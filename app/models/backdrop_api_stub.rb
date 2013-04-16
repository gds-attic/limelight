require "songkick/transport"

class BackdropAPIStub
  def initialize(fixture_path=nil)
    if fixture_path.nil?
      @fixture_path = File.join(File.dirname(__FILE__), "../../spec/fixtures")
    else
      @fixture_path = fixture_path
    end
  end

  def get_licences
    fixture("licences")
  end

  def get_licence(slug)
    fixture(slug)
  end

  def get_authorities
    fixture("authorities")
  end

  def get_authority(slug)
    fixture(slug)
  end

  private
  def fixture(name)
    fixture_file = File.join(@fixture_path, "#{name}.json")
    JSON.parse(File.read(fixture_file))
  rescue *[JSON::ParserError, Errno::ENOENT] => e
    raise Songkick::Transport::UpstreamError.new e.message
  end
end
