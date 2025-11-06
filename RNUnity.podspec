require 'json'

package = JSON.parse(File.read(File.join(__dir__, 'package.json')))

Pod::Spec.new do |s|
  s.name         = "RNUnity"
  s.version      = package['version']
  s.summary      = package['description']
  s.license      = package['license']
  s.homepage     = package['repository']['url']
  s.authors      = package['author']
  s.platform     = :ios, min_ios_version_supported
  s.source       = { :git => s.homepage, :tag => "v#{s.version}" }
  s.source_files  = "ios/RNUnity/**/*.{h,m}"
  s.requires_arc = true

  s.xcconfig = { 'FRAMEWORK_SEARCH_PATHS' => '$(inherited) $(BUILD_ROOT)/** $(CONFIGURATION_BUILD_DIR)/../**' }

  install_modules_dependencies(s)

end
