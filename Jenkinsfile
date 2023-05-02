pipeline {
	agent {
		node {
			image "node:alpine"
			label "encyclopedia-project-agent"
	}
	triggers {
        pollSCM '* * * * *'
    }
	stages {
		stage("Build") {
			steps {
				sh "npm install"
			}
		}
		stage("Test") {
			steps {
				sh "npm test"
			}
		}
		stage("Deploy") {
			when  {
				branch "main"
			}
			steps {
				sh "docker build -t nodejs-encyclopedia-project:alpine-cors-prod-latest ."
				sh "docker tag nodejs-encyclopedia-project:alpine-cors-prod-latest thisisnothappening/nodejs-encyclopedia-project:alpine-cors-prod-latest"
				sh "docker push thisisnothappening/nodejs-encyclopedia-project:alpine-cors-prod-latest"

				sh "ssh -i '.ssh/amazon_linux_vm_key.pem' ec2-user@ec2-16-16-124-101.eu-north-1.compute.amazonaws.com"
				sh "sudo -s"
				sh "cd ~"
				
				sh "docker-compose up"
			}
		}
	}
}