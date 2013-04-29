module ApplicationHelper

  def requirejs_base_url
    folder_name(requirejs_main_path)
  end

  def requirejs_main_path
    if Rails.application.assets.find_asset("production.js").present?
      asset_path("production.js")
    else
      asset_path("main.js")
    end
  end

  def requirejs_module_path(asset)
    trim_leading_slash(trim_extension(remove_requirejs_base_url(asset_path(asset))))
  end

  private

  def folder_name(path)
    path.gsub(%r{/[^./]+.js}, '')
  end

  def trim_leading_slash(remove_requirejs_base_url)
    remove_requirejs_base_url.gsub(%r{^/}, '')
  end

  def trim_extension(path)
    path.gsub(%r{.[^./]+$}, '')
  end

  def remove_requirejs_base_url(asset_path)
    asset_path.gsub(requirejs_base_url, '')
  end

end
