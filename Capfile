# This should be edited and renamed to Capfile before being able
# to use Capistrano

load 'deploy' if respond_to?(:namespace) # cap2 differentiator

ssh_options[:forward_agent] = true
default_run_options[:pty] = true

set :application, "favrik.com"
set :repository,  "git@github.com:favrik/favrik.com.git"

set :scm, :git
set :deploy_via, :remote_cache

set :user, "favio"
set :scm_username, "favrik"

set :use_sudo, false

set :jekyll, "/var/lib/gems/1.8/bin/jekyll --lsi --pygments --rdiscount --permalink /:year/:month/:day/:title"

namespace :deploy do
    task :restart, :roles => :app, :except => { :no_release => true } do
        # Do nothing!
    end

    task :website_setup do
        run "cd #{current_release}/blog"
        run "#{jekyll} #{current_release}/blog #{current_release}/blog/_site"
    
        run "cp #{current_release}/blog/_site/recent_posts.html #{current_release}/website/_includes"

        run "cd #{current_release}/website"
        run "#{jekyll} #{current_release}/website #{current_release}/website/_site"
    end

    task :site_symlinks do
        # Common CSS files for website and blog
        run "ln -s #{current_release}/website/css #{current_release}/blog/_site/css"
        #run "mv #{current_release}/blog/_site/recent_posts.html #{current_release}/blog/_site/recent_posts.js"
        # Jobs symlink
        run "mkdir -p #{current_release}/website/_site/projects"
        run "ln -s /home/web/favrik.com/jobs #{current_release}/website/_site/projects/jobs"
    end

    
    after "deploy:symlink", "deploy:website_setup"
    after "deploy", "deploy:cleanup"
end



task :prod do
    role :web, "74.207.249.87"
    set :branch, "master"
    set :deploy_to, "/home/web/favrik.com/deploy"
    
    after "deploy:website_setup", "deploy:site_symlinks"
end






