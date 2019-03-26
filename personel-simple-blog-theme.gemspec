# frozen_string_literal: true

Gem::Specification.new do |spec|
  spec.name          = "personel-simple-blog-theme"
  spec.version       = "0.1.0"
  spec.authors       = ["Oğuzcan Demircan"]
  spec.email         = ["demircanoguzcan@gmail.com"]

  spec.summary       = "personel simple blog theme"
  spec.homepage      = "https://github.com/oguzcandemircan/personel-simple-blog-theme"
  spec.license       = "MIT"

  spec.files         = `git ls-files -z`.split("\x0").select { |f| f.match(%r!^(assets|_layouts|_includes|_sass|LICENSE|README)!i) }

  spec.add_runtime_dependency "jekyll-sitemap"
  spec.add_runtime_dependency "jekyll", "~> 3.8"
  spec.add_development_dependency "bundler", "2.0.1"
  spec.add_development_dependency "rake", "~> 12.0"
end