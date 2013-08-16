class FixtureLoader
  def initialize(path_to_fixture_dir)
    @path = path_to_fixture_dir
  end

  def load(file_name)
    begin
      JSON.parse(File.read(File.join(dir_path, file_name)))
    rescue Errno::ENOENT => e
      p "Unable to find file #{file_name}"
      nil
    end
  end

  private
  def dir_path
    path = @path
    unless path.end_with?('/')
      path = path + '/'
    end
    path
  end
end
